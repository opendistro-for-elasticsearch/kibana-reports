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
import moment from 'moment';

describe('<ReportDefinitions /> panel', () => {
  test('render component', () => {
    let report_definitions_table_content = [
      {
        reportName: "test report name",
        type: "Download",
        owner: "davidcui",
        source: "Dashboard",
        lastUpdated: "test updated time",
        details: "",
        status: "Created"
      }
    ]
    const { container } = render(
    <ReportDefinitions 
      report_definitions_table_content={report_definitions_table_content}
    />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
