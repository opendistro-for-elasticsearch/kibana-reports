
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
