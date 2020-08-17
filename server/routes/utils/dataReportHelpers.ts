import { async } from 'rxjs/internal/scheduler/async';
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

import { DATA_REPORT_CONFIG } from './constants';

const esb = require('elastic-builder');
const moment = require('moment');
const converter = require('json-2-csv');

export var metaData = {
  saved_search_id: <string>null,
  report_format: <string>null,
  start: <string>null,
  end: <string>null,
  fields: <string>null,
  type: <string>null,
  timeFieldName: <string>null,
  sorting: <string>null,
  fields_exist: <boolean>false,
  selectedFields: <any>[],
  paternName: <string>null,
  filters: <any>[],
  dateFields: <any>[],
};

// Get the selected columns by the user.
export const getSelectedFields = async (columns) => {
  for (let column of columns) {
    if (column !== '_source') {
      metaData.fields_exist = true;
      metaData.selectedFields.push(column);
    } else {
      metaData.selectedFields.push('_source');
    }
  }
};

//Build the ES query from the meta data
// is_count is set to 1 if we building the count query but 0 if we building the fetch data query
export const buildQuery = (report, is_count) => {
  let requestBody = esb.boolQuery();
  const filters = report._source.filters;
  for (let item of JSON.parse(filters).filter) {
    if (item.meta.disabled === false) {
      switch (item.meta.negate) {
        case false:
          switch (item.meta.type) {
            case 'phrase':
              requestBody.must(
                esb.matchPhraseQuery(item.meta.key, item.meta.params.query)
              );
              break;
            case 'exists':
              requestBody.must(esb.existsQuery(item.meta.key));
              break;
            case 'phrases':
              if (item.meta.value.indexOf(',') > -1) {
                const valueSplit = item.meta.value.split(', ');
                for (const [key, incr] of valueSplit.entries()) {
                  requestBody.should(esb.matchPhraseQuery(item.meta.key, incr));
                }
              } else {
                requestBody.should(
                  esb.matchPhraseQuery(item.meta.key, item.meta.params.query)
                );
              }
              requestBody.minimumShouldMatch(1);
              break;
          }
          break;
        case true:
          switch (item.meta.type) {
            case 'phrase':
              requestBody.mustNot(
                esb.matchPhraseQuery(item.meta.key, item.meta.params.query)
              );
              break;
            case 'exists':
              requestBody.mustNot(esb.existsQuery(item.meta.key));
              break;
            case 'phrases':
              if (item.meta.value.indexOf(',') > -1) {
                const valueSplit = item.meta.value.split(', ');
                for (const [key, incr] of valueSplit.entries()) {
                  requestBody.should(esb.matchPhraseQuery(item.meta.key, incr));
                }
              } else {
                requestBody.should(
                  esb.matchPhraseQuery(item.meta.key, item.meta.params.query)
                );
              }
              requestBody.minimumShouldMatch(1);
              break;
          }
          break;
      }
    }
  }
  //search part
  let searchQuery = JSON.parse(filters)
    .query.query.replace(/ and /g, ' AND ')
    .replace(/ or /g, ' OR ')
    .replace(/ not /g, ' NOT ');
  if (searchQuery) {
    requestBody.must(esb.queryStringQuery(searchQuery));
  }

  if (report._source.timeFieldName && report._source.timeFieldName.length > 0) {
    requestBody.must(
      esb
        .rangeQuery(report._source.timeFieldName)
        .format('epoch_millis')
        .gte(report._source.start)
        .lte(report._source.end)
    );
  }
  if (is_count) {
    return esb.requestBodySearch().query(requestBody);
  }

  //Add the Sort to the query
  let reqBody = esb.requestBodySearch().query(requestBody).version(true);

  if (report._source.sorting.length > 0) {
    if (report._source.sorting.length === 1)
      reqBody.sort(
        esb.sort(report._source.sorting[0][0], report._source.sorting[0][1])
      );
    else
      reqBody.sort(
        esb.sort(report._source.sorting[0], report._source.sorting[1])
      );
  }

  //get the selected fields only
  if (report._source.fields_exist) {
    reqBody.source({ includes: report._source.selectedFields });
  }
  return reqBody;
};

// Fetch the data from ES
export const getEsData = (arrayHits, report) => {
  let hits: any = [];
  for (let valueRes of arrayHits) {
    for (let data of valueRes.hits) {
      const fields = data.fields;
      //get  all the fields of type date and fromat them to excel format
      for (let dateType of report._source.dateFields) {
        if (data._source[dateType]) {
          data._source[dateType] = moment(fields[dateType][0]).format(
            DATA_REPORT_CONFIG.excelDateFormat
          );
        }
      }
      delete data['fields'];
      if (report._source.fields_exist === true) {
        let result = traverse(data, report._source.selectedFields);
        hits.push(result);
      } else {
        hits.push(data);
      }
    }
  }
  return hits;
};

//Convert the data to Csv format
export const convertToCSV = async (dataset) => {
  let convertedData: any = [];
  const options = {
    delimiter: { field: ',' },
    emptyFieldValue: ' ',
  };
  await converter.json2csvAsync(dataset, options).then((csv) => {
    convertedData = csv;
  });
  return convertedData;
};

//Return only the selected fields
function traverse(data, keys, result = {}) {
  for (let k of Object.keys(data)) {
    if (keys.includes(k)) {
      result = Object.assign({}, result, {
        [k]: data[k],
      });
      continue;
    }
    if (
      data[k] &&
      typeof data[k] === 'object' &&
      Object.keys(data[k]).length > 0
    ) {
      result = traverse(data[k], keys, result);
    }
  }
  return result;
}
