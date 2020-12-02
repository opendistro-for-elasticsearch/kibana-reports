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
import { ReportDefinitions } from '../report_definitions_table';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const pagination = {
  initialPageSize: 10,
  pageSizeOptions: [8, 10, 13],
};

describe('<ReportDefinitions /> panel', () => {
  configure({ adapter: new Adapter() });
  test('render component', () => {
    let reportDefinitionsTableContent = [
      {
        reportName: 'test report name',
        type: 'Download',
        owner: 'davidcui',
        source: 'Dashboard',
        lastUpdated: 'test updated time',
        details: '',
        status: 'Created',
      },
      {
        reportName: 'test report name 2',
        type: 'Download',
        owner: 'davidcui',
        source: 'Dashboard',
        lastUpdated: 'test updated time',
        details: '',
        status: 'Created',
      },
    ];
    const { container } = render(
      <ReportDefinitions
        pagination={pagination}
        reportDefinitionsTableContent={reportDefinitionsTableContent}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('render empty table', () => {
    const { container } = render(
      <ReportDefinitions
        pagination={pagination}
        reportDefinitionsTableContent={[]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('test click on report definition row', async () => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        assign: jest.fn(),
      },
    });
    let promise = Promise.resolve();
    let reportDefinitionsTableContent = [
      {
        reportName: 'test report name',
        type: 'Download',
        owner: 'davidcui',
        source: 'Dashboard',
        lastUpdated: 'test updated time',
        details: '',
        status: 'Created',
      },
      {
        reportName: 'test report name 2',
        type: 'Download',
        owner: 'davidcui',
        source: 'Dashboard',
        lastUpdated: 'test updated time',
        details: '',
        status: 'Created',
      },
    ];

    const component = mount(
      <ReportDefinitions
        pagination={pagination}
        reportDefinitionsTableContent={reportDefinitionsTableContent}
      />
    );

    const nameLink = component.find('button').at(3);
    nameLink.simulate('click');
  });
});
