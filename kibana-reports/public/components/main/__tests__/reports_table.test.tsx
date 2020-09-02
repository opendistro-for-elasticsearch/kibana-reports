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
import { ReportsTable } from '../reports_table';
import httpClientMock from '../../../../test/httpMockClient';

describe('<ReportsTable /> panel', () => {
  test('render component', () => {
    let reportsTableItems = [
      {
        id: '1',
        reportName: 'test report table item',
        type: 'Test type',
        sender: 'N/A',
        recipients: 'N/A',
        reportSource: 'Test report source',
        lastUpdated: 'test updated time',
        state: 'Created',
        url: 'Test url',
      },
    ];
    const { container } = render(
      <ReportsTable
        reportsTableItems={reportsTableItems}
        httpClient={httpClientMock}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
