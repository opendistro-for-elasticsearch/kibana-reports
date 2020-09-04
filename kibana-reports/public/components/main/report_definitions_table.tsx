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
  EuiLink,
  EuiInMemoryTable,
  EuiButton,
  EuiEmptyPrompt,
  EuiText,
  EuiIcon,
} from '@elastic/eui';
import { humanReadableDate } from './main_utils';

const emptyMessageReportDefinitions = (
  <EuiEmptyPrompt
    title={<h3>No report definitions to display</h3>}
    titleSize="xs"
    body={
      <div>
        <EuiText>Create a new report definition to get started</EuiText>
        <EuiText>
          To learn more, see{' '}
          <EuiLink>
            Get started with Kibana reporting <EuiIcon type="popout" />
          </EuiLink>
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
          Create report definition
        </EuiButton>
      </div>
    }
  />
);

const reportDefinitionsSearch = {
  box: {
    incremental: true,
  },
  filters: [],
};

export function ReportDefinitions(props) {
  const { pagination, getRowProps, reportDefinitionsTableContent } = props;

  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('des');

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const getDefinitionTableItemId = (name) => {
    let index;
    for (
      index = 0;
      index < props.reportDefinitionsTableContent.length;
      ++index
    ) {
      if (name === reportDefinitionsTableContent[index].reportName) {
        return reportDefinitionsTableContent[index].id;
      }
    }
  };

  const navigateToDefinitionDetails = (name: any) => {
    let id = getDefinitionTableItemId(name);
    window.location.assign(
      `opendistro_kibana_reports#/report_definition_details/${id}`
    );
  };

  const reportDefinitionsColumns = [
    {
      field: 'reportName',
      name: 'Name',
      render: (name) => (
        <EuiLink onClick={() => navigateToDefinitionDetails(name)}>
          {name}
        </EuiLink>
      ),
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
      render: (date) => {
        let readable = humanReadableDate(date);
        return <EuiText size="s">{readable}</EuiText>;
      },
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

  return (
    <div>
      <EuiInMemoryTable
        items={reportDefinitionsTableContent}
        itemId="id"
        loading={false}
        message={emptyMessageReportDefinitions}
        columns={reportDefinitionsColumns}
        search={reportDefinitionsSearch}
        pagination={pagination}
        sorting={sorting}
        isSelectable={true}
        tableLayout={'auto'}
      />
    </div>
  );
}
