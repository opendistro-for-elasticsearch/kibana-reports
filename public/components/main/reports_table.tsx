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
  // @ts-ignore
  EuiLink
} from '@elastic/eui';

export const reports_list_columns = [
  {
    field: 'reportName',
    name: 'Name',
    sortable: true,
    truncateText: true,
  },
  {
    field: 'created',
    name: 'Created',
    truncateText: true,
  },
  {
    field: 'reportSource',
    name: 'Source',
    render: (username: string) => (
      <EuiLink href={`https://github.com/${username}`} target="_blank">
        {username}
      </EuiLink>
    ),
  },
  {
    field: 'reportPDF',
    name: 'File',
    truncateText: true,
  },
];

export const reports_list_users = [
  {
    id: 1,
    reportName: 'Daily Sales Report, April 21',
    created: 'April 21, 2020 @ 17:00:00',
    reportSource: 'dashboard/daily_saves',
    reportPDF: 'daily_sales_report_2020-04-21_17-e29f99ec3ce8.pdf'
  },
  {
    id: 2,
    reportName: 'Daily Sales Report, April 22',
    created: 'April 22, 2020 @ 17:00:00',
    reportSource: 'dashboard/daily_saves',
    reportPDF: 'daily_sales_report_2020-04-22_17-0012395b51ed.pdf'
  },
  {
    id: 3,
    reportName: 'Daily Sales Report, April 23',
    created: 'April 23, 2020 @ 17:00:00',
    reportSource: 'dashboard/daily_saves',
    reportPDF: 'daily_sales_report_2020-04-23_17-44cf47ed1283jd.pdf'
  },
]
  const loadUsers = () => {};
  const loadUsersWithError = () => {};
  const loading = false;
  const selection = [];
  const onSelectionChange = () => {};

const renderToolsRight = () => {
  return [
    <EuiButton
      key="loadUsers"
      onClick={() => {
        loadUsers();
      }}
      isDisabled={loading}>
      Load Users
    </EuiButton>,
    <EuiButton
      key="loadUsersError"
      onClick={() => {
        loadUsersWithError();
      }}
      isDisabled={loading}>
      Load Users (Error)
    </EuiButton>,
  ];
};

const renderToolsLeft = () => {
  if (selection.length === 0) {
    return;
  }

  const onClick = () => {};

  return (
    <EuiButton color="danger" iconType="trash" onClick={onClick}>
      Delete Users
    </EuiButton>
  );
};

export const reports_list_search = {
  toolsLeft: renderToolsLeft,
  toolsRight: renderToolsRight,
  box: {
    incremental: true,
  },
  filters: [],
};

export const reports_list_selection_value = {
  selectable: (user: { online: boolean; }) => user.online,
  selectableMessage: (selectable: boolean) =>
    !selectable ? 'User is currently offline' : undefined,
  onSelectionChange: (selection: string[]) => onSelectionChange,
};
