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

import React from 'react';
import { render } from '@testing-library/react';
import { ReportDetails } from '../report_details';
import propsMock from '../../../../../test/propsMock';
import httpClientMock from '../../../../../test/httpMockClient';
import 'babel-polyfill';
import { act } from 'react-dom/test-utils';

function setBreadcrumbs(array: []) {
  jest.fn();
}

describe('<ReportDetails /> panel', () => {
  const match = {
    params: {
      reportId: '1',
    },
  };

  test('render on-demand component', async () => {
    const promise = Promise.resolve();
    const report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: 'PT30M',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'On demand',
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      query_url: `http://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g=(time:(from:'2020-10-23T20:53:35.315Z',to:'2020-10-23T21:23:35.316Z'))`,
    });

    const { container } = render(
      <ReportDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    await act(() => promise);
    await expect(container.firstChild).toMatchSnapshot();
  });

  test('render 5 hours recurring component', async () => {
    const promise = Promise.resolve();
    const report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: 'PT30M',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 5,
              unit: 'HOURS',
              timezone: 'PST8PDT',
            },
          },
          enabled_time: 1114939203,
          enabled: true,
        },
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      query_url: `http://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g=(time:(from:'2020-10-23T20:53:35.315Z',to:'2020-10-23T21:23:35.316Z'))`,
    });

    const { container } = render(
      <ReportDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    await act(() => promise);
    await expect(container.firstChild).toMatchSnapshot();
  });
});
