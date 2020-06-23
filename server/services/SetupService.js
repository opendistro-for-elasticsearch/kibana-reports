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

const config     = require('../utils/constants');
const INDEX_NAME = config.INDEX_NAME;

export default class SetupService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }

  //check if the index exist
  checkIndexExist = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const indexExist          = await callWithRequest(_req, 'indices.exists', { index: INDEX_NAME });
      return { ok: true, resp: indexExist };
    } catch (err) {
      console.error('Reporting - SetupService - checkIndexExist:', err);
      return { ok: false, resp: err.message };
    }
  };

  // get the mapping of the index
  getMappings = async _req => {
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const mappings            = await callWithRequest(_req, 'indices.getMapping', { index: INDEX_NAME });
      return { ok: true, resp: mappings };
    } catch (err) {
      console.error('Reporting - SetupService - getMappings:', err);
      return { ok: false, resp: err.message };
    }
  };

  //put the mapping of the index
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
          message: {
            type: 'text',
          },
          timestamp: {
            type: 'date',
            format: 'dd-MM-yyyy HH:mm:ss',
          },
          username: {
            type: 'text',
          },
        },
      };
      const mappings = await callWithRequest(_req, 'indices.putMapping', {
        index: INDEX_NAME,
        body: params,
      });
      return { ok: true, resp: mappings };
    } catch (err) {
      console.error('Reporting - SetupService - putMapping:', err);
      return { ok: false, resp: err.message };
    }
  };

  //create the index and applying the mappings.
  createReportingIndex = async _req => {
    try {

      const { callWithRequest } = this.esDriver.getCluster('data');
      const mappings            = await callWithRequest(_req, 'indices.create', { index: INDEX_NAME });

      await this.putMapping(_req);
      return { ok: true, resp: mappings };

    } catch (err) {
      console.error('Reporting - SetupService - createReportingIndex:', err);
      return { ok: false, resp: err.message };
    }
  };

  // check if the index exists. If not create then otherwise do nothing.
  setup = async _req => {
    try {
      const indexExist = await this.checkIndexExist(_req);
      if (!indexExist.resp) {
        await this.createReportingIndex(_req);
      }
      return { ok: true, resp: 'done' };
    } catch (err) {
      console.error('Reporting - SetupService - setup:', err);
      return { ok: false, resp: err.message };
    }
  };
}
