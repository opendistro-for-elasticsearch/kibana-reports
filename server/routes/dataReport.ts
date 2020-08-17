/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { schema } from '@kbn/config-schema';
import {
  IRouter,
  IKibanaResponse,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { parseEsErrorResponse } from './utils/helpers';
import { buildQuery, getEsData, convertToCSV } from './utils/dataReportHelpers';

export default function (router: IRouter) {
  //download the data-report from meta data
  router.get(
    {
      path: `${API_PREFIX}/data-report/generate/{reportId}`,
      validate: {
        params: schema.object({
          reportId: schema.string(),
        }),
        query: schema.object({
          nbRows: schema.maybe(schema.number({ min: 1 })),
          scroll_size: schema.maybe(schema.number({ min: 1 })),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      try {
        let { nbRows, scroll_size } = request.query as {
          nbRows?: number;
          scroll_size?: number;
        };

        let dataset: any = [];
        let arrayHits: any = [];
        let esData: any = {};
        let message: string = 'success';
        let fetch_size: number = 0;
        let nbScroll: number = 0;

        //get the metadata of the report from ES using reportId
        const report = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'get',
          {
            index: 'datareport',
            id: request.params.reportId,
          }
        );

        //fetch ES query max size windows
        const indexPattern: string = report._source.paternName;
        let settings = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'indices.getSettings',
          {
            index: indexPattern,
            includeDefaults: true,
          }
        );

        const default_max_size: number =
          settings[indexPattern].defaults.index.max_result_window;

        //build the ES Count query
        const countReq = buildQuery(report, 1);

        //Count the Data in ES
        const esCount = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'count',
          {
            index: indexPattern,
            body: countReq.toJSON(),
          }
        );

        //If No data in elasticsearch
        if (esCount.count === 0) {
          return response.custom({
            statusCode: 200,
            body: 'No data in Elasticsearch.',
          });
        }

        //build the ES query
        const reqBody = buildQuery(report, 0);

        //first case: No args passed. No need to scroll
        if (!nbRows && !scroll_size) {
          if (esCount.count > default_max_size) {
            message = `Truncated Data! The requested data has reached the limit of Elasticsearch query size of ${default_max_size}. Please increase the limit and try again !`;
          }
          esData = await fetchData(report, reqBody, default_max_size);
          arrayHits.push(esData.hits);
        }

        //Second case: 1 arg passed

        //Only Number of Rows is passed

        if (nbRows && !scroll_size) {
          let rows = 0;
          if (nbRows > default_max_size) {
            //fetch the data
            fetch_size = default_max_size;
            esData = await fetchData(report, reqBody, fetch_size);
            arrayHits.push(esData.hits);
            //perform the scroll
            if (nbRows > esCount.count) {
              rows = esCount.count;
              nbScroll = Math.floor(esCount.count / default_max_size);
            } else {
              rows = nbRows;
              nbScroll = Math.floor(nbRows / default_max_size);
            }
            // let data = {
            //   esData,
            //   rows,
            //   nbScroll,
            //   fetch_size,
            //   report,
            //   reqBody,
            // };

            for (let i = 0; i < nbScroll - 1; i++) {
              let resScroll = await context.core.elasticsearch.adminClient.callAsInternalUser(
                'scroll',
                {
                  scrollId: esData._scroll_id,
                  scroll: '1m',
                }
              );
              if (Object.keys(resScroll.hits.hits).length > 0) {
                arrayHits.push(resScroll.hits);
              }
            }
            let extra_fetch = rows % fetch_size;
            if (extra_fetch > 0) {
              let extra_esData = await fetchData(report, reqBody, extra_fetch);
              arrayHits.push(extra_esData.hits);
            }
          } else {
            fetch_size = nbRows;
            esData = await fetchData(report, reqBody, fetch_size);
            arrayHits.push(esData.hits);
          }
        } else if (scroll_size && !nbRows) {
          //Only scroll_size is passed
          if (esCount.count > default_max_size) {
            fetch_size = scroll_size;
            nbScroll = Math.floor(esCount.count / scroll_size);
            if (scroll_size > default_max_size) {
              fetch_size = default_max_size;
              message =
                'cannot perform a scroll with a scroll size bigger than the max fetch size';
              nbScroll = Math.floor(esCount.count / default_max_size);
            }
            //fetch the data
            esData = await fetchData(report, reqBody, fetch_size);
            arrayHits.push(esData.hits);
            //perform the scroll
            for (let i = 0; i < nbScroll - 1; i++) {
              let resScroll = await context.core.elasticsearch.adminClient.callAsInternalUser(
                'scroll',
                {
                  scrollId: esData._scroll_id,
                  scroll: '1m',
                }
              );
              if (Object.keys(resScroll.hits.hits).length > 0) {
                arrayHits.push(resScroll.hits);
              }
            }
            let extra_fetch = esCount.count % fetch_size;
            if (extra_fetch > 0) {
              let extra_esData = await fetchData(report, reqBody, extra_fetch);
              arrayHits.push(extra_esData.hits);
            }
          } else {
            //no need to scroll
            esData = await fetchData(report, reqBody, esCount.count);
            arrayHits.push(esData.hits);
          }
        }
        //Third case: 2 args passed
        if (scroll_size && nbRows) {
          if (nbRows > esCount.count) {
            if (esCount.count > default_max_size) {
              //perform the scroll
              if (scroll_size > default_max_size) {
                message =
                  'cannot perform a scroll with a scroll size bigger than the max fetch size';
                fetch_size = default_max_size;
                nbScroll = Math.floor(esCount.count / default_max_size);
              } else {
                fetch_size = scroll_size;
                nbScroll = Math.floor(esCount.count / scroll_size);
              }

              //fetch the data then perform the scroll
              esData = await fetchData(report, reqBody, fetch_size);
              arrayHits.push(esData.hits);

              //perform the scroll
              for (let i = 0; i < nbScroll - 1; i++) {
                let resScroll = await context.core.elasticsearch.adminClient.callAsInternalUser(
                  'scroll',
                  {
                    scrollId: esData._scroll_id,
                    scroll: '1m',
                  }
                );
                if (Object.keys(resScroll.hits.hits).length > 0) {
                  arrayHits.push(resScroll.hits);
                }
              }
              let extra_fetch = esCount.count % fetch_size;
              if (extra_fetch > 0) {
                let extra_esData = await fetchData(
                  report,
                  reqBody,
                  extra_fetch
                );
                arrayHits.push(extra_esData.hits);
              }
            } else {
              //no need to perform the scroll just fetch the data
              fetch_size = esCount.count;
              esData = await fetchData(report, reqBody, fetch_size);
              arrayHits.push(esData.hits);
            }
          } else {
            if (nbRows > default_max_size) {
              if (scroll_size > default_max_size) {
                message =
                  'cannot perform a scroll with a scroll size bigger than the max fetch size';
                fetch_size = default_max_size;
                nbScroll = Math.floor(nbRows / default_max_size);
              } else {
                fetch_size = scroll_size;
                nbScroll = Math.floor(nbRows / scroll_size);
              }
              //fetch the data then perform the scroll
              esData = await fetchData(report, reqBody, fetch_size);
              arrayHits.push(esData.hits);
              //perform the scroll

              for (let i = 0; i < nbScroll - 1; i++) {
                let resScroll = await context.core.elasticsearch.adminClient.callAsInternalUser(
                  'scroll',
                  {
                    scrollId: esData._scroll_id,
                    scroll: '1m',
                  }
                );
                if (Object.keys(resScroll.hits.hits).length > 0) {
                  arrayHits.push(resScroll.hits);
                }
              }
              let extra_fetch = nbRows % fetch_size;
              if (extra_fetch > 0) {
                let extra_esData = await fetchData(
                  report,
                  reqBody,
                  extra_fetch
                );
                arrayHits.push(extra_esData.hits);
              }
            } else {
              //just fetch the data no need of scroll
              esData = await fetchData(report, reqBody, nbRows);
              arrayHits.push(esData.hits);
            }
          }
        }

        //Get data
        dataset.push(getEsData(arrayHits, report));

        //Convert To csv
        const csv = await convertToCSV(dataset);

        const data = {
          default_max_size,
          message,
          nbScroll,
          total: esCount.count,
          datasetCount: dataset[0].length,
          dataset,
          csv,
        };

        // To do: return the data
        return response.ok({
          body: data,
          headers: {
            'content-type': 'application/json',
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to generate the report: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode || 500,
          body: parseEsErrorResponse(error),
        });
      }

      //Fecth the data from ES
      async function fetchData(report, reqBody, fetch_size) {
        const docvalues = [];
        for (let dateType of report._source.dateFields) {
          docvalues.push({
            field: dateType,
            format: 'date_hour_minute',
          });
        }

        const newBody = {
          query: reqBody.toJSON().query,
          docvalue_fields: docvalues,
        };

        const esData = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'search',
          {
            index: report._source.paternName,
            scroll: '1m',
            body: newBody,
            size: fetch_size,
          }
        );
        return esData;
      }
    }
  );
}
