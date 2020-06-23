
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

const config     = require('../utils/constants');
const INDEX_NAME = config.INDEX_NAME;

export default class DownloadService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }

  //get a report by id
  getReport   = async _req => {
    const report_id = _req.params.report_id;
    try {
      const { callWithRequest } = this.esDriver.getCluster('data');
      const report              = await callWithRequest(_req, 'get', { index: INDEX_NAME, id: report_id });
      const binary              = report._source.binary;
      const json                = Buffer.from(binary, 'base64').toString('utf-8');
      const data                = { filename: report._source.file, report: JSON.parse(json) };
      return { ok: true, resp: data };
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  download = async _req => {
    try {
      const recentsCsv = await this.getReport(_req);
      return { ok: true, resp: recentsCsv.resp };
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };
}
