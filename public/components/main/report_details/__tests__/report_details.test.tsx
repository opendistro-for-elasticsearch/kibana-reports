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
import { ReportDetails } from '../report_details';

describe('<ReportDetails /> panel', () => {
  const created_date = new Date("April 20, 2020 20:32:12");

  // since props is currently empty, snapshot test depends on const supplied from report_details.tsx
  // will be fixed after front-end connected w/ back-end and props is defined
  const reportDetailsMockMetadata = {
    report_name: "Daily Sales Report-232o2jsf28492h3rjskfbwjk23",
    description: "Report Description Here",
    created: created_date.toString(),
    last_updated: created_date.toString(),
    source_type: "Download",
    source: "dashboard/daily_sales",
    default_file_format: "PDF",
    report_header: "--",
    report_footer: "--", 
    report_type: "Schedule",
    schedule_type: "Now",
    schedule_details: "--",
    alert_details: "--",
    channel: "Kibana Reports", 
    kibana_recipients: "admin",
    email_recipients: "--",
    email_subject: "--",
    email_body: "--",
    report_as_attachment: false
  }

  test('render component', () => {
    const { container } = render(
      <ReportDetails 
        reportId={"1"}
        reportDetailsMetadata={reportDetailsMockMetadata}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});