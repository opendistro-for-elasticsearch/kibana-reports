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
import { ReportDelivery } from '../delivery';
import httpClientMock from '../../../../../test/httpMockClient';
import { act } from 'react-dom/test-utils';

const emptyRequest = {
  report_params: {
    report_name: '',
    report_source: '',
    description: '',
    core_params: {
      base_url: '',
      report_format: '',
      time_duration: '',
    },
  },
  delivery: {
    delivery_type: '',
    delivery_params: {},
  },
  trigger: {
    trigger_type: '',
    trigger_params: {},
  },
  time_created: 0,
  last_updated: 0,
  status: '',
};

const timeRange = {
  timeFrom: new Date(1234567800),
  timeTo: new Date(1234567890),
};

describe('<ReportDelivery /> panel', () => {
  test('render create component', () => {
    const { container } = render(
      <ReportDelivery
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('render edit component', async () => {
    const promise = Promise.resolve();
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'edit cron schedule component',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
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
      report_definition: editReportDefinitionRequest,
    });

    const { container } = render(
      <ReportDelivery
        edit={true}
        editDefinitionId={'1'}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });
});
