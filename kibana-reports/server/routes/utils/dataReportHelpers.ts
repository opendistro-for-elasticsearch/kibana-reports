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

import esb, { Sort } from 'elastic-builder';
import moment from 'moment';
import converter from 'json-2-csv';
import _ from 'lodash';

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
  const selectedFields = [];
  for (let column of columns) {
    if (column !== '_source') {
      metaData.fields_exist = true;
      selectedFields.push(column);
    } else {
      selectedFields.push('_source');
    }
  }
  metaData.selectedFields = selectedFields;
};

// Build the ES query from the meta data
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
        .gte(report._source.start - 1)
        .lte(report._source.end + 1)
    );
  }
  if (is_count) {
    return esb.requestBodySearch().query(requestBody);
  }

  //Add the Sort to the query
  let reqBody = esb.requestBodySearch().query(requestBody).version(true);

  if (report._source.sorting.length > 0) {
    const sortings: Sort[] = report._source.sorting.map((element: string[]) => {
      return esb.sort(element[0], element[1]);
    });
    reqBody.sorts(sortings);
  }

  //get the selected fields only
  if (report._source.fields_exist) {
    reqBody.source({ includes: report._source.selectedFields });
  }
  return reqBody;
};

// Fetch the data from ES
export const getEsData = (arrayHits, report, params) => {
  let hits: any = [];
  for (let valueRes of arrayHits) {
    for (let data of valueRes.hits) {
      const fields = data.fields;
      // get all the fields of type date and format them to excel format
      for (let dateType of report._source.dateFields) {
        if (data._source[dateType]) {
          data._source[dateType] = moment(fields[dateType][0]).format(
            DATA_REPORT_CONFIG.excelDateFormat
          );
        }
      }
      delete data['fields'];
      if (report._source.fields_exist === true) {
        let result = traverse(data._source, report._source.selectedFields);
        hits.push(params.excel ? sanitize(result) : result);
      } else {
        hits.push(params.excel ? sanitize(data) : data);
      }

      // Truncate to expected limit size
      if (hits.length >= params.limit) {
        return hits;
      }
    }
  }
  return hits;
};

//Convert the data to Csv format
export const convertToCSV = async (dataset) => {
  let convertedData: any = [];
  const options = {
    delimiter: { field: ',', eol: '\n' },
    emptyFieldValue: ' ',
  };
  await converter.json2csvAsync(dataset[0], options).then((csv) => {
    convertedData = csv;
  });
  return convertedData;
};

function flattenHits(hits, result = {}, prefix = '') {
  for (const [key, value] of Object.entries(hits)) {
    if (!hits.hasOwnProperty(key)) continue;
    if (
      value != null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0
    ) {
      flattenHits(value, result, prefix + key + '.');
    } else {
      result[prefix + key] = value;
    }
  }
  return result;
}

//Return only the selected fields
function traverse(data, keys, result = {}) {
  data = flattenHits(data);
  const sourceKeys = Object.keys(data);
  keys.forEach((key) => {
    const value = _.get(data, key, undefined);
    if (value !== undefined) result[key] = value;
    else {
      Object.keys(data)
        .filter((sourceKey) => sourceKey.startsWith(key + '.'))
        .forEach((sourceKey) => (result[sourceKey] = data[sourceKey]));
    }
  });
  return result;
}

/**
 * Escape special characters if field value prefixed with.
 * This is intend to avoid CSV injection in Microsoft Excel.
 * @param doc   document
 */
function sanitize(doc: any) {
  for (const field in doc) {
    if (doc[field] == null) continue;
    if (
      doc[field].toString().startsWith('+') ||
      (doc[field].toString().startsWith('-') &&
        typeof doc[field] !== 'number') ||
      doc[field].toString().startsWith('=') ||
      doc[field].toString().startsWith('@')
    ) {
      doc[field] = "'" + doc[field];
    }
  }
  return doc;
}
