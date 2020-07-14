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
  EuiLink,
  EuiInMemoryTable,
  EuiButton,
  EuiEmptyPrompt,
  EuiText,
} from '@elastic/eui';
import { report_definitions } from './test_data';

export const scheduled_report_columns = [
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
    field: 'owner',
    name: 'Owner',
    sortable: true,
    truncateText: false,
  },
  {
    field: 'source',
    name: 'Source',
    render: (username: string) => (
      <EuiLink href={'#'} target="_blank">
        {username}
      </EuiLink>
    ),
  },
  {
    field: 'lastUpdated',
    name: 'Last Updated',
    truncateText: true,
  },
  {
    field: 'details',
    name: 'Details',
    sortable: false,
    truncateText: true,
  },
  {
    field: 'status',
    name: 'Status',
    sortable: true,
    truncateText: false,
  },
];

const empty_message_report_definitions = (
  <EuiEmptyPrompt
    title={<h3>No report definitions to display</h3>}
    titleSize="xs"
    body={
      <div>
        <EuiText>Create a new report definition to get started</EuiText>
        <EuiText>
          To learn more, see{' '}
          <EuiLink>Get started with Kibana reporting</EuiLink>
        </EuiText>
      </div>
    }
    actions={
      <div>
        <EuiButton
          onClick={() => {
            window.location.assign('opendistro-kibana-reports#/create');
          }}
        >
          Create
        </EuiButton>
      </div>
    }
  />
);

const report_definitions_search = {
  box: {
    incremental: true,
  },
  filters: [],
};

export function ReportDefinitions(props) {
  const { pagination, getRowProps } = props;
  return (
    <div>
      <EuiInMemoryTable
        items={report_definitions}
        itemId="id"
        loading={false}
        message={empty_message_report_definitions}
        columns={scheduled_report_columns}
        search={report_definitions_search}
        pagination={pagination}
        sorting={true}
        isSelectable={true}
        rowProps={getRowProps}
      />
    </div>
  );
}
