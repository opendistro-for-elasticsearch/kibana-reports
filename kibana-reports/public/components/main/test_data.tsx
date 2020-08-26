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

export const report_definitions = [
  {
    reportName: 'Daily Sales Report',
    type: 'Schedule',
    owner: 'davidcui',
    source: 'dashboard/daily_saves',
    lastUpdated: new Date('April 20 2020 19:32:102'),
    details: 'Daily at 17:00:00.000 starting April 1, 2020',
    status: 'Active',
  },
];

export const reports_list_users = [
  {
    id: 1,
    reportName: 'Daily Sales Report, April 21',
    type: 'Schedule',
    sender: 'davidcui',
    recipients: ['szhongna', 'jadhanir', 'kvngar'],
    reportSource: 'dashboard/daily_saves',
    lastUpdated: new Date('April 21 2020 10:21:313'),
    state: 'Created',
  },
  {
    id: 2,
    reportName: 'Daily Sales Report, April 22',
    type: 'Schedule',
    sender: 'davidcui',
    recipients: ['szhongna', 'jadhanir', 'kvngar'],
    reportSource: 'dashboard/daily_saves',
    lastUpdated: new Date('April 22 2020 10:21:313'),
    state: 'Created',
  },
  {
    id: 3,
    reportName: 'Daily Sales Report, April 23',
    type: 'Schedule',
    sender: 'davidcui',
    recipients: ['szhongna', 'jadhanir', 'kvngar'],
    reportSource: 'dashboard/daily_saves',
    lastUpdated: new Date('April 23 2020 10:21:313'),
    state: 'Created',
  },
  {
    id: 4,
    reportName: 'Web logs traffic July 7',
    type: 'Schedule',
    sender: 'jadhanir',
    recipients: ['szhongna', 'davidcui'],
    reportSource: 'dashboard/web_logs',
    lastUpdated: new Date('July 7 2020 10:21:313'),
    state: 'Created',
  },
];
