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
import {
  EuiButton,
  EuiPage,
  EuiLink
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';

export const scheduled_report_columns = [
    {
      field: 'reportName',
      name: 'Name',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'lastUpdated',
      name: 'Last Updated',
      truncateText: true,
    },
    {
      field: 'reportSource',
      name: 'Source',
      render: username => (
        <EuiLink href={`https://github.com/${username}`} target="_blank">
          {username}
        </EuiLink>
      ),
    },
    {
      field: 'schedule',
      name: 'Schedule',
      truncateText: true,
    },
];

export const scheduled_reports = [
    {
        reportName: 'Daily Sales Report',
        lastUpdated: 'April 21, 2020 @ 17:00:00',
        reportSource: 'dashboard/daily_saves',
        schedule: 'Daily at 17:00:00.000 starting April 1, 2020'
    }
]