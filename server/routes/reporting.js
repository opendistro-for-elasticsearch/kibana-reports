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

export default function(server, options, services) {
  const { setupService }        = services;
  const { recentReportService } = services;
  const { reportingService }    = services;
  const { downloadService }     = services;

  server.route({
    path: '/api/reporting/setup',
    method: 'GET',
    config: {
      tags: ['access:csv_generator'],
      handler: setupService.setup,
    },
  });

  server.route({
    path: '/api/reporting/reportingList',
    method: 'GET',
    config: {
      tags: ['access:csv_generator'],
      handler: recentReportService.getRecentReports,
    },
  });

  server.route({
    path: '/api/reporting/generateCsv/{savedsearchId}/{start}/{end}/{username}',
    method: 'GET',
    config: {
      tags: ['access:csv_generator'],
      handler: reportingService.createPendingReport,
    },
  });

  server.route({
    path: '/api/reporting/download/{report_id}',
    method: 'GET',
    config: {
      tags: ['access:csv_generator'],
      handler: downloadService.download,
    },
  });
}
