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

describe('<ReportSettings /> panel', () => {
  test('render component', () => {
    let createReportDefinitionRequest = {
      report_name: '',
      report_source: '',
      report_type: '',
      description: '',
      report_params: {
        url: ``,
        report_format: '',
        window_width: 1560,
        window_height: 2560,
      },
      delivery: {},
      trigger: {},
    };

    const { container } = render(
      <ReportSettings
        createReportDefinitionRequest={createReportDefinitionRequest}
        httpClientProps={httpClientMock}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
