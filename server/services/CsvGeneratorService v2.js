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
const moment        = require('moment');
const converter     = require('json-2-csv');
const config        = require('../utils/constants');
const INDEXNAME     = config.INDEXNAME;
const CSV_BY_USERS  = config.CSV_BY_USERS;
const MaxCSVRows    = config.MAXCSVROWS;
const esb           = require('elastic-builder');

export default class CsvGeneratorService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }
  checkIndexExist = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const indexExist          = await callWithRequest(_req, 'indices.exists', { index: INDEXNAME });
      return { ok: true, resp: indexExist };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - checkIndexExist:', err);
      return { ok: false, resp: err.message };
    }
  };
  getSingleCSV  = async _req => {
    const csvId = _req.params.csvId;
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const csv                 = await callWithRequest(_req, 'get', { index: INDEXNAME, id: csvId });
      const binary              = csv._source.binary;
      const json                = Buffer.from(binary, 'base64').toString('utf-8');
      const data                = { filename: csv._source.file, csv: JSON.parse(json) };
      return { ok: true, resp: data };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - getSingleCSV:', err);
      return { ok: false, resp: err.message };
    }
  };
  saveCSVToIndex = async (_req, file, status, binary, message, username, type) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const date                = moment().format('DD-MM-YYYY HH:mm:ss');
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
      console.error('CSV Generator - CsvGeneratorService - saveCSVToIndex - Error from while saving csv to index:', err);
      return { ok: false, resp: err.message };
    }
  };

  updateCSV = async (_req, documentId, status, binary, message, username, file) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      console.log('updating the csv in the  index');
      //console.log('username in update is ', username);
      //const docToUpdate = this.getSingleCSV();
      const date   = moment().format('DD-MM-YYYY HH:mm:ss');
      const params = {
        index: INDEXNAME,
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
      // console.log('params are ', params);
      const document = await callWithRequest(_req, 'index', params);
      //return document;
      return { ok: true, resp: document };
    } catch (err) {
      console.error('CSV Generator - CsvGeneratorService - updateCSV - Error from while updating the csv to index:',err);
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
    const { callWithRequest }  = this.esDriver.getCluster('data');
    const indexpatern          = await callWithRequest(_req, 'get', {
      index: '.kibana',
      id: 'index-pattern:' + indexpatternId,
    });
    return indexpatern;
  };
  esFetchCount = async (_req, indexPatternTitle, bodyCount) => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const fecthCountRes       = callWithRequest(_req, 'count', {
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
      const fecthDataRes        = callWithRequest(_req, 'search', {
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
      const fecthDataScrollRes  = callWithRequest(_req, 'scroll', {
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
    const time_range_gte  = _req.params.start;
    const time_range_lte  = _req.params.end;
    const savedsearchId   = _req.params.savedsearchId;
    let strColumns        = '';
    const header_search   = [];
    let fields_exist      = false;
    let savedSearchInfos  = {};
    let indexPatter       = '';
    let resIndexPattern   = '';
    let fieldsPattern     = '';
    let body              = '';
    let header            = [];
    const dataset         = [];
    const nullBinary      = 'bnVsbA==';

    savedSearchInfos = await this.savedSearchInfo(_req, savedsearchId);
    //console.log('savedSearchInfos._source.search.columns ', savedSearchInfos._source.search.columns);
    const filters = savedSearchInfos._source.search.kibanaSavedObjectMeta.searchSourceJSON;
    //console.log('filters are', filters);
    for (const column of savedSearchInfos._source.search.columns) {
      if (column !== '_source') {
        if (strColumns !== '') {
          strColumns = strColumns + ',';
        }
        //console.log('column is', column;
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

    console.log('strColumns is', strColumns);

    //Get index name
    for (const item of savedSearchInfos._source.references) {
      //console.log('item is ', item);
      if (item.name === JSON.parse(filters).indexRefName) {
        //Get index-pattern informations (index-pattern name & timeFieldName)
        indexPatter = await this.indexPattern(_req, item.id);
        //console.log('indexPatter is ', indexPatter);
        resIndexPattern = indexPatter._source['index-pattern'];
        fieldsPattern   = resIndexPattern.fields; //Get fields type
        console.log('fieldsPattern are ', fieldsPattern);
        //Get fields Date
        const list_columns_date = [];
        for (const item of JSON.parse(fieldsPattern)) {
          if (item.type === 'date') {
            list_columns_date.push(item.name);
          }
        }
        console.log('list_columns_date Date fields are :', list_columns_date);

        //building query
      //   const requestBody = esb.requestBodySearch().query(esb.boolQuery()
      //     .must([
      //       esb.matchQuery(
      //         'Origin', origin,
      //       ),
      //       (
      //         esb.matchQuery(
      //           'Name', name,
      //         )
      //       ),
      //     ])
      //   .filter(esb.rangeQuery('Weight_in_lbs').gte(weight))
      // );
        // const requestBody = esb.requestBodySearch().query(esb.boolQuery()
        //       .must(esb.matchQuery('Origin', 'USA'))
        //       .filter(esb.rangeQuery('Cylinders').gte(4).lte(6))
        //       .should(esb.termQuery('Name', 'ford'))
        //       .mustNot(esb.rangeQuery('Horsepower').gte(75))

        //   );
        //  console.log('requestBody.toJSON() is ', requestBody.toJSON());

          let requestBody = esb.boolQuery();
          // let requestBody3 = esb.requestBodySearch().query(
          //   requestBody2
          //     .must(esb.matchQuery('Origin', 'USA'))

          // );
          // console.log('requestBody3.toJSON() is ', requestBody3.toJSON());
          //console.log('esb is ',esb);
        let must     = '"must": [ ';
        let must_not = '"must_not": [ ';
        // console.log('filters are', JSON.parse(filters).filter);
        for (const item of JSON.parse(filters).filter) {
          console.log('item is ', item);
          if (item.meta.disabled === false) {
            switch (item.meta.negate) {
              case false:
                console.log('item.meta.type is ', item.meta.type);
                switch (item.meta.type) {
                  case 'phrase':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    requestBody.must(esb.matchPhraseQuery(item.meta.key,item.meta.params.query));
                    must = must + '{ "match_phrase": { "' + item.meta.key + '":"' + item.meta.params.query + '" } }';
                    break;
                  case 'exists':
                    if (must !== '"must": [ ') {
                        must = must + ',';
                    }
                    requestBody.must(esb.existsQuery(item.meta.key));
                    must = must + '{ "exists": { "field": "' + item.meta.key + '" } }';
                    break;
                  case 'phrases':
                    if (must !== '"must": [ ') {
                      must = must + ',';
                    }
                    must = must + ' { "bool": { "should": [ ';
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                       console.log('item is ', item);
                       console.log('valueSplit are: ', valueSplit);
                      for (const [key, incr] of valueSplit.entries()) {
                        if (key !== 0) {
                          must = must + ',';
                        }
                        requestBody.should(esb.matchPhraseQuery(item.meta.key,incr));
                        must = must + '{ "match_phrase": { "' + item.meta.key + '": "' + incr + '" } }';
                      }
                    } else {
                      requestBody.should(esb.matchPhraseQuery(item.meta.key, item.meta.params.query));
                      must = must + '{ "match_phrase": { "' + item.meta.key + '": "' + item.meta.value + '" } }';
                    }
                    requestBody.minimumShouldMatch(1);
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
                    requestBody.mustNot(esb.matchPhraseQuery(item.meta.key,item.meta.params.query));
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
                    requestBody.mustNot(esb.existsQuery(item.meta.key));
                    must_not = must_not + '{ "exists": { "field": "' + item.meta.key + '" } }';
                    break;
                  case 'phrases':
                    if (must_not !== '"must_not": [ ') {
                      must_not = must_not + ',';
                    }
                    //requestBody.mustNot();
                    must_not = must_not + ' { "bool": { "should": [ ';
                    if (item.meta.value.indexOf(',') > -1) {
                      const valueSplit = item.meta.value.split(', ');
                      for (const [key, incr] of valueSplit.entries()) {
                        if (key !== 0) {
                          must_not = must_not + ',';
                        }

                        requestBody.should(esb.matchPhraseQuery(item.meta.key,incr));
                        must_not =
                          must_not +
                          '{ "match_phrase": { "' +
                          item.meta.key +
                          '": "' +
                          incr +
                          '" } }';
                      }
                    } else {
                      requestBody.should(esb.matchPhraseQuery(item.meta.key,item.meta.params.query));
                      //requestBody.mustNot().should(esb.matchPhraseQuery("'" + item.meta.key + "'", "'" + incr + "'"));
                      must_not =
                        must_not +
                        '{ "match_phrase": { "' +
                        item.meta.key +
                        '": "' +
                        item.meta.value +
                        '" } }';
                    }
                    requestBody.minimumShouldMatch(1);
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
          requestBody.must(esb.rangeQuery(resIndexPattern.timeFieldName).format("epoch_millis").gte(time_range_gte).lte(time_range_lte));
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
        const searchQuery  = JSON.parse(filters).query.query.split(':');
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
          requestBody.filter(esb.matchAllQuery());
          body =
            '"query": { "bool": { ' +
            must +
            ', "filter": [ { "match_all": {} } ], "should": [], ' +
            must_not +
            ' } } ';
        }
        //body = '"query": { "bool": { ' + must + ', "filter": [ { "match_all": {} } ], "should": [], ' + must_not + ' } } ';
        const bodyCount = '{' + body + '}';
        const resCount  = await this.esFetchCount(_req, resIndexPattern.title, bodyCount).catch(
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
        let reqBody = esb.requestBodySearch().query(requestBody).version(true).size(10000);
        if (strSort.length === 1) {
          //console.log('1 yes ');
          // console.log('strSort[0]', strSort[0]);
          // console.log('strSort[0][0]', strSort[0][0]);
          // console.log('strSort[0][1]', strSort[0][1]);
          // console.log('"sort":[{"' + strSort[0][0] + '":{ "order": "' + strSort[0][1] + '"} }] ');
          sorting = '"sort":[{"' + strSort[0][0] + '":{ "order": "' + strSort[0][1] + '"} }] ';
          reqBody.sort(esb.sort(strSort[0][0],strSort[0][1]));
        } else {
          reqBody.sorts(esb.sort(strSort[0],strSort[1]));
          sorting = '"sort":[{"' + strSort[0] + '":{ "order": "' + strSort[1] + '"} }] ';
        }
        if (fields_exist) {
          reqBody.source({ includes: strColumns });
          body =
            '{ "version": true, "size": 10000,' +
            sorting +
            ', "_source": { "includes": [' +
            strColumns +
            '] },' +
            body +
            '}';
        } else {
          console.log('yes');
          body = '{ "version": true, "size": 10000,' + sorting + ',' + body + '}';
        }

        //requestBody.version(true).size(10000);
        // body            = '{ "version": true, "size": 1000,' + sorting + ', "_source": { "includes": [' + strColumns + '] },' + body + '}';
        //Count
        console.log('body is', body);
        // console.log('requestBody is', requestBody);
        // console.log('requestBody.toJSON() is', requestBody.toJSON());
        // console.log('reqBody is', reqBody);
        console.log('reqBody.toJSON() is', reqBody.toJSON());

        const nb_countDiv     = resCount.count / 10000;
        const modulo_countDiv = resCount.count % 10000;
        console.log('nb_countDiv ', nb_countDiv);
        console.log('modulo_countDiv ', modulo_countDiv);
        //Fecth data
        //console.log('bodyCount is', bodyCount);
        //console.log('JSON.parse(body) is', JSON.parse(body));
        const resData = await this.esFetchData(_req, resIndexPattern.title, JSON.parse(body));
        const resData2 = await this.esFetchData(_req, resIndexPattern.title, reqBody.toJSON());
        console.log('resData.hits ', resData.hits.total.value);
        console.log('resData2.hits ', resData2.hits.total.value);
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

        const options      = {delimiter:',' , emptyFieldValue:' ' }
        converter
          .json2csvAsync(dataset, options)
          .then(csv => {
            const buf             = Buffer.from(JSON.stringify(csv)).toString('base64');
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
      const csvCountByuser      = callWithRequest(_req, 'count', {
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
      const docs                = await callWithRequest(_req, 'search', {
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
      const account             = callWithRequest(_req, 'get', {
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
    const time_range_gte    = _req.params.start;
    const time_range_lte    = _req.params.end;
    const savedsearchId     = _req.params.savedsearchId;
    const username          = _req.params.username;
    const count             = await this.countUserCSV(_req, username);
    const savedSearchInfos  = await this.savedSearchInfo(_req, savedsearchId);
    const stripSpaces       = savedSearchInfos._source.search.title.split(' ').join('_');
    const strFilename       = stripSpaces + '_' + time_range_gte + '_' + time_range_lte + '.csv';
    const nullBinary        = 'bnVsbA==';
    if (count.count >= CSV_BY_USERS) {
      const doc     = await this.getOldestCsv(_req, username);
      const doc_id  = doc.hits.hits[0]._id;
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
