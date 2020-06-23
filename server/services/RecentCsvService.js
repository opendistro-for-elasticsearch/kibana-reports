
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

const moment        = require('moment');
const dateMath      = require('@elastic/datemath');
const config        = require('../utils/constants');
const INDEX_NAME    = config.INDEX_NAME;
const CSV_BY_USERS  = config.CSV_BY_USERS;

export default class RecentCsvService {
  constructor(esDriver, esServer) {
    this.esDriver = esDriver;
    this.esServer = esServer;
  }

  // getting the advanced settings of kibana
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

  latestReports = async _req => {
    try {
      const histories           = [];
      const { callWithRequest } = this.esDriver.getCluster('data');
      const indexes             = await callWithRequest(_req, 'search', {
        index: INDEX_NAME,
        body: {
          size: CSV_BY_USERS,
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

      const advancedSettings  = await this.getAdvancedSettings(_req);
      const dateFormat        = advancedSettings.hits.hits[0]._source.config.dateFormat;
      const format            = [];
      if(dateFormat) format.push(dateFormat);
      else format.push('MMM D, YYYY @ HH:mm:ss.SSS');
      for (const history of indexes.hits.hits) {
        histories.push({
          id        : history._id,
          saveSearch: history._source.file,
          status    : history._source.status,
          message   : history._source.message,
          date      : moment(history._source.date,'DD-MM-YYYY HH:mm:ss').format(format.toString()),
          download  : history._source.downloadLink,
          userId    : history._source.userId,
          username  : history._source.username,
        });
      }
      return { ok: true, resp: histories };
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };

  getRecentReports = async _req => {
    try {
      const recentsCsv = await this.latestReports(_req);
      return recentsCsv;
    } catch (err) {
      return { ok: false, resp: err.message };
    }
  };
}
