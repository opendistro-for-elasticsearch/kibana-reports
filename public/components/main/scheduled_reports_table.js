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