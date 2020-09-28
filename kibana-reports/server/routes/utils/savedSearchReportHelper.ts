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

import {
  buildQuery,
  convertToCSV,
  getEsData,
  getSelectedFields,
  metaData,
} from './dataReportHelpers';
import {
  IClusterClient,
  IScopedClusterClient,
} from '../../../../../src/core/server';
import { getFileName, callCluster } from './helpers';

/**
 * Specify how long scroll context should be maintained for scrolled search
 */
const scrollTimeout = '1m';

export async function createSavedSearchReport(
  report: any,
  client: IClusterClient | IScopedClusterClient
): Promise<{ timeCreated: number; dataUrl: string; fileName: string }> {
  const params = report.report_definition.report_params;
  const reportFormat = params.core_params.report_format;
  const reportName = params.report_name;

  await populateMetaData(client, report);
  const data = await generateReportData(client, params.core_params);

  const curTime = new Date();
  const timeCreated = curTime.valueOf();
  const fileName = getFileName(reportName, curTime) + '.' + reportFormat;
  return {
    timeCreated,
    dataUrl: data,
    fileName,
  };
}

/**
 * Populate parameters and saved search info related to meta data object.
 * @param client  ES client
 * @param report  Report input
 */
async function populateMetaData(
  client: IClusterClient | IScopedClusterClient,
  report: any
) {
  metaData.saved_search_id =
    report.report_definition.report_params.core_params.saved_search_id;
  metaData.report_format =
    report.report_definition.report_params.core_params.report_format;
  metaData.start = report.time_from;
  metaData.end = report.time_to;

  // Get saved search info
  let resIndexPattern: any = {};
  const ssParams = {
    index: '.kibana',
    id: 'search:' + metaData.saved_search_id,
  };
  const ssInfos = await callCluster(client, 'get', ssParams);

  metaData.sorting = ssInfos._source.search.sort;
  metaData.type = ssInfos._source.type;
  metaData.filters =
    ssInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;

  // Get the list of selected columns in the saved search.Otherwise select all the fields under the _source
  await getSelectedFields(ssInfos._source.search.columns);

  // Get index name
  for (const item of ssInfos._source.references) {
    if (item.name === JSON.parse(metaData.filters).indexRefName) {
      // Get index-pattern information
      const indexPattern = await callCluster(client, 'get', {
        index: '.kibana',
        id: 'index-pattern:' + item.id,
      });
      resIndexPattern = indexPattern._source['index-pattern'];
      metaData.paternName = resIndexPattern.title;
      (metaData.timeFieldName = resIndexPattern.timeFieldName),
        (metaData.fields = resIndexPattern.fields); // Get all fields
      // Getting fields of type Date
      for (const item of JSON.parse(metaData.fields)) {
        if (item.type === 'date') {
          metaData.dateFields.push(item.name);
        }
      }
    }
  }
}

/**
 * Generate CSV data by query and convert ES data set.
 * @param client  ES client
 * @param limit   limit size of result data set
 */
async function generateReportData(
  client: IClusterClient | IScopedClusterClient,
  params: any
) {
  let esData: any = {};
  const arrayHits: any = [];
  const report = { _source: metaData };
  const indexPattern: string = report._source.paternName;
  const maxResultSize: number = await getMaxResultSize();
  const esCount = await getEsDataSize();

  const total = Math.min(esCount.count, params.limit);
  if (total === 0) {
    return '';
  }

  const reqBody = buildRequestBody(buildQuery(report, 0));
  if (total > maxResultSize) {
    await getEsDataByScroll();
  } else {
    await getEsDataBySearch();
  }
  return convertEsDataToCsv();

  // Fetch ES query max size windows to decide search or scroll
  async function getMaxResultSize() {
    const settings = await callCluster(client, 'indices.getSettings', {
      index: indexPattern,
      includeDefaults: true,
    });
    // The location of max result window differs if default overridden.
    return settings[indexPattern].settings.index.max_result_window != null
      ? settings[indexPattern].settings.index.max_result_window
      : settings[indexPattern].defaults.index.max_result_window;
  }

  // Build the ES Count query to count the size of result
  async function getEsDataSize() {
    const countReq = buildQuery(report, 1);
    return await callCluster(client, 'count', {
      index: indexPattern,
      body: countReq.toJSON(),
    });
  }

  async function getEsDataByScroll() {
    // Open scroll context by fetching first batch
    esData = await callCluster(client, 'search', {
      index: report._source.paternName,
      scroll: scrollTimeout,
      body: reqBody,
      size: maxResultSize,
    });
    arrayHits.push(esData.hits);

    // Start scrolling till the end
    const nbScroll = Math.floor(total / maxResultSize);
    for (let i = 0; i < nbScroll; i++) {
      const resScroll = await callCluster(client, 'scroll', {
        scrollId: esData._scroll_id,
        scroll: scrollTimeout,
      });
      if (Object.keys(resScroll.hits.hits).length > 0) {
        arrayHits.push(resScroll.hits);
      }
    }

    // Clear scroll context
    await callCluster(client, 'clearScroll', {
      scrollId: esData._scroll_id,
    });
  }

  async function getEsDataBySearch() {
    esData = await callCluster(client, 'search', {
      index: report._source.paternName,
      body: reqBody,
      size: total,
    });
    arrayHits.push(esData.hits);
  }

  function buildRequestBody(query: any) {
    const docvalues = [];
    for (const dateType of report._source.dateFields) {
      docvalues.push({
        field: dateType,
        format: 'date_hour_minute',
      });
    }

    return {
      query: query.toJSON().query,
      docvalue_fields: docvalues,
    };
  }

  // Parse ES data and convert to CSV
  async function convertEsDataToCsv() {
    const dataset: any = [];
    dataset.push(getEsData(arrayHits, report, params));
    return await convertToCSV(dataset);
  }
}
