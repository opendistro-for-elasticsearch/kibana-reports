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
import { ReportDefinitionDetails } from '../report_definition_details';

describe('<ReportDefinitionDetails /> panel', () => {
  const created_date = new Date('April 20, 2020 20:32:12');

  const reportDefinitionDetailsMockMetadata = {
    name: '[Logs] Web traffic',
    description: '--',
    created: created_date.toString(),
    last_updated: '--',
    source: 'dashboards/daily_sales',
    time_period: 'Last 30 minutes',
    file_format: 'PDF',
    report_header: '--',
    report_footer: '--',
    trigger_type: 'Schedule',
    schedule_details: '--',
    alert_details: '--',
    status: 'Active',
    delivery_channels: ['Kibana reports'],
    kibana_recipients: ['admin'],
    email_recipients: 'user1@email.com',
    email_subject: 'Latest web traffic report',
    email_body:
      'View report details %REPORT_DETAILS_URL% Download report file %FILE_DOWNLOAD_URL%',
    include_report_as_attachment: true,
  };

  const match = {
    params: {
      reportDefinitionId: '1',
    },
  };

  test('render component', () => {
    const { container } = render(
      <ReportDefinitionDetails
        match={match}
        reportDefinitionDetailsMetadata={reportDefinitionDetailsMockMetadata}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
