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

import { ReportDefinitionSchemaType, ReportSchemaType } from '../../model';
import {
  DELIVERY_TYPE,
  FORMAT,
  REPORT_TYPE,
  TRIGGER_TYPE,
} from '../../routes/utils/constants';
import { validateReport, validateReportDefinition } from '../validationHelper';

const SAMPLE_SAVED_OBJECT_ID = '3ba638e0-b894-11e8-a6d9-e546fe2bba5f';
const createReportDefinitionInput: ReportDefinitionSchemaType = {
  report_params: {
    report_name: 'test visual report',
    report_source: REPORT_TYPE.dashboard,
    description: 'Hi this is your Dashboard on demand',
    core_params: {
      base_url: `/app/dashboards#/view/${SAMPLE_SAVED_OBJECT_ID}`,
      window_width: 1300,
      window_height: 900,
      report_format: FORMAT.pdf,
      time_duration: 'PT5M',
      origin: 'http://localhost:5601',
    },
  },
  delivery: {
    delivery_type: DELIVERY_TYPE.kibanaUser,
    delivery_params: {
      kibana_recipients: [],
    },
  },
  trigger: {
    trigger_type: TRIGGER_TYPE.onDemand,
  },
};
const createReportInput: ReportSchemaType = {
  query_url: `/app/dashboards#/view/${SAMPLE_SAVED_OBJECT_ID}`,
  time_from: 1343576635300,
  time_to: 1596037435301,
  report_definition: createReportDefinitionInput,
};

describe('test input validation', () => {
  test('create report with correct saved object id', async () => {
    const savedObjectIds = [`dashboard:${SAMPLE_SAVED_OBJECT_ID}`];
    const client = mockEsClient(savedObjectIds);
    const report = await validateReport(client, createReportInput);
    expect(report).toBeDefined();
  });

  test('create report with non-exist saved object id', async () => {
    const savedObjectIds = ['dashboard:fake-id'];
    const client = mockEsClient(savedObjectIds);
    await expect(
      validateReport(client, createReportInput)
    ).rejects.toThrowError(
      `saved object with id dashboard:${SAMPLE_SAVED_OBJECT_ID} does not exist`
    );
  });

  test('create report definition with correct saved object id', async () => {
    const savedObjectIds = [`dashboard:${SAMPLE_SAVED_OBJECT_ID}`];
    const client = mockEsClient(savedObjectIds);
    const report = await validateReportDefinition(
      client,
      createReportDefinitionInput
    );
    expect(report).toBeDefined();
  });

  test('create report definition with non-exist saved object id', async () => {
    const savedObjectIds = ['dashboard:fake-id'];
    const client = mockEsClient(savedObjectIds);
    await expect(
      validateReportDefinition(client, createReportDefinitionInput)
    ).rejects.toThrowError(
      `saved object with id dashboard:${SAMPLE_SAVED_OBJECT_ID} does not exist`
    );
  });
});
// TODO: merge this with other mock clients used in testing, to create some mock helpers file
const mockEsClient = (mockSavedObjectIds: string[]) => {
  const client = {
    callAsCurrentUser: jest
      .fn()
      .mockImplementation((endpoint: string, params: any) => {
        switch (endpoint) {
          case 'exists':
            return mockSavedObjectIds.includes(params.id);
          default:
            fail('Fail due to unexpected function call on client');
        }
      }),
  };

  return client;
};
