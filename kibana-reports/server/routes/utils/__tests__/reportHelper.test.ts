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
import { createVisualReport } from '../reportHelper';

describe('test create visual report', () => {
  test('create png report', async () => {
    expect.assertions(3);
    const input = {
      report_name: 'Zhongnan_daily_report/4pm',
      report_source: 'Dashboard',
      report_type: 'Download',
      description: 'Hi this is your dashboard',
      report_params: {
        url: 'https://opendistro.github.io/for-elasticsearch-docs/',
        window_width: 1300,
        window_height: 900,
        report_format: 'png',
      },
    };

    const { timeCreated, dataUrl, fileName } = await createVisualReport(input);
    expect(fileName).toContain(`${input.report_name}_${timeCreated}`);
    expect(fileName).toContain(`.${input.report_params.report_format}`);
    expect(dataUrl).toBeDefined();
  }, 20000);

  test('create pdf report', async () => {
    expect.assertions(3);
    const input = {
      report_name: 'Zhongnan_daily_report/4pm',
      report_source: 'Dashboard',
      report_type: 'Download',
      description: 'Hi this is your dashboard',
      report_params: {
        url: 'https://opendistro.github.io/for-elasticsearch-docs/',
        window_width: 1300,
        window_height: 900,
        report_format: 'pdf',
      },
    };

    const { timeCreated, dataUrl, fileName } = await createVisualReport(input);
    expect(fileName).toContain(`${input.report_name}_${timeCreated}`);
    expect(fileName).toContain(`.${input.report_params.report_format}`);
    expect(dataUrl).toBeDefined();
  }, 20000);
});
