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
import { ReportSettings } from '../report_settings';
import 'babel-polyfill';
import 'regenerator-runtime';
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

let timeRange = {
  timeFrom: new Date(123456789),
  timeTo: new Date(1234567890),
};

const dashboardHits = {
  hits: [
    {
      _id: 'dashboard:abcdefghijklmnop12345',
      _source: {
        dashboard: {
          description: 'mock dashboard value',
          hits: 0,
          timeFrom: 'now-24h',
          timeTo: 'now',
          title: 'Mock Dashboard',
        },
      },
    },
  ],
};

const visualizationHits = {
  hits: [
    {
      _id: 'visualization:abcdefghijklmnop12345',
      _source: {
        visualization: {
          description: 'mock visualization value',
          title: 'Mock Visualization',
        },
      },
    },
  ],
};

const savedSearchHits = {
  hits: [
    {
      _id: 'search:abcdefghijklmnop12345',
      _source: {
        search: {
          title: 'Mock saved search value',
        },
      },
    },
  ],
};

describe('<ReportSettings /> panel', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  test('render component', () => {
    const { container } = render(
      <ReportSettings
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('render edit, dashboard source', async () => {
    const promise = Promise.resolve();
    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: 'test description',
        core_params: {
          base_url: 'http://localhost:5601',
          report_format: 'pdf',
          header: 'header content',
          footer: 'footer content',
          time_duration: 'PT30M',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {},
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      hits: dashboardHits,
    });

    const { container } = render(
      <ReportSettings
        edit={true}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render edit, visualization source', async () => {
    const promise = Promise.resolve();
    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Visualization',
        description: 'test description',
        core_params: {
          base_url: 'http://localhost:5601',
          report_format: 'png',
          header: 'header content',
          footer: 'footer content',
          time_duration: 'PT30M',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {},
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      hits: visualizationHits,
    });

    const { container } = render(
      <ReportSettings
        edit={true}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render edit, saved search source', async () => {
    const promise = Promise.resolve();
    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Saved search',
        description: 'test description',
        core_params: {
          base_url: 'http://localhost:5601',
          report_format: 'csv',
          header: 'test header content',
          footer: 'test footer content',
          time_duration: 'PT30M',
          saved_search_id: 'abcdefghijk',
          limit: 10000,
          excel: true,
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {},
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      hits: savedSearchHits,
    });

    const { container } = render(
      <ReportSettings
        edit={true}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('dashboard create from in-context', async () => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        href:
          'http://localhost:5601/app/opendistro_kibana_reports#/create?previous=dashboard:7adfa750-4c81-11e8-b3d7-01146121b73d?timeFrom=2020-10-26T20:52:56.382Z?timeTo=2020-10-27T20:52:56.384Z',
      },
    });

    const promise = Promise.resolve();

    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: 'http://localhost:5601',
          report_format: 'png',
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
        trigger_params: {},
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      hits: dashboardHits,
    });

    const { container } = render(
      <ReportSettings
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('visualization create from in-context', async () => {
    // @ts-ignore
    delete window.location; // reset window.location.href for in-context testing

    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        href:
          'http://localhost:5601/app/opendistro_kibana_reports#/create?previous=visualize:7adfa750-4c81-11e8-b3d7-01146121b73d?timeFrom=2020-10-26T20:52:56.382Z?timeTo=2020-10-27T20:52:56.384Z',
      },
    });

    const promise = Promise.resolve();

    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Visualization',
        description: '',
        core_params: {
          base_url: 'http://localhost:5601',
          report_format: 'pdf',
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
        trigger_params: {},
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      hits: visualizationHits,
    });

    const { container } = render(
      <ReportSettings
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('saved search create from in-context', async () => {
    // @ts-ignore
    delete window.location; // reset window.location.href for in-context testing

    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href:
          'http://localhost:5601/app/opendistro_kibana_reports#/create?previous=discover:7adfa750-4c81-11e8-b3d7-01146121b73d?timeFrom=2020-10-26T20:52:56.382Z?timeTo=2020-10-27T20:52:56.384Z',
      },
    });

    const promise = Promise.resolve();

    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Saved search',
        description: '',
        core_params: {
          base_url: 'http://localhost:5601',
          report_format: 'csv',
          header: '',
          footer: '',
          time_duration: 'PT30M',
          saved_search_id: 'abcdefghijk',
          limit: 10000,
          excel: true,
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {},
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
      hits: savedSearchHits,
    });

    const { container } = render(
      <ReportSettings
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={false}
        showTimeRangeError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('display errors on create', async () => {
    const promise = Promise.resolve();
    const { container } = render(
      <ReportSettings
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showSettingsReportNameError={true}
        showTimeRangeError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });
});
