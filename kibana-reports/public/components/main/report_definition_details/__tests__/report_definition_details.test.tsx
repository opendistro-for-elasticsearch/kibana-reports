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
import { act, render } from '@testing-library/react';
import { ReportDefinitionDetails } from '../report_definition_details';
import httpClientMock from '../../../../../test/httpMockClient';
import 'babel-polyfill';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

function setBreadcrumbs(array: []) {
  jest.fn();
}

describe('<ReportDefinitionDetails /> panel', () => {
  let propsMock = {
    match: {
      params: {
        reportDefinitionId: jest.fn(),
      },
    },
  };

  const match = {
    params: {
      reportDefinitionId: '1',
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  configure({ adapter: new Adapter() });
  test('render on demand definition details', async () => {
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
      report_definition,
    });

    const { container } = render(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render 5 hours recurring definition details', async () => {
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
          time_duration: '',
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
    });

    const { container } = render(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render disabled daily definition, click', async () => {
    let promise = Promise.resolve();
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
          time_duration: '',
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
              period: 1,
              unit: 'DAYS',
              timezone: 'PST8PDT',
            },
          },
          enabled_time: 1114939203,
          enabled: false,
        },
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    const { container } = render(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('simulate click on generateReport', async () => {
    let promise = Promise.resolve();
    const report_definition = {
      report_params: {
        report_name: null,
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
      report_definition,
    });

    const component = mount(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    await act(() => promise);
    component.update();
    const statusButton = component.find('button').at(1);

    statusButton.simulate('click');
    await act(() => promise);
  });

  test('simulate click on delete', async () => {
    let promise = Promise.resolve();
    const report_definition = {
      report_params: {
        report_name: null,
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
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 1,
              unit: 'DAYS',
              timezone: 'PST8PDT',
            },
          },
          enabled_time: 1114939203,
          enabled: false,
        },
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    const component = mount(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );

    const statusButton = component.find('button').at(0);
    statusButton.update();
    statusButton.simulate('click');

    await act(() => promise);
  });

  test('simulate click to enable', async () => {
    let promise = Promise.resolve();
    const report_definition = {
      status: 'Disabled',
      report_params: {
        report_name: 'test click on enable disable',
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
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 1,
              unit: 'DAYS',
              timezone: 'PST8PDT',
            },
          },
          enabled_time: 1114939203,
          enabled: false,
        },
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    httpClientMock.put = jest.fn().mockResolvedValue({});

    const component = mount(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    await act(() => promise);
    component.update();
    const statusButton = component.find('button').at(1);

    statusButton.simulate('click');
    await act(() => promise);
  });

  test('simulate click to disable', async () => {
    let promise = Promise.resolve();
    const report_definition = {
      status: 'Active',
      report_params: {
        report_name: 'test click on enable disable',
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
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 1,
              unit: 'DAYS',
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
    });

    httpClientMock.put = jest.fn().mockResolvedValue({});

    const component = mount(
      <ReportDefinitionDetails
        httpClient={httpClientMock}
        props={propsMock}
        match={match}
        setBreadcrumbs={setBreadcrumbs}
      />
    );
    await act(() => promise);
    component.update();
    const statusButton = component.find('button').at(1);

    statusButton.simulate('click');
    await act(() => promise);
  });
});
