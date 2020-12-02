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

import 'regenerator-runtime/runtime';
import { createVisualReport } from '../visual_report/visualReportHelper';
import { Logger } from '../../../../../../src/core/server';
import { ReportParamsSchemaType, reportSchema } from '../../../model';

const mockLogger: Logger = {
  info: jest.fn(),
  trace: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  log: jest.fn(),
  get: jest.fn(),
};

const input = {
  query_url: '/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d',
  time_from: 1343576635300,
  time_to: 1596037435301,
  report_definition: {
    report_params: {
      report_name: 'test visual report',
      report_source: 'Dashboard',
      description: 'Hi this is your Dashboard on demand',
      core_params: {
        base_url: '/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d',
        window_width: 1300,
        window_height: 900,
        report_format: 'png',
        time_duration: 'PT5M',
        origin: 'http://localhost:5601',
      },
    },
    delivery: {
      delivery_type: 'Kibana user',
      delivery_params: {
        kibana_recipients: [],
      },
    },
    trigger: {
      trigger_type: 'On demand',
    },
  },
};

const queryUrl =
  'https://demo.elastic.co/app/kibana#/dashboard/welcome_dashboard';

describe('test create visual report', () => {
  test('create report with valid input', async () => {
    // Check if the assumption of input is up-to-date
    reportSchema.validate(input);
  }, 20000);

  test('create png report', async () => {
    expect.assertions(3);
    const reportParams = input.report_definition.report_params;
    const { dataUrl, fileName } = await createVisualReport(
      reportParams as ReportParamsSchemaType,
      queryUrl,
      mockLogger,
      undefined,
      './.chromium/headless_shell'
    );
    expect(fileName).toContain(`${reportParams.report_name}`);
    expect(fileName).toContain('.png');
    expect(dataUrl).toBeDefined();
  }, 30000);

  test('create pdf report', async () => {
    expect.assertions(3);
    const reportParams = input.report_definition.report_params;
    reportParams.core_params.report_format = 'pdf';

    const { dataUrl, fileName } = await createVisualReport(
      reportParams as ReportParamsSchemaType,
      queryUrl,
      mockLogger,
      undefined,
      './.chromium/headless_shell'
    );
    expect(fileName).toContain(`${reportParams.report_name}`);
    expect(fileName).toContain('.pdf');
    expect(dataUrl).toBeDefined();
  }, 30000);
});
