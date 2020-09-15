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
  const data = await generateReport(client);

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
  let resIndexPattern: any = {};
  // get the saved search infos
  const ssParams = {
    index: '.kibana',
    id: 'search:' + reportParams.saved_search_id,
  };

  const ssInfos = await client.callAsInternalUser('get', ssParams);

  // get the sorting
  metaData.sorting = ssInfos._source.search.sort;

  // get the saved search type
  metaData.type = ssInfos._source.type;

  // get the filters
  metaData.filters =
    ssInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;

  // get the list of selected columns in the saved search.Otherwise select all the fields under the _source
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

async function generateReport(client: IClusterClient | IScopedClusterClient) {
  const report = { _source: metaData };

  const dataset: any = [];
  const arrayHits: any = [];
  let esData: any = {};

  // fetch ES query max size windows
  const indexPattern: string = report._source.paternName;
  const settings = await client.callAsInternalUser('indices.getSettings', {
    index: indexPattern,
    includeDefaults: true,
  });
  const maxResultSize: number =
    settings[indexPattern].settings.index.max_result_window != null
      ? settings[indexPattern].settings.index.max_result_window
      : settings[indexPattern].defaults.index.max_result_window;

  // build the ES Count query
  const countReq = buildQuery(report, 1);
  // Count the Data in ES
  const esCount = await client.callAsInternalUser('count', {
    index: indexPattern,
    body: countReq.toJSON(),
  });

  // If No data in elasticsearch
  const total = esCount.count;
  if (total === 0) {
    return {};
  }

  // build the ES query
  const reqBody = buildQuery(report, 0);

  if (total > maxResultSize) {
    // fetch the data
    esData = await fetchData(report, reqBody, maxResultSize);
    arrayHits.push(esData.hits);

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
    /*
    const extraFetch = total % maxResultSize;
    if (extraFetch > 0) {
      const extraEsData = await fetchData(report, reqBody, extraFetch);
      arrayHits.push(extraEsData.hits);
    }
    */
  } else {
    esData = await fetchData(report, reqBody, total);
    arrayHits.push(esData.hits);
  }

  // Get data
  dataset.push(getEsData(arrayHits, report));
  // Convert To csv
  return await convertToCSV(dataset);

  // Fetch the data from ES
  async function fetchData(report, reqBody, fetchSize) {
    const docvalues = [];
    for (const dateType of report._source.dateFields) {
      docvalues.push({
        field: dateType,
        format: 'date_hour_minute',
      });
    }

    const newBody = {
      query: reqBody.toJSON().query,
      docvalue_fields: docvalues,
    };

    return await client.callAsInternalUser('search', {
      index: report._source.paternName,
      scroll: '1m',
      body: newBody,
      size: fetchSize,
    });
  }
}
