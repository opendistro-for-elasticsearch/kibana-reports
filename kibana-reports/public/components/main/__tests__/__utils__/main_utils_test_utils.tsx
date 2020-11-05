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

export const reportTableMockResponse = [
  {
    _id: '123456',
    _index: 'test',
    _score: 1,
    _source: {
      last_updated: 123456789,
      query_url: 'test_query_url_value.com',
      report_definition: {
        delivery: {
          delivery_type: 'Kibana user',
          delivery_params: {
            kibana_recipients: [],
          },
        },
        report_params: {
          report_name: 'Test report table response',
          description: 'description',
          report_source: 'Dashboard',
          core_params: {
            base_url: 'test_base_url.com',
            header: '',
            footer: '',
            report_format: 'pdf',
            time_duration: 'PT30M',
            window_height: 800,
            window_width: 1200,
          },
        },
        trigger: {
          trigger_type: 'On demand',
        },
        state: 'Created',
        time_created: 123456780,
        time_from: 123456780,
        time_to: 123456799,
      },
    },
    _type: 'doc',
  },
];

export const mockReportsTableItems = [
  {
    id: '123456',
    reportName: 'Test report table response',
    type: 'On demand',
    sender: '—',
    kibanaRecipients: '—',
    emailRecipients: '—',
    reportSource: 'Dashboard',
    timeCreated: undefined,
    state: undefined,
    url: 'test_query_url_value.com',
    format: 'pdf',
  },
];

export const reportDefinitionsTableMockResponse = [
  {
    _index: 'report_definition',
    _type: '_doc',
    _id: '42MmKXUBDW-VXnk7pa6d',
    _score: 1,
    _source: {
      report_definition: {
        report_params: {
          report_name: 'schedule definition',
          report_source: 'Dashboard',
          description: 'description',
          core_params: {
            base_url: 'test_base_url.com',
            report_format: 'pdf',
            header: '',
            footer: '',
            time_duration: 'PT30M',
            window_width: 1200,
            window_height: 800,
          },
        },
        delivery: {
          delivery_type: 'Kibana user',
          delivery_params: { kibana_recipients: [] },
        },
        trigger: {
          trigger_type: 'Schedule',
          trigger_params: {
            enabled_time: 1602713178321,
            schedule: {
              period: 1,
              interval: 'DAYS',
            },
            schedule_type: 'Recurring',
            enabled: false,
          },
        },
        time_created: 1602713199604,
        last_updated: 1602713211007,
        status: 'Disabled',
      },
    },
  },
];

export const reportDefinitionsTableMockContent = [
  {
    id: '42MmKXUBDW-VXnk7pa6d',
    reportName: 'schedule definition',
    type: 'Schedule',
    owner: '—',
    source: 'Dashboard',
    baseUrl: 'test_base_url.com',
    lastUpdated: 1602713211007,
    details: 'Recurring',
    status: 'Disabled',
  },
];
