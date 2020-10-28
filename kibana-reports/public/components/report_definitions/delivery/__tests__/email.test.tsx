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
import { EmailDelivery } from '../email';
import httpClientMock from '../../../../../test/httpMockClient';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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

describe('<EmailDelivery /> panel', () => {
  configure({ adapter: new Adapter() });
  test('render email create component', async () => {
    const { container } = render(
      <EmailDelivery
        edit={false}
        showEmailRecipientsError={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('render email edit component', async () => {
    const promise = Promise.resolve();
    let report_definition = {
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
        delivery_type: 'Email',
        delivery_params: {
          title: 'Mock delivery title',
          textDescription: 'Mock delivery text description',
          recipients: ['test@mock.com', 'mock@test.com'],
        },
      },
      trigger: {
        trigger_type: 'On demand',
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    const { container } = render(
      <EmailDelivery
        edit={true}
        editDefinitionId={'1'}
        showEmailRecipientsError={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render edit email display error', async () => {
    const promise = Promise.resolve();
    let report_definition = {
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
        delivery_type: 'Email',
        delivery_params: {
          title: 'Mock delivery title',
          textDescription: 'Mock delivery text description',
          recipients: ['test@mock.com', 'mock@test.com'],
        },
      },
      trigger: {
        trigger_type: 'On demand',
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    const { container } = render(
      <EmailDelivery
        edit={true}
        editDefinitionId={'1'}
        showEmailRecipientsError={true}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('test render Kibana recipient', async () => {
    const promise = Promise.resolve();
    let report_definition = {
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
        delivery_type: 'Kibana user',
      },
      trigger: {
        trigger_type: 'On demand',
      },
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    const { container } = render(
      <EmailDelivery
        edit={true}
        editDefinitionId={'1'}
        showEmailRecipientsError={true}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('test create email recipient', async () => {
    let promise = Promise.resolve();

    const component = mount(
      <EmailDelivery
        edit={false}
        showEmailRecipientsError={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
      />
    );
    component.update();

    const emailRecipientsBox = component.find('input').at(0);
    emailRecipientsBox.simulate('change', {
      target: { value: 'test@test.com' },
    });
    emailRecipientsBox.simulate('keydown', { key: 'Enter' });
    await act(() => promise);
  });
});
