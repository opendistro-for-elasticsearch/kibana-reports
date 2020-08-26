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
import { dataReportSchema } from '../model';
import { parseEsErrorResponse } from './utils/helpers';
import { metaData, getSelectedFields } from './utils/dataReportHelpers';
const axios = require('axios');

export default function (router: IRouter) {
  //generate report csv meta data
  router.post(
    {
      path: `${API_PREFIX}/data-report/metadata`,
      validate: {
        body: schema.any(),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      // input validation
      try {
        dataReportSchema.validate(request.body);
      } catch (error) {
        return response.badRequest({ body: error });
      }
      try {
        let dataReport = request.body;
        metaData.saved_search_id = dataReport.saved_search_id;
        metaData.report_format = dataReport.report_format;
        metaData.start = dataReport.start;
        metaData.end = dataReport.end;
        let resIndexPattern: any = {};

        //get the saved search infos
        const ssParams = {
          index: '.kibana',
          id: 'search:' + dataReport.saved_search_id,
        };

        const ssInfos = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'get',
          ssParams
        );

        // get the sorting
        metaData.sorting = ssInfos._source.search.sort;

        // get the saved search type
        metaData.type = ssInfos._source.type;

        // get the filters
        metaData.filters =
          ssInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;

        //get the list of selected columns in the saved search.Otherwise select all the fields under the _source
        await getSelectedFields(ssInfos._source.search.columns);

        //Get index name
        for (let item of ssInfos._source.references) {
          if (item.name === JSON.parse(metaData.filters).indexRefName) {
            //Get index-pattern informations
            const indexPattern = await context.core.elasticsearch.adminClient.callAsInternalUser(
              'get',
              {
                index: '.kibana',
                id: 'index-pattern:' + item.id,
              }
            );
            resIndexPattern = indexPattern._source['index-pattern'];
            metaData.paternName = resIndexPattern.title;
            (metaData.timeFieldName = resIndexPattern.timeFieldName),
              (metaData.fields = resIndexPattern.fields); //Get all fields
            //Getting fields of type Date
            for (let item of JSON.parse(metaData.fields)) {
              if (item.type === 'date') {
                metaData.dateFields.push(item.name);
              }
            }
          }
        }

        //save the meta data to the dataReport index to be updated with the right mapping
        const report = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'index',
          {
            index: 'datareport',
            body: metaData,
          }
        );

        return response.ok({
          body: { report, metaData },
          headers: {
            'content-type': 'application/json',
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to generate the report meta data: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode || 500,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );
}
