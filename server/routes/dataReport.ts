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
import { DATA_REPORT_CONFIG } from './utils/constants';
import {
	metaData,
	getSelectedFields,
	buildQuery,
	getEsData,
	convertToCSV,
} from './utils/dataReportHelpers';

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
						//Get fields of type Date
						for (let item of JSON.parse(metaData.fields)) {
							if (item.type === 'date') {
								metaData.dateFields.push(item.name);
							}
						}
					}
				}

				//save the meta data to the report index to be updated with the right mapping
				const report = await context.core.elasticsearch.adminClient.callAsInternalUser(
					'index',
					{
						index: 'report',
						body: metaData,
					}
				);

				return response.ok({
					body: { report },
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

	//download the data-report from meta data
	router.get(
		{
			path: `${API_PREFIX}/data-report/generate/{reportId}/{nbScroll}`,
			validate: {
				params: schema.object({
					reportId: schema.string(),
					nbScroll: schema.number({ min: 0 }),
				}),
			},
		},
		async (
			context,
			request,
			response
		): Promise<IKibanaResponse<any | ResponseError>> => {
			try {
				let dataset: any = [];
				let arrayHits: any = [];
				//get the metadata of the report from ES using reportId
				const report = await context.core.elasticsearch.adminClient.callAsInternalUser(
					'get',
					{
						index: 'report',
						id: request.params.reportId,
					}
				);

				//fetch  ES query max size windows
				let settings = await context.core.elasticsearch.adminClient.callAsInternalUser(
					'indices.getSettings',
					{
						index: 'report',
						includeDefaults: true,
					}
				);

				const fetch_size = settings.report.defaults.index.max_result_window;
				//const fetch_size = 1000;
				const scrollCount = request.params.nbScroll;
				const nbRows = scrollCount * fetch_size;

				//build the ES query
				const reqBody = buildQuery(report);

				//Fecth the data from ES
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

				//If No data in elasticsearch
				if (esData.hits.total.value === 0) {
					return response.custom({
						statusCode: 200,
						body: 'No data in Elasticsearch.',
					});
				}

				arrayHits.push(esData.hits);

				if (scrollCount >= 2) {
					//The nbRows > Max Rows CSV then perform the scroll until maxrows
					if (nbRows > DATA_REPORT_CONFIG.maxRows) {
						const maxScrollCount = DATA_REPORT_CONFIG.maxRows / fetch_size;
						for (let i = 0; i < maxScrollCount - 1; i++) {
							let resScroll = await context.core.elasticsearch.adminClient.callAsInternalUser(
								'scroll',
								{
									scrollId: esData._scroll_id,
									scroll: '1m',
								}
							);
							if (Object.keys(resScroll.hits.hits).length > 0) {
								arrayHits.push(resScroll.hits);
							} else {
								break; //end of data in ES
							}
						}
						//Get data
						dataset.push(getEsData(arrayHits, report));
						let res = {
							message: `Truncated Data! The requested data has reached the exporting size limit of ${DATA_REPORT_CONFIG.maxRows} rows!`,
							total: esData.hits.total.value,
							datasetCount: dataset[0].length,
							data: dataset,
						};
						return response.custom({
							statusCode: 200,
							body: res,
						});
					} else {
						for (let i = 0; i < scrollCount - 1; i++) {
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
					}
				} else {
					//default number of scrolls is 1.
					//The data in ES > fetch_size return up to the fetch_size with truncated data.
					if (esData.hits.total.value > fetch_size) {
						//Get data
						dataset.push(getEsData(arrayHits, report));
						const res = {
							message: `Truncated Data! The requested data has reached the limit of Elasticsearch query size of ${fetch_size}. Please increase the limit and try again !`,
							total: esData.hits.total.value,
							datasetCount: dataset[0].length,
							data: dataset,
						};
						return response.custom({
							statusCode: 200,
							body: res,
						});
					}
				}

				//Get data
				dataset.push(getEsData(arrayHits, report));

				//Convert To csv
				const csv = await convertToCSV(dataset);

				const data = {
					total: esData.hits.total.value,
					datasetCount: dataset[0].length,
					data: dataset,
					csv,
				};
				// To do: Stream data back on base 64  to be defined ?
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
		}
	);
}
