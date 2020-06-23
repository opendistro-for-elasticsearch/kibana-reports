
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

const esb               = require('elastic-builder');
const moment            = require('moment');
const converter         = require('json-2-csv');
const config            = require('../utils/constants');

const INDEX_NAME        = config.INDEX_NAME;
const CSV_BY_USERS      = config.CSV_BY_USERS;
const EMPTY_FIELD_VALUE = config.EMPTY_FIELD_VALUE;
const EXCEL_FORMAT      = config.EXCEL_FORMAT;
const MAX_ROWS          = config.MAX_ROWS;

export default class CsvGeneratorService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }

  //get the advanced settings from Kibana
  getAdvancedSettings = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      return await callWithRequest(_req, 'search', {
        index: ".kibana",
        body: {
          query: {
            term: {
              type: {
                value: 'config',
              },
            },
          },
        },
      });
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  //saving a report to the index
  saveReport = async (_req, file, status, binary, message, username, type) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const date                = moment().format('DD-MM-YYYY HH:mm:ss');
      const params = {
        index: INDEX_NAME,
        body: {
          fileType: type,
          file: file,
          downloadLink: '',
          date: date,
          status: status,
          binary: binary,
          message: message,
          username: username,
        },
      };
      const document = await callWithRequest(_req, 'index', params);
      return document;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  //updating the report
  updateCSV = async (_req, documentId, status, binary, message, username, file) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const date   = moment().format('DD-MM-YYYY HH:mm:ss');
      const params = {
        index: INDEX_NAME,
        id: documentId,
        body: {
          fileType: 'csv',
          file: file,
          downloadLink: '',
          date:     date,
          status:   status,
          binary:   binary,
          message:  message,
          username: username,
        },
      };
      const document = await callWithRequest(_req, 'index', params);
      return { ok: true, resp: document };
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  //fetch the saved search infos.
  getSavedSearchInfo = async (_req, savedsearchId) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const savedsearchIdFromES = await callWithRequest(_req, 'get', {
        index: '.kibana',
        id: 'search:' + savedsearchId,
      });
      return savedsearchIdFromES;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  // retrieving the index pattern of the saved  search
  getIndexPattern = async (_req, indexpatternId) => {
    try {
      const { callWithRequest }  = this.esDriver.getCluster('data');
      const indexpatern          = await callWithRequest(_req, 'get', {
        index: '.kibana',
        id: 'index-pattern:' + indexpatternId,
      });
      return indexpatern;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  // fetching the count of data in ES
  esFetchCount = async (_req, indexPatternTitle, bodyCount) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthCountRes       = callWithRequest(_req, 'count', {
        index: indexPatternTitle,
        body: bodyCount,
      });
      return fecthCountRes;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  // fetching the data in ES
  esFetchData = async (_req, indexPatternTitle, body,list_columns_date) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthDataRes        = callWithRequest(_req, 'search', {
        index: indexPatternTitle,
        scroll: '1m',
        body: body,
        docvalue_fields:list_columns_date
      });
      return fecthDataRes;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  // fetching the count of data in ES using the scroll
  esFetchScroll = async (_req, scrollId) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthDataScrollRes  = callWithRequest(_req, 'scroll', {
        scrollId: scrollId,
        scroll: '1m',
      });
      return fecthDataScrollRes;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  //count the number of generated Reports By User
  countUserReports = async (_req, username) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const csvCountByuser      = callWithRequest(_req, 'count', {
        index: INDEX_NAME,
        q: 'username:' + username,
      });
      return csvCountByuser;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  //get the oldest report
  getOldestReport = async (_req, username) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const docs                = await callWithRequest(_req, 'search', {
        index: INDEX_NAME,
        body: {
          size: 1,
          sort: [{ date: { order: 'asc' } }],
          query: {
            term: { username: username },
          },
        },
      });
      return docs;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  //delete a report
  deleteReport = async (_req, doc_id) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      return callWithRequest(_req, 'delete', {
        index: INDEX_NAME,
        id: doc_id,
      });
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };


  traverse = (data, keys,timeFieldName, format, list_columns_date, result = {}) => {
   // const fields = data.fields;
    for (let k of Object.keys(data)) {
      if (keys.includes(k)) {
        result = {
          ...result,
          ...{
            [k]: data[k],
          },
        };
        continue;
      }
      if (data[k] && typeof data[k] === 'object' && Object.keys(data[k]).length > 0) {
        result = this.traverse(data[k], keys, timeFieldName, format,list_columns_date, result);
      }
    }
    return result;
  };

  //get the operators contained in the search request
  containsOperator = (str, substrings) => {
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null;
  }

  genereteReport          = async (_req, documentId, username, strFilename) => {
    const time_range_gte  = _req.params.start;
    const time_range_lte  = _req.params.end;
    const savedsearchId   = _req.params.savedsearchId;
    let strColumns        = [];
    const header_search   = [];
    let fields_exist      = false;
    let savedSearchInfos  = {};
    let indexPatter       = '';
    let resIndexPattern   = '';
    let fieldsPattern     = '';
    let header            = [];
    const dataset         = [];
    let format            = [];
    const delimiter       = [];
    const nullBinary      = 'bnVsbA==';

    const advancedSettings  = await this.getAdvancedSettings(_req);
    const csvSeparator      = advancedSettings.hits.hits[0]._source.config['csv:separator'];
    const dateFormat        = advancedSettings.hits.hits[0]._source.config.dateFormat;

    if(dateFormat) format.push(dateFormat);
    else format.push('MMM D, YYYY @ HH:mm:ss.SSS');

    savedSearchInfos        = await this.getSavedSearchInfo(_req, savedsearchId);
    const filters           = savedSearchInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;

    //get the list of selected columns in the saved search.Otherwise select all the fields under the _source
    for (const column of savedSearchInfos._source.search.columns) {
      if (column !== '_source') {
        fields_exist = true;
        const split  = column.split('.');
        if (split.length >= 2) {
          header_search.push(split[1]);
        } else {
          header_search.push(column);
        }
        strColumns.push(column);
      } else {
        strColumns.push('_source');
      }
    }

    //Get index name
    for (const item of savedSearchInfos._source.references) {
      if (item.name === JSON.parse(filters).indexRefName) {

        //Get index-pattern informations (index-pattern name & timeFieldName)
        indexPatter= await this.getIndexPattern(_req, item.id);
        resIndexPattern = indexPatter._source['index-pattern'];
        fieldsPattern   = resIndexPattern.fields; //Get fields type

        //Get fields Date
        const list_columns_date = [];
        for (const item of JSON.parse(fieldsPattern)) {
          if (item.type === 'date') {
            list_columns_date.push(item.name);
          }
        }

        //building the ES query

        let requestBody = esb.boolQuery();
        for (const item of JSON.parse(filters).filter) {
          if (item.meta.disabled === false) {
            switch (item.meta.negate) {
              case false:
                switch (item.meta.type) {
                  case 'phrase':
                    requestBody.must(esb.matchPhraseQuery(item.meta.key,item.meta.params.query));
                  break;
                  case 'exists':
                    requestBody.must(esb.existsQuery(item.meta.key));
                  break;
                  case 'phrases':
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      for (const [key, incr] of valueSplit.entries()) {
                        requestBody.should(esb.matchPhraseQuery(item.meta.key,incr));
                      }
                    } else {
                      requestBody.should(esb.matchPhraseQuery(item.meta.key, item.meta.params.query));
                    }
                    requestBody.minimumShouldMatch(1);
                  break;
                }
                break;
              case true:
                switch (item.meta.type) {
                  case 'phrase':
                    requestBody.mustNot(esb.matchPhraseQuery(item.meta.key,item.meta.params.query));
                  break;
                  case 'exists':
                    requestBody.mustNot(esb.existsQuery(item.meta.key));
                  break;
                  case 'phrases':
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      for (const [key, incr] of valueSplit.entries()) {
                        requestBody.should(esb.matchPhraseQuery(item.meta.key,incr));
                      }
                    } else {
                      requestBody.should(esb.matchPhraseQuery(item.meta.key,item.meta.params.query));
                    }
                    requestBody.minimumShouldMatch(1);
                  break;
                }
              break;
            }
          }
        }

        //search part
        const operator = this.containsOperator(JSON.parse(filters).query.query, ["AND", "OR"]);
        if (JSON.parse(filters).query.query) {
          if (operator === null) {
            const searchQuery  = JSON.parse(filters).query.query.split(':');
              if (searchQuery.length === 1){
                requestBody.must(esb.multiMatchQuery([],searchQuery[0].trim()).type('best_fields'));
              }else if (searchQuery.length === 2){
                requestBody.must(esb.matchPhraseQuery(searchQuery[0].trim(),searchQuery[1].trim()));
              }
          }else {
            const searchQuery  = JSON.parse(filters).query.query.split(operator);
            switch (operator) {
              case 'OR':
                let requestShould = [];
                searchQuery.forEach(query => {
                  const splitSearch = query.split(':');
                  requestShould.push(esb.boolQuery().should(esb.matchQuery(splitSearch[0].trim(),splitSearch[1].trim())));
                });
                requestBody.filter(esb.boolQuery().should(requestShould));
              break;
              case 'AND':
                searchQuery.forEach(query => {
                  const splitSearch = query.split(':');
                  requestBody.must(esb.matchQuery(splitSearch[0].trim(),splitSearch[1].trim()));
                });
              break;
            }
          }
        }

        if (resIndexPattern.timeFieldName && resIndexPattern.timeFieldName.length > 0) {
          header_search.push(resIndexPattern.timeFieldName);
          if (fields_exist) {
            strColumns.push(resIndexPattern.timeFieldName);
          }
          requestBody.must(esb.rangeQuery(resIndexPattern.timeFieldName).format("epoch_millis").gte(time_range_gte).lte(time_range_lte));
        }

        let reqBodyCount = esb.requestBodySearch().query(requestBody);
        const resCount   = await this.esFetchCount(_req, resIndexPattern.title, reqBodyCount.toJSON()).catch(
          err => {
            this.updateCSV(
              _req,
              documentId,
              'failed',
              nullBinary,
              'Err While Fetching the count in ES',
              username,
              strFilename
            );
          }
        );

        if (resCount.count > MAX_ROWS) {
          this.updateCSV(
            _req,
            documentId,
            'failed',
            nullBinary,
            'Data too large.',
            username,
            strFilename
          );
          return { ok: false, resp: 'file is too large!' };
        }

        const strSort = savedSearchInfos._source.search.sort;
        let sorting   = '';
        let reqBody   = esb.requestBodySearch().query(requestBody).version(true).size(10000);

        if (strSort.length === 1)
          reqBody.sort(esb.sort(strSort[0][0],strSort[0][1]));
        else
          reqBody.sort(esb.sort(strSort[0],strSort[1]));

        if (fields_exist) {
          reqBody.source({ includes: strColumns });
        }

        const nb_countDiv     = resCount.count / 10000;
        const modulo_countDiv = resCount.count % 10000;

        //Fecth the data from ES
        const resData = await this.esFetchData(_req, resIndexPattern.title, reqBody.toJSON(),list_columns_date);
        if (resCount.count === 0) {
          this.updateCSV(
            _req,
            documentId,
            'failed',
            nullBinary,
            'No Content.',
            username,
            strFilename
          );
          return { ok: false, resp: 'No Content in elasticsearch!' };
        }
        const arrayHits = [];
        //console.log('resData.hits.total.value ', resData.hits.total.value);
        arrayHits.push(resData.hits);

        //perform the scroll
        if (nb_countDiv > 0) {
          for (let i = 0; i < nb_countDiv + 1; i++) {
            const resScroll = await this.esFetchScroll(_req, resData._scroll_id);
            if (Object.keys(resScroll.hits.hits).length > 0) {
              arrayHits.push(resScroll.hits);
            }
          }
        }

        //No data in elasticsearch
        if (resData.hits.total.value === 0) {
          try {
            this.updateCSV(
              _req,
              documentId,
              'failed',
              nullBinary,
              'No Content in elasticsearch!',
              username,
              strFilename
            );
          } catch (err) {
            return { ok: false, resp: 'No Content in Elasticsearch ' };
          }
        }
        if (fields_exist === true) {
          header = header_search; //get the selected fields
        }

        //Get data
        for (const valueRes of arrayHits) {
          for (const data_ of valueRes.hits) {
            for(let dateType of list_columns_date){
              const fields = data_.fields;
              if(data_._source[dateType]){
                data_._source[dateType] =  moment.utc(fields[dateType]).format(EXCEL_FORMAT);
              }
            }
            if (fields_exist === true) {
              const result = this.traverse(data_, header_search, resIndexPattern.timeFieldName,format,list_columns_date);
              dataset.push(result);
            } else {
              dataset.push(data_);
            }
          }
        }
        const datasetSize = JSON.stringify(dataset).length;
        if(csvSeparator)
          delimiter.push(csvSeparator);
        else
          delimiter.push(',');
        const options      = { delimiter: { field:delimiter.toString() } , emptyFieldValue:EMPTY_FIELD_VALUE }
        converter.json2csvAsync(dataset, options).then(csv => {
            const buf         = Buffer.from(JSON.stringify(csv)).toString('base64');
            const csvSize     = JSON.stringify(csv).length;
            try {
              this.updateCSV(
                _req,
                documentId,
                'success',
                buf,
                'Succesfully Generated',
                username,
                strFilename
              );
            } catch (err) {
              this.updateCSV(
                _req,
                documentId,
                'failed',
                nullBinary,
                'Error while updating the index ' + err,
                username,
                strFilename
              );
              return { ok: false, resp: 'Error while updating the index ' + err };
            }
          })
          .catch(err => {
            this.updateCSV(_req, documentId, 'failed', nullBinary, err, username, strFilename);
            return { ok: false, resp: 'Error while converting to csv ', err };
          });
      }
    }
  };

  createPendingReport       = async _req => {
    const time_range_gte    = _req.params.start;
    const time_range_lte    = _req.params.end;
    const savedsearchId     = _req.params.savedsearchId;
    const username          = _req.params.username;
    const count             = await this.countUserReports(_req, username);
    const savedSearchInfos  = await this.getSavedSearchInfo(_req, savedsearchId);
    const stripSpaces       = savedSearchInfos._source.search.title.split(' ').join('_');
    const strFilename       = stripSpaces + '_' + time_range_gte + '_' + time_range_lte + '.csv';
    const nullBinary        = 'bnVsbA==';

    if (count.count >= CSV_BY_USERS) {
      const doc     = await this.getOldestReport(_req, username);
      const doc_id  = doc.hits.hits[0]._id;
      await this.deleteReport(_req, doc_id);
    }

    const document = await this.saveReport(
      _req,
      strFilename,
      'pending',
      nullBinary,
      'Csv being Generated',
      username,
      'csv'
    );
    this.genereteReport(_req, document._id, username, strFilename);
    return { ok: true, resp: 'csv file pending...' };
  };
}
