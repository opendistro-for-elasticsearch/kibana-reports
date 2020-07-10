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

import React, { useState } from 'react';
import {
  EuiButton,
  // @ts-ignore
  EuiLink,
  EuiText,
  EuiIcon,
  EuiButtonIcon,
  EuiEmptyPrompt,
  EuiInMemoryTable,
  EuiFlexGroup,
  EuiSwitch,
  EuiFlexItem,
  EuiCheckbox,
} from '@elastic/eui';
import { reports_list_users } from './test_data';

export const reports_list_columns = [
  {
    field: 'reportName',
    name: 'Name',
    sortable: true,
    truncateText: true,
  },
  {
    field: 'type',
    name: 'Type',
    sortable: true,
    truncateText: false,
  },
  {
    field: 'sender',
    name: 'Sender',
    sortable: true,
    truncateText: false,
  },
  {
    field: 'recipients',
    name: 'Recipient(s)',
    sortable: true,
    truncateText: true,
  },
  {
    field: 'reportSource',
    name: 'Source',
    render: (username: string) => (
      <EuiLink href={'#'} target="_blank">
        {username}
      </EuiLink>
    ),
  },
  {
    field: 'lastUpdated',
    name: 'Last updated',
    truncateText: true,
  },
  {
    field: 'state',
    name: 'State',
    sortable: true,
    truncateText: false,
  },
  {
    field: 'download',
    name: 'Download',
    sortable: false,
    render: (download: any) => {
      return <EuiButtonIcon iconType="download" />;
    },
  },
];

const emptyMessageReports = (
  <EuiEmptyPrompt
    title={<h3>No reports to display</h3>}
    titleSize="xs"
    body={
      <div>
        <EuiText>
          To get started, share or download a report from a dashboard,
          visualization or saved search, or create a report definition
        </EuiText>
        <EuiText>
          To learn more, see{' '}
          <EuiLink>Get started with Kibana reporting</EuiLink>
        </EuiText>
      </div>
    }
  />
);

export function ReportsTable(props) {
  const { getRowProps, pagination } = props;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('desc');

  const onTableChange = ({ page = {}, sort = {} }) => {
    const { index: pageIndex, size: pageSize } = page;

    const { field: sortField, direction: sortDirection } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const uniqueSenders = [];
  reports_list_users.map((user) => {
    if (uniqueSenders.indexOf(user.sender) === -1) {
      uniqueSenders.push(user.sender);
    }
  });

  const uniqueRecipients = [];
  reports_list_users.map((user) => {
    for (const [index, value] of user.recipients.entries()) {
      if (uniqueRecipients.indexOf(value) === -1) {
        uniqueRecipients.push(value);
      }
    }
  });

  const reports_status_options = [
    'Created',
    'Error',
    'Pending',
    'Shared',
    'Archived',
  ];
  const reports_type_options = ['Schedule', 'Download', 'Alert'];

  const reports_list_search = {
    box: {
      incremental: true,
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'sender',
        name: 'Sender',
        multiselect: false,
        options: uniqueSenders.map((user) => ({
          value: user,
          name: user,
          view: user,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'recipients',
        name: 'Recipients',
        multiselect: false,
        options: uniqueRecipients.map((user) => ({
          value: user,
          name: user,
          view: user,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'state',
        name: 'State',
        multiselect: false,
        options: reports_status_options.map((state) => ({
          value: state,
          name: state,
          view: state,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'type',
        name: 'Type',
        multiselect: false,
        options: reports_type_options.map((type) => ({
          value: type,
          name: type,
          view: type,
        })),
      },
    ],
  };

  return (
    <div>
      <EuiInMemoryTable
        items={reports_list_users}
        itemId="id"
        loading={false}
        message={emptyMessageReports}
        columns={reports_list_columns}
        search={reports_list_search}
        pagination={pagination}
        sorting={sorting}
        rowProps={getRowProps}
        onChange={onTableChange}
      />
    </div>
  );
}
