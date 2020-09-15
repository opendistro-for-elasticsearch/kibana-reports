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

import { v1 as uuidv1 } from 'uuid';
import { buildQuery, convertToCSV, getEsData, getSelectedFields, metaData } from './utils/dataReportHelpers';
import { IClusterClient, IScopedClusterClient } from '../../../../src/core/server';

export async function createSavedSearchReport(
  report: any,
  client: IClusterClient | IScopedClusterClient
) {
  await populateMetaData(client, report.report_params);
  const data = await generateCsvData(client);

  const timeCreated = new Date().toISOString();
  const fileName = getFileName() + '.csv';
  return {
    timeCreated,
    dataUrl: data,
    fileName,
  };

  function getFileName(): string {
    return `${report.report_name}_${timeCreated}_${uuidv1()}`;
  }
}

async function populateMetaData(
  client: IClusterClient | IScopedClusterClient,
  reportParams: any
) {
  metaData.saved_search_id = reportParams.saved_search_id;
  metaData.report_format = reportParams.report_format;
  metaData.start = reportParams.start;
  metaData.end = reportParams.end;

  // Get saved search info
  let resIndexPattern: any = {};
  const ssParams = {
    index: '.kibana',
    id: 'search:' + reportParams.saved_search_id,
  };
  const ssInfos = await client.callAsInternalUser('get', ssParams);

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
      const indexPattern = await client.callAsInternalUser('get', {
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

async function generateCsvData(client: IClusterClient | IScopedClusterClient) {
  let esData: any = {};
  const arrayHits: any = [];
  const dataset: any = [];
  const report = { _source: metaData };
  const indexPattern: string = report._source.paternName;
  const maxResultSize: number = await getMaxResultSize();
  const esCount = await getEsDataSize();

  // Return nothing if No data in elasticsearch
  const total = esCount.count;
  if (total === 0) {
    return {};
  }

  const reqBody = buildRequestBody(buildQuery(report, 0));
  if (total > maxResultSize) {
    await getEsDataByScroll();
  } else {
    await getEsDataBySearch();
  }

  // Parse ES data and convert to CSV
  dataset.push(getEsData(arrayHits, report));
  return await convertToCSV(dataset);

  // Fetch ES query max size windows to decide search or scroll
  async function getMaxResultSize() {
    const settings = await client.callAsInternalUser('indices.getSettings', {
      index: indexPattern,
      includeDefaults: true,
    });
    // The location of max result window differs if set by user.
    return settings[indexPattern].settings.index.max_result_window != null
      ? settings[indexPattern].settings.index.max_result_window
      : settings[indexPattern].defaults.index.max_result_window;
  }

  // Build the ES Count query to count the size of result
  async function getEsDataSize() {
    const countReq = buildQuery(report, 1);
    return await client.callAsInternalUser('count', {
      index: indexPattern,
      body: countReq.toJSON(),
    });
  }

  async function getEsDataByScroll() {
    // Open scroll context by fetching first batch
    esData = await client.callAsInternalUser('search', {
      index: report._source.paternName,
      scroll: '1m',
      body: reqBody,
      size: maxResultSize,
    });
    arrayHits.push(esData.hits);

    // Start scrolling till the end
    const nbScroll = Math.floor(total / maxResultSize);
    for (let i = 0; i < nbScroll; i++) {
      const resScroll = await client.callAsInternalUser('scroll', {
        scrollId: esData._scroll_id,
        scroll: '1m',
      });
      if (Object.keys(resScroll.hits.hits).length > 0) {
        arrayHits.push(resScroll.hits);
      }
    }

    // Clear scroll context
    await client.callAsInternalUser('clearScroll', {
      scrollId: esData._scroll_id,
    });
  }

  async function getEsDataBySearch() {
    esData = await client.callAsInternalUser('search', {
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
}
