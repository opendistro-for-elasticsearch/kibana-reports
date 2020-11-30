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
import { Main } from '../main';
import httpClientMock from '../../../../test/httpMockClient';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';

function setBreadcrumbs(array: []) {
  jest.fn();
}

describe('<Main /> panel', () => {
  configure({ adapter: new Adapter() });
  test('render component', async (done) => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        assign: jest.fn(),
        href: 'opendistro_kibana_reports#/',
      },
    });

    const { container } = await render(
      <Main httpClient={httpClientMock} setBreadcrumbs={setBreadcrumbs} />
    );

    expect(container.firstChild).toMatchSnapshot();
    done();
  });

  test('render component after create success', async () => {
    delete window.location;

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        assign: jest.fn(),
        href: 'opendistro_kibana_reports#/create=success',
      },
    });

    const { container } = render(
      <Main httpClient={httpClientMock} setBreadcrumbs={setBreadcrumbs} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('render component after edit success', async () => {
    delete window.location;

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        assign: jest.fn(),
        href: 'opendistro_kibana_reports#/edit=success',
      },
    });

    const { container } = render(
      <Main httpClient={httpClientMock} setBreadcrumbs={setBreadcrumbs} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('test refresh reports definitions button', async () => {
    const promise = Promise.resolve();
    const data = [
      {
        _id: 'abcdefg',
        _source: {
          query_url: '/app/visualize/edit/1234567890',
          state: 'Created',
          time_created: 123456789,
          time_from: 123456789,
          time_to: 1234567890,
          report_definition: {
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
          },
        },
      },
    ];

    httpClientMock.get = jest.fn().mockResolvedValue({
      data,
    });

    const component = mount(
      <Main httpClient={httpClientMock} setBreadcrumbs={setBreadcrumbs} />
    );
    await act(() => promise);

    const generate = component.find('button').at(7);
    generate.simulate('click');
    await act(() => promise);
  });

  test('test refresh reports table button', async () => {
    const promise = Promise.resolve();
    const data = [
      {
        _id: 'abcdefg',
        _source: {
          query_url: '/app/visualize/edit/1234567890',
          state: 'Created',
          time_created: 123456789,
          time_from: 123456789,
          time_to: 1234567890,
          report_definition: {
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
          },
        },
      },
    ];

    httpClientMock.get = jest.fn().mockResolvedValue({
      data,
    });

    const component = mount(
      <Main httpClient={httpClientMock} setBreadcrumbs={setBreadcrumbs} />
    );
    await act(() => promise);

    const generate = component.find('button').at(0);
    generate.simulate('click');
    await act(() => promise);
  });

  // TODO: mock catch() error response to contain status code 
  test.skip('test error toasts posted', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // silence console log error from main
    const promise = Promise.resolve();

    httpClientMock.get = jest.fn().mockResolvedValue({
      response: null,
    });

    const component = mount(
      <Main httpClient={httpClientMock} setBreadcrumbs={setBreadcrumbs} />
    );
    const generate = component.find('button').at(7);
    try {
      generate.simulate('click');
      await act(() => promise);
    } catch (e) {
      await act(() => promise);
    }
  });
});
