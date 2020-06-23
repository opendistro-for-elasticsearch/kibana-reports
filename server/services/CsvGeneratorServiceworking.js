/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable camelcase */

const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');
const flatten = require('flat');
const converter = require('json-2-csv');
const fs = require('fs-extra');
const history = [];
const ESPATH = 'http://localhost:9200/';
const MaxCSVRows = 3000;
const INDEXNAME = 'csvgenerator';

export default class CsvGeneratorService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }
  checkIndexExist = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const indexExist = await callWithRequest(_req, 'indices.exists', { index: INDEXNAME });
      return { ok: true, resp: indexExist };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - checkIndexExist:', err);
      return { ok: false, resp: err.message };
    }
  };
  getMappings = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const mappings = await callWithRequest(_req, 'indices.getMapping', { index: INDEXNAME });
      return { ok: true, resp: mappings };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - getMappings:', err);
      return { ok: false, resp: err.message };
    }
  };
  putMapping = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const params = {
        properties: {
          fileType: {
            type: 'text',
          },
          file: {
            type: 'text',
          },
          downloadLink: {
            type: 'text',
          },
          date: {
            type: 'date',
            format: 'dd-MM-yyyy HH:mm:ss',
          },
          status: {
            type: 'text',
          },
          binary: {
            type: 'binary',
          },
          error: {
            type: 'text',
          },
          timestamp: {
            type: 'date',
            format: 'dd-MM-yyyy HH:mm:ss',
          },
          user: {
            type: 'nested',
            properties: {
              id: { type: 'text' },
              username: { type: 'text' },
            },
          },
        },
      };
      const mappings = await callWithRequest(_req, 'indices.putMapping', {
        index: INDEXNAME,
        body: params,
      });
      return { ok: true, resp: mappings };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - putMapping:', err);
      return { ok: false, resp: err.message };
    }
  };

  createCSVIndex = async _req => {
    try {
      const indexExist = await this.checkIndexExist();
      console.log('indexExist before is ', indexExist);
      const { callWithRequest } = this.esDriver.getCluster('data');
      const mappings = await callWithRequest(_req, 'indices.create', { index: INDEXNAME });
      await this.putMapping();
      console.log('indexExist after is ', indexExist);
      return { ok: true, resp: mappings };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - createCSVIndex:', err);
      return { ok: false, resp: err.message };
    }
  };

  getSingleCSV = async _req => {
    const csvId = _req.params.csvId;
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const csv = await callWithRequest(_req, 'get', { index: INDEXNAME, id: csvId });
      const binary = csv._source.binary;
      const json = Buffer.from(binary, 'base64').toString('utf-8');
      console.log('csv._source.file ', csv._source.file);
      const data = { filename: csv._source.file, csv: JSON.parse(json) };
      //console.log('json parse is ', JSON.parse(json));
      return { ok: true, resp: data };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - getSingleCSV:', err);
      return { ok: false, resp: err.message };
    }
  };

  getRecentCSV = async _req => {
    try {
      const histories = [];
      const { callWithRequest } = this.esDriver.getCluster('data');
      const indexes = await callWithRequest(_req, 'search', {
        index: INDEXNAME,
        body: {
          size: 10,
          sort: [{ date: { order: 'desc' } }],
          query: {
            bool: {
              filter: {
                match: {
                  fileType: 'csv',
                },
              },
            },
          },
        },
      });
      indexes.hits.hits.sort((a, b) => b._source.date - a._source.date);
      for (const history of indexes.hits.hits) {
        histories.push({
          id: history._id,
          saveSearch: history._source.file,
          status: history._source.status,
          date: history._source.date,
          download: history._source.downloadLink,
        });
      }
      return { ok: true, resp: histories };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - getRecentCSV:', err);
      return { ok: false, resp: err.message };
    }
  };

  setup = async () => {
    try {
      const indexExist = await this.checkIndexExist();
      console.log('indexExist is ', indexExist);
      if (!indexExist.resp) {
        await this.createCSVIndex();
      }
      return { ok: true, resp: 'done' };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - setup:', err);
      return { ok: false, resp: err.message };
    }
  };

  getHistory = async () => {
    try {
      const recentsCsv = await this.getRecentCSV();
      return recentsCsv;
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - getHistory:', err);
      return { ok: false, resp: err.message };
    }
  };

  // download = async (_req) => {
  //   try {
  //     const recentsCsv = await this.getSingleCSV(_req);
  //     //return recentsCsv;
  //     return { ok: true, resp: recentsCsv.resp };
  //     //return { ok: true, resp: recentsCsv, config: config };
  //   } catch (err) {
  //     console.error('CSV Generator - CsvGeneratorService - getHistory:', err);
  //     return { ok: false, resp: err.message };
  //   }
  // }

  savedSearchInfo = async (_req, savedsearchId) => {
    //const { callWithRequest } = this.esDriver.getCluster('data');
    const query = ESPATH + '.kibana/_doc/search:' + savedsearchId;
    return axios
      .get(query)
      .then(response => {
        //console.log('response.data  from savedSearchInfo is ', response.data);
        return response.data;
      })
      .catch(error => {
        console.error(
          'getSavedSearch Infos - Error while fetching savedSearch Infos from elasticsearch',
          error
        );
        return { ok: false, resp: error.message };
      });
  };

  genereteCsv = async _req => {
    // console.log('this.esDriver is ', this.esDriver);
    // console.log('this.esServer is ', this.esServer);
    const getUser = this.esServer.security;
    //console.log('user is ', getUser);
    const { callWithRequest } = this.esDriver.getCluster('data');

    //start and end date
    const time_range_gte = _req.params.start;
    const time_range_lte = _req.params.end;

    //Get saved search informations (filters, indexRef)
    const savedsearchId = _req.params.savedsearchId;
    let strColumns = '';
    const strSort = '';
    const header_search = [];
    let fields_exist = false;
    let strFilename = '';
    let savedSearchInfos = {};
    let indexPatter = '';
    let resIndexPattern = '';
    let fieldsPattern = '';
    let body = '';
    let header = [];
    const line = [];
    const dataset = [];
    const INDEXNAME = 'csvgenerator';

    async function savedSearchInfo() {
      const savedsearchIdFromES = await callWithRequest(_req, 'search', {
        index: '.kibana',
        type: '_doc',
      });

      //console.log('savedsearchIdFromES from savedSearchInfo is ', savedsearchIdFromES);
      const query = ESPATH + '.kibana/_doc/search:' + savedsearchId;
      return axios
        .get(query)
        .then(response => {
          //console.log('response.data  from savedSearchInfo is ', response.data);
          return response.data;
        })
        .catch(error => {
          console.error(
            'getSavedSearch Infos - Error while fetching savedSearch Infos from elasticsearch',
            error
          );
          return { ok: false, resp: error.message };
        });
    }

    async function getCSVIndex() {
      const index = await callWithRequest(_req, 'indices.get', {
        index: INDEXNAME,
      });
      //console.log('index from getCSVIndex is ', index);
    }

    async function writeToCSVIndexInfo(error, status) {
      console.log('writing to index');
      const params = {
        index: INDEXNAME,
        body: {
          fileType: 'info',
          status: status,
          error: error,
        },
      };
      const document = await callWithRequest(_req, 'index', params);
      console.log('document from writeToCSVIndexInfo is ', document);
    }

    async function saveCSVToCSVIndexInfo(file, link, date, status, binary) {
      console.log('saving csv to index');
      const params = {
        index: INDEXNAME,
        body: {
          fileType: 'csv',
          file: file,
          downloadLink: link,
          date: date,
          status: status,
          binary: binary,
          user: {
            id: 'user id',
            username: 'username',
          },
        },
      };

      //const { callWithRequest } = this.esDriver.getCluster('data');
      // console.log('this.esDriver is ', this.esDriver);
      // console.log('this.esServer is ', this.esServer);
      // if (this.esServer.security)
      // {
      //     this.esServer.security.getUser(req).then(user => {
      //    // ticket.fields.reporter.name = user.username
      //    console.log('user is ',user);
      // });

      // }
      const document = await callWithRequest(_req, 'index', params)
        .then(response => {
          console.log('document from writeToCSVIndexInfo is ', response);
        })
        .catch(err => {
          console.log('error from writeToCSVIndexInfo is ', err);
        });
    }

    function indexPattern(queryIndex) {
      //const queryPattern  = ESPATH + '.kibana/_doc/index-pattern:' + item.id;
      return axios
        .get(queryIndex)
        .then(response => {
          return response.data;
        })
        .catch(error => {
          writeToCSVIndexInfo(
            'csv Generator CsvGeneratorService indexPattern - Error while fetching Index Pattern from elasticsearch',
            'failed'
          );
          console.error(
            'indexPattern - Error while fetching Index Pattern from elasticsearch',
            error
          );
        });
    }

    function ESFetchCount(indexPatternTitle, bodyCount) {
      const fecthCountRes = callWithRequest(_req, 'count', {
        index: indexPatternTitle,
        body: bodyCount,
      })
        .then(response => {
          //console.log(' response in ESFetchData is ', response);
          return response;
        })
        .catch(err => {
          console.log(
            'ESFetchCount - Error while counting the number of elements in ElasticSearch ',
            err
          );
        });
      return fecthCountRes;
    }

    async function ESFetchData(body) {
      const fecthDataRes = callWithRequest(_req, 'search', {
        scroll: '1m',
        body: body,
      })
        .then(response => {
          return response;
        })
        .catch(err => {
          console.log('ESFetchData - Error while Fetching the data from ElasticSearch ', err);
        });
      return fecthDataRes;
    }

    function ESFetchScroll(scrollId) {
      const fecthDataScrollRes = callWithRequest(_req, 'scroll', {
        scrollId: scrollId,
        scroll: '1m',
      })
        .then(response => {
          return response;
        })
        .catch(err => {
          console.log(
            'ESFetchScroll - Error while Fetching the scroll data from ElasticSearch ',
            err
          );
        });
      return fecthDataScrollRes;
    }
    function traverse(data, keys, result = {}) {
      for (const k of Object.keys(data)) {
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
          result = traverse(data[k], keys, result);
        }
      }
      return result;
    }

    await getCSVIndex();
    savedSearchInfos = await this.savedSearchInfo(_req, savedsearchId);
    // strSort = savedSearchInfos._source.search.sort;
    console.log('savedSearchInfos._source.search.columns', savedSearchInfos._source.search.columns);
    for (const column of savedSearchInfos._source.search.columns) {
      if (column !== '_source') {
        if (strColumns !== '') {
          strColumns = strColumns + ',';
        }
        const split = column.split('.');
        console.log('split is ', split);
        if (split.length >= 2) {
          header_search.push(split[1]);
        } else {
          header_search.push(column);
        }
        fields_exist = true;

        strColumns = strColumns + '"' + column + '"';
      }
    }
    // if (fields_exist === false) {
    //   console.log('generateCSV - Err : No columns chosen');
    // }
    //console.log('strColumns ', strColumns.toString(), 'header_search ', header_search);
    //Get filters array
    const filters = savedSearchInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;
    //Get index name
    for (const item of savedSearchInfos._source.references) {
      if (item.name === JSON.parse(filters).indexRefName) {
        //Get index-pattern informations (index-pattern name & timeFieldName)
        const queryPattern = ESPATH + '.kibana/_doc/index-pattern:' + item.id;
        indexPatter = await indexPattern(queryPattern);
        resIndexPattern = indexPatter._source['index-pattern'];
        //Get fields type
        fieldsPattern = resIndexPattern.fields;
        //Get fields Date
        const list_columns_date = [];
        for (const item of JSON.parse(fieldsPattern)) {
          if (item.type === 'date') {
            list_columns_date.push(item.name);
          }
        }
        //console.log('list_columns_date Date fields are :', list_columns_date);
        //building query
        let must = '"must": [ ';
        let must_not = '"must_not": [ ';
        //console.log('filters are', JSON.parse(filters).filter);
        for (const item of JSON.parse(filters).filter) {
          //console.log('item is ', item);
          if (item.meta.disabled === false) {
            switch (item.meta.negate) {
              case false:
                switch (item.meta.type) {
                  case 'phrase':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must =
                      must +
                      '{ "match_phrase": { "' +
                      item.meta.key +
                      '": { "query": "' +
                      item.meta.value +
                      '" } } }';
                    break;
                  case 'exists':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must = must + '{ "exists": { "field": "' + item.meta.key + '" } }';
                    break;
                  case 'phrases':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must = must + ' { "bool": { "should": [ ';
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      //console.log('valueSplit are: ', valueSplit);
                      for (const [key, incr] of valueSplit.entries()) {
                        if (key !== 0) {
                          must = must + ',';
                        }
                        must =
                          must + '{ "match_phrase": { "' + item.meta.key + '": "' + incr + '" } }';
                      }
                    } else {
                      must =
                        must +
                        '{ "match_phrase": { "' +
                        item.meta.key +
                        '": "' +
                        item.meta.value +
                        '" } }';
                    }
                    must = must + ' ], "minimum_should_match": 1 } }';
                    break;
                }
                break;

              case true:
                switch (item.meta.type) {
                  case 'phrase':
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    must_not =
                      must_not +
                      '{ "match_phrase": { "' +
                      item.meta.key +
                      '": { "query": "' +
                      item.meta.value +
                      '" } } }';
                    break;
                  case 'exists':
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    must_not = must_not + '{ "exists": { "field": "' + item.meta.key + '" } }';
                    break;
                  case 'phrases':
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    must_not = must_not + ' { "bool": { "should": [ ';
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      for (const [key, incr] of valueSplit.entries()) {
                        if (key !== 0) {
                          must_not = must_not + ',';
                        }
                        must_not =
                          must_not +
                          '{ "match_phrase": { "' +
                          item.meta.key +
                          '": "' +
                          incr +
                          '" } }';
                      }
                    } else {
                      must_not =
                        must_not +
                        '{ "match_phrase": { "' +
                        item.meta.key +
                        '": "' +
                        item.meta.value +
                        '" } }';
                    }
                    must_not = must_not + ' ], "minimum_should_match": 1 } }';
                    break;
                }
                break;
            }
          }
        }
        //console.log('resIndexPattern.timeFieldName', resIndexPattern.timeFieldName);
        if (resIndexPattern.timeFieldName !== '') {
          //add timefield in fields
          //.push(resIndexPattern.timeFieldName);
          if (strColumns !== '') {
            strColumns = ',' + strColumns;
          }
          console.log('fields_exist is ', fields_exist);
          if (fields_exist) {
            strColumns = '"' + resIndexPattern.timeFieldName + '"' + strColumns;
          }
          //strColumns = '"' + resIndexPattern.timeFieldName + '"' + strColumns;

          if (must !== '"must": [ ') {
            must = must + ',';
          }
          must =
            must +
            '{ "range": { "' +
            resIndexPattern.timeFieldName +
            '": { "format": "epoch_millis", "gte": "' +
            time_range_gte +
            '", "lte": "' +
            time_range_lte +
            '" } } }';
        }
        console.log('strColumns ', strColumns.toString(), 'header_search ', header_search);
        must = must + ' ]';
        must_not = must_not + ' ]';
        const searchQuery = JSON.parse(filters).query.query.split(':');
        // add the search query here if the query field is not null
        //console.log('JSON.parse(filters) is ', JSON.parse(filters).query);
        console.log('searchQuery ', searchQuery);
        if (JSON.parse(filters).query.query) {
          body =
            '"query": { "bool": { ' +
            must +
            ', "filter": [ { "bool": {"should": [{"match": { "' +
            searchQuery[0] +
            '":"' +
            searchQuery[1] +
            '" }}]}}], "should": [], ' +
            must_not +
            ' } } ';
        } else {
          body =
            '"query": { "bool": { ' +
            must +
            ', "filter": [ { "match_all": {} } ], "should": [], ' +
            must_not +
            ' } } ';
        }
        //console.log('body: ', body);
        const bodyCount = '{' + body + '}';
        body =
          '{ "version": true, "size": 1000, "_source": { "includes": [' +
          strColumns +
          '] },' +
          body +
          '}';
        console.log('body: ', body);
        //console.log('bodyCount: ', (bodyCount));
        //console.log('resIndexPattern.title: ', resIndexPattern.title);

        //Count
        //const queryCount = ESPATH + resIndexPattern.title + '/_count';
        const resCount = await ESFetchCount(resIndexPattern.title, bodyCount);
        //check if limit size is reached
        console.log('nb rows: ', resCount.count);
        if (resCount.count > MaxCSVRows) {
          await writeToCSVIndexInfo(
            'csv Generator CsvGeneratorService - file is too large!',
            'failed'
          );
          //console.log("generateCSV - csv size is too large");
          //return { ok: false, resp: 'file is too large!' };
        }
        const nb_countDiv = resCount.count / 10000;
        const modulo_countDiv = resCount.count % 10000;
        //console.log('nb_countDiv : ', nb_countDiv);
        //console.log('modulo_countDiv :', modulo_countDiv);

        //Fecth data
        const resData = await ESFetchData(JSON.parse(body));
        //console.log('resData', resData);

        const arrayHits = [];
        arrayHits.push(resData.hits);
        if (nb_countDiv > 0) {
          for (let i = 0; i < modulo_countDiv + 1; i++) {
            const resScroll = await ESFetchScroll(resData._scroll_id);
            if (Object.keys(resScroll.hits.hits).length > 0) {
              arrayHits.push(resScroll.hits);
            }
          }
        }
        //No data in elasticsearch
        if (resData.hits.total.value === 0) {
          console.log('csv Generator CsvGeneratorService  - No Content');
          await writeToCSVIndexInfo(
            'csv Generator CsvGeneratorService - No Content in elasticsearch',
            'failed'
          );
          //return { ok: false, resp: 'csv Generator CsvGeneratorService - No Content in elasticsearch' };
          return { ok: false, resp: 'No Content in elasticsearch!' };
        }

        //Transform data into csv
        if (fields_exist === true) {
          //get the selected fields
          header = header_search;
        }
        console.log('header_search ', header_search);
        console.log('header is', header);
        console.log('resIndexPattern.timeFieldName is', resIndexPattern.timeFieldName);
        //Get data
        for (const valueRes of arrayHits) {
          for (const data_ of valueRes.hits) {
            if (fields_exist === true) {
              const result = traverse(data_, header_search);
              dataset.push(result);
            } else {
              dataset.push(data_);
            }
          }
        }
        console.log('dataset', dataset);
        //console.log('dataset is', dataset);
        //Create csv file
        strFilename =
          savedSearchInfos._source.search.title +
          '_' +
          time_range_gte +
          '_' +
          time_range_lte +
          '.csv';
        // eslint-disable-next-line no-loop-func
        converter
          .json2csvAsync(dataset)
          .then(csv => {
            // const buf = Buffer.from(JSON.stringify(csv), 'base64');
            const buf = Buffer.from(JSON.stringify(csv)).toString('base64');
            //console.log('the buffer is ', buf);
            console.log('typeOf buffer is ', typeof buf);
            fs.outputFile('plugins/csv_generator/public/csv/' + strFilename, csv, err => {
              if (err) {
                console.log('generateCSV - Cannot create csv file - err:', err);
              } else {
                // const file = {
                //   saveSearch: strFilename,
                //   status: 'success',
                //   download: 'http://localhost:5601/plugins/csv_generator/csv/' + strFilename,
                //   date: moment().format('DD-MM-YYYY HH:mm:ss'),
                // };
              }
            });
            saveCSVToCSVIndexInfo(
              strFilename,
              'http://localhost:5601/plugins/csv_generator/csv/' + strFilename,
              moment().format('DD-MM-YYYY HH:mm:ss'),
              'success',
              buf
            );
          })
          .catch(err => console.log(err));
        return { ok: true, resp: 'csv file generated !' };
      }
    }
  };
}

/*

const moment = require('moment');
const converter = require('json-2-csv');
const config = require('../utils/constants');
const INDEXNAME = config.INDEXNAME;
const MaxCSVRows = config.MAXCSVROWS;

export default class CsvGeneratorService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }
  checkIndexExist = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const indexExist = await callWithRequest(_req, 'indices.exists', { index: INDEXNAME });
      return { ok: true, resp: indexExist };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - checkIndexExist:', err);
      return { ok: false, resp: err.message };
    }
  };
  getSingleCSV = async _req => {
    const csvId = _req.params.csvId;
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const csv = await callWithRequest(_req, 'get', { index: INDEXNAME, id: csvId });
      const binary = csv._source.binary;
      const json = Buffer.from(binary, 'base64').toString('utf-8');
      const data = { filename: csv._source.file, csv: JSON.parse(json) };
      return { ok: true, resp: data };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - getSingleCSV:', err);
      return { ok: false, resp: err.message };
    }
  };
  saveCSVToIndex = async (_req, file, status, binary, message, username, type) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const date = moment().format('DD-MM-YYYY HH:mm:ss');
      const params = {
        index: INDEXNAME,
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
      console.error(
        'CSV Generator - CsvGeneratorService - saveCSVToIndex - Error from while saving csv to index:',
        err
      );
      return { ok: false, resp: err.message };
    }
  };

  updateCSV = async (_req, documentId, status, binary, message, username, file) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      console.log('updating the csv in the  index');
      console.log('username in update is ', username);
      //const docToUpdate = this.getSingleCSV();
      const date = moment().format('DD-MM-YYYY HH:mm:ss');
      const params = {
        index: INDEXNAME,
        id: documentId,
        body: {
          fileType: 'csv',
          file: file,
          downloadLink: '',
          date: date,
          status: status,
          binary: binary,
          message: message,
          username: username,
        },
      };
      // console.log('params are ', params);
      const document = await callWithRequest(_req, 'index', params);
      //return document;
      return { ok: true, resp: document };
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - updateCSV - Error from while updating the csv to index:',
        err
      );
      return { ok: false, resp: err.message };
    }
  };
  savedSearchInfo = async (_req, savedsearchId) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const savedsearchIdFromES = await callWithRequest(_req, 'get', {
        index: '.kibana',
        id: 'search:' + savedsearchId,
      });
      return savedsearchIdFromES;
    } catch (err) {
      console.error(
        'getSavedSearch Infos - Error while fetching savedSearch Infos from elasticsearch:',
        err
      );
      return { ok: false, resp: err.message };
    }
  };
  indexPattern = async (_req, indexpatternId) => {
    const { callWithRequest } = this.esDriver.getCluster('data');
    //const queryPattern       = ESPATH + '.kibana/_doc/index-pattern:' + item.id;
    const indexpatern = await callWithRequest(_req, 'get', {
      index: '.kibana',
      id: 'index-pattern:' + indexpatternId,
    });
    return indexpatern;
  };
  esFetchCount = async (_req, indexPatternTitle, bodyCount) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthCountRes = callWithRequest(_req, 'count', {
        index: indexPatternTitle,
        body: bodyCount,
      });
      return fecthCountRes;
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - ESFetchCount - Error while counting the number of elements in ElasticSearch ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };
  esFetchData = async (_req, indexPatternTitle, body) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthDataRes = callWithRequest(_req, 'search', {
        index: indexPatternTitle,
        scroll: '1m',
        body: body,
      });
      return fecthDataRes;
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - ESFetchData - Error while Fetching the data from ElasticSearch ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };
  esFetchScroll = async (_req, scrollId) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthDataScrollRes = callWithRequest(_req, 'scroll', {
        scrollId: scrollId,
        scroll: '1m',
      });
      return fecthDataScrollRes;
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - ESFetchScroll - Error while Fetching the scroll data from ElasticSearch ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };
  traverse = (data, keys, result = {}) => {
    for (const k of Object.keys(data)) {
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
        result = this.traverse(data[k], keys, result);
      }
    }
    return result;
  };
  genereteCsv = async (_req, documentId, username, strFilename) => {
    console.log('username in update is ', username);
    const time_range_gte = _req.params.start;
    const time_range_lte = _req.params.end;
    const savedsearchId = _req.params.savedsearchId;
    let strColumns = '';
    const header_search = [];
    let fields_exist = false;
    let savedSearchInfos = {};
    let indexPatter = '';
    let resIndexPattern = '';
    let fieldsPattern = '';
    let body = '';
    let header = [];
    const dataset = [];
    const nullBinary = 'bnVsbA==';

    savedSearchInfos = await this.savedSearchInfo(_req, savedsearchId);
    //console.log('savedSearchInfos._source.search.columns ', savedSearchInfos._source.search.columns);
    const filters = savedSearchInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;
    //console.log('filters are', filters);
    for (const column of savedSearchInfos._source.search.columns) {
      if (column !== '_source') {
        if (strColumns !== '') {
          strColumns = strColumns + ',';
        }
        //console.log('column is', column);
        fields_exist = true;
        const split = column.split('.');
        if (split.length >= 2) {
          header_search.push(split[1]);
        } else {
          header_search.push(column);
        }
        strColumns = strColumns + '"' + column + '"';
      } else {
        strColumns = '_source';
      }
    }

    //console.log('strColumns is', strColumns);

    //Get index name
    for (const item of savedSearchInfos._source.references) {
      //console.log('item is ', item);
      if (item.name === JSON.parse(filters).indexRefName) {
        //Get index-pattern informations (index-pattern name & timeFieldName)
        indexPatter = await this.indexPattern(_req, item.id);
        //console.log('indexPatter is ', indexPatter);
        resIndexPattern = indexPatter._source['index-pattern'];
        fieldsPattern = resIndexPattern.fields; //Get fields type
        //console.log('fieldsPattern are ', fieldsPattern);
        //Get fields Date
        const list_columns_date = [];
        for (const item of JSON.parse(fieldsPattern)) {
          if (item.type === 'date') {
            list_columns_date.push(item.name);
          }
        }
        console.log('list_columns_date Date fields are :', list_columns_date);
        //building query
        let must = '"must": [ ';
        let must_not = '"must_not": [ ';
        // console.log('filters are', JSON.parse(filters).filter);
        for (const item of JSON.parse(filters).filter) {
          //console.log('item is ', item);
          if (item.meta.disabled === false) {
            switch (item.meta.negate) {
              case false:
                switch (item.meta.type) {
                  case 'phrase':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must =
                      must +
                      '{ "match_phrase": { "' +
                      item.meta.key +
                      '":"' +
                      item.meta.params.query +
                      '" } }';
                    break;
                  case 'exists':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must = must + '{ "exists": { "field": "' + item.meta.key + '" } }';
                    break;
                  case 'phrases':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must = must + ' { "bool": { "should": [ ';
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      // console.log('item is ', item);
                      // console.log('valueSplit are: ', valueSplit);
                      for (const [key, incr] of valueSplit.entries()) {
                        if (key !== 0) {
                          must = must + ',';
                        }
                        must =
                          must + '{ "match_phrase": { "' + item.meta.key + '": "' + incr + '" } }';
                      }
                    } else {
                      must =
                        must +
                        '{ "match_phrase": { "' +
                        item.meta.key +
                        '": "' +
                        item.meta.value +
                        '" } }';
                    }
                    must = must + ' ], "minimum_should_match": 1 } }';
                    break;
                }
                break;
              case true:
                switch (item.meta.type) {
                  case 'phrase':
                    // console.log('item.meta.type', item.meta.type);
                    // console.log('item.meta', item.meta);
                    // console.log('item.meta.key', item.meta.key);
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    must_not =
                      must_not +
                      '{ "match_phrase": { "' +
                      item.meta.key +
                      '":"' +
                      item.meta.params.query +
                      '" } }';
                    break;
                  case 'exists':
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    must_not = must_not + '{ "exists": { "field": "' + item.meta.key + '" } }';
                    break;
                  case 'phrases':
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    must_not = must_not + ' { "bool": { "should": [ ';
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      for (const [key, incr] of valueSplit.entries()) {
                        if (key !== 0) {
                          must_not = must_not + ',';
                        }
                        must_not =
                          must_not +
                          '{ "match_phrase": { "' +
                          item.meta.key +
                          '": "' +
                          incr +
                          '" } }';
                      }
                    } else {
                      must_not =
                        must_not +
                        '{ "match_phrase": { "' +
                        item.meta.key +
                        '": "' +
                        item.meta.value +
                        '" } }';
                    }
                    must_not = must_not + ' ], "minimum_should_match": 1 } }';
                    break;
                }
                break;
            }
          }
        }
        console.log('resIndexPattern.timeFieldName ', resIndexPattern.timeFieldName);
        if (resIndexPattern.timeFieldName && resIndexPattern.timeFieldName.length > 0) {
          header_search.push(resIndexPattern.timeFieldName);
          // if (strColumns !== '') {
          //   strColumns = ',' + strColumns;
          // }
          // console.log('fields_exist ', fields_exist);
          if (fields_exist) {
            strColumns = ',' + strColumns;
            strColumns = '"' + resIndexPattern.timeFieldName + '"' + strColumns;
          }
          //strColumns = '"' + resIndexPattern.timeFieldName + '"' + strColumns;
          if (must !== '"must": [ ') {
            must = must + ',';
          }
          must =
            must +
            '{ "range": { "' +
            resIndexPattern.timeFieldName +
            '": { "format": "epoch_millis", "gte": "' +
            time_range_gte +
            '", "lte": "' +
            time_range_lte +
            '" } } }';
        }

        must = must + ' ]';
        must_not = must_not + ' ]';
        //console.log('strColumns ', strColumns.toString(), 'header_search ', header_search);
        const searchQuery = JSON.parse(filters).query.query.split(':');
        const searchQuery2 = JSON.parse(filters).query.query.split('and');
        // console.log('searchQuery is ', searchQuery);
        // console.log('JSON.parse(searchQuery[0]) ', searchQuery[0]);
        // console.log('indexPatternTitle] ', resIndexPattern.title);
        // add the search query here if the query field is not null
        //console.log('JSON.parse(filters).query.query ', JSON.parse(filters).query.query);

        if (JSON.parse(filters).query.query) {
          if (searchQuery.length == 1 && searchQuery2.length === 0) {
            body =
              '"query": { "bool": { "must":[], "filter": [ { "multi_match": { "query":"' +
              searchQuery[0] +
              '" } },{ "range": { "' +
              resIndexPattern.timeFieldName +
              '": { "format": "epoch_millis", "gte": "' +
              time_range_gte +
              '", "lte": "' +
              time_range_lte +
              '" }}} ] }}';
          } else if (searchQuery.length == 2 && searchQuery2.length === 0) {
            body =
              '"query": { "bool": { "must":[], "filter": [ { "bool": {"should": [{"match": { "' +
              searchQuery[0] +
              '":"' +
              searchQuery[1] +
              '"} }],"minimum_should_match": 1 }},{ "range": { "' +
              resIndexPattern.timeFieldName +
              '": { "format": "epoch_millis", "gte": "' +
              time_range_gte +
              '", "lte": "' +
              time_range_lte +
              '" }}}], "should": [], ' +
              must_not +
              ' } } ';
          }
        } else {
          body =
            '"query": { "bool": { ' +
            must +
            ', "filter": [ { "match_all": {} } ], "should": [], ' +
            must_not +
            ' } } ';
        }
        //body = '"query": { "bool": { ' + must + ', "filter": [ { "match_all": {} } ], "should": [], ' + must_not + ' } } ';
        const bodyCount = '{' + body + '}';
        const resCount = await this.esFetchCount(_req, resIndexPattern.title, bodyCount).catch(
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
        console.log('body in bodycount  is', body);
        console.log('nb rows: ', resCount.count);
        const newCount = resCount.count;

        if (resCount.count > MaxCSVRows) {
          //newCount = MaxCSVRows;
          //await writeToCSVIndexInfo('csv Generator CsvGeneratorService - file is too large!', 'failed');
          console.log('generateCSV - csv size is too large');
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
        console.log('strSort is: ', strSort);
        //const sort2 = [ 'order_date', 'desc' ];
        console.log('strSort.length ', strSort.length);
        //console.log('sort2.length ', sort2.length);
        let sorting = '';
        if (strSort.length === 1) {
          //console.log('1 yes ');
          // console.log('strSort[0]', strSort[0]);
          // console.log('strSort[0][0]', strSort[0][0]);
          // console.log('strSort[0][1]', strSort[0][1]);
          // console.log('"sort":[{"' + strSort[0][0] + '":{ "order": "' + strSort[0][1] + '"} }] ');
          sorting = '"sort":[{"' + strSort[0][0] + '":{ "order": "' + strSort[0][1] + '"} }] ';
        } else {
          sorting = '"sort":[{"' + strSort[0] + '":{ "order": "' + strSort[1] + '"} }] ';
        }
        if (fields_exist) {
          body =
            '{ "version": true, "size": 10000,' +
            sorting +
            ', "_source": { "includes": [' +
            strColumns +
            '] },' +
            body +
            '}';
        } else {
          body = '{ "version": true, "size": 10000,' + sorting + ',' + body + '}';
        }

        // body            = '{ "version": true, "size": 1000,' + sorting + ', "_source": { "includes": [' + strColumns + '] },' + body + '}';
        //Count
        console.log('body is', body);

        const nb_countDiv = resCount.count / 10000;
        const modulo_countDiv = resCount.count % 10000;
        console.log('nb_countDiv ', nb_countDiv);
        console.log('modulo_countDiv ', modulo_countDiv);
        //Fecth data
        //console.log('bodyCount is', bodyCount);
        //console.log('JSON.parse(body) is', JSON.parse(body));
        const resData = await this.esFetchData(_req, resIndexPattern.title, JSON.parse(body));
        console.log('resData.hits ', resData.hits.total.value);
        console.log('resIndexPattern.title ', resIndexPattern.title);
        //check if limit size is reached
        if (resCount.count === 0) {
          console.log('generateCSV - No Content.');
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
        //const resData   = await this.esFetchData(_req, resIndexPattern.title, JSON.parse(body));
        //console.log('resData.hits ', resData.hits.total.value);
        const arrayHits = [];
        //console.log('resData.hits.total.value ', resData.hits.total.value);
        arrayHits.push(resData.hits);
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
        // console.log('header_search ', header_search);
        // console.log('header is', header);
        // console.log('resIndexPattern.timeFieldName is', resIndexPattern.timeFieldName);
        //console.log('header search is ', header_search);
        //Get data
        for (const valueRes of arrayHits) {
          for (const data_ of valueRes.hits) {
            if (fields_exist === true) {
              const result = this.traverse(data_, header_search);
              dataset.push(result);
            } else {
              dataset.push(data_);
            }
          }
        }
        console.log('dataset row count  is; ', dataset.length);
        const roughObjSize = JSON.stringify(dataset).length;
        converter
          .json2csvAsync(dataset)
          .then(csv => {
            const buf = Buffer.from(JSON.stringify(csv)).toString('base64');
            const bufroughObjSize = JSON.stringify(csv).length;
            console.log('dataset size csv is; ', bufroughObjSize);
            //console.log('buffer size is; ', buf.byteLength);
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
              console.error(
                'CSV Generator - CsvGeneratorService - json2csvAsync - Error while generating the csv',
                err
              );
              return { ok: false, resp: 'Error while updating the index ' + err };
            }
          })
          .catch(err => {
            console.log(err);
            this.updateCSV(_req, documentId, 'failed', nullBinary, err, username, strFilename);
            return { ok: false, resp: 'Error while converting to csv ', err };
          });
      }
    }
  };

  countUserCSV = async (_req, username) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const csvCountByuser = callWithRequest(_req, 'count', {
        index: INDEXNAME,
        q: 'username:' + username,
      });
      return csvCountByuser;
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - countUserCSV - Error while counting the number of csv ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };

  getOldestCsv = async (_req, username) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const docs = await callWithRequest(_req, 'search', {
        index: INDEXNAME,
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
      console.error(
        'CSV Generator - CsvGeneratorService - getOldestCsv - Error while Getting the oldest csv from ElasticSearch ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };

  deleteCsv = async (_req, doc_id) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      return callWithRequest(_req, 'delete', {
        index: INDEXNAME,
        id: doc_id,
      });
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - deleteCsv - Error while deleting the csv from ElasticSearch ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };

  getApi = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const account = callWithRequest(_req, 'get', {
        index: '_opendistro/_security/api/account',
      });
      return account;
    } catch (err) {
      console.error(
        'CSV Generator - CsvGeneratorService - ESFetchScroll - Error while Fetching the scroll data from ElasticSearch ',
        err
      );
      return { ok: false, resp: err.message };
    }
  };

  createPendingCsv = async _req => {
    const time_range_gte = _req.params.start;
    const time_range_lte = _req.params.end;
    const savedsearchId = _req.params.savedsearchId;
    const username = _req.params.username;
    const count = await this.countUserCSV(_req, username);
    const savedSearchInfos = await this.savedSearchInfo(_req, savedsearchId);
    const stripSpaces = savedSearchInfos._source.search.title.split(' ').join('_');
    const strFilename = stripSpaces + '_' + time_range_gte + '_' + time_range_lte + '.csv';
    const nullBinary = 'bnVsbA==';
    if (count.count >= 10) {
      const doc = await this.getOldestCsv(_req, username);
      const doc_id = doc.hits.hits[0]._id;
      await this.deleteCsv(_req, doc_id);
    }
    //console.log('userApiis ', userApis);
    const document = await this.saveCSVToIndex(
      _req,
      strFilename,
      'pending',
      nullBinary,
      'Csv being Generated',
      username,
      'csv'
    );
    this.genereteCsv(_req, document._id, username, strFilename);
    return { ok: true, resp: 'csv file pending !' };
  };
}


*/
