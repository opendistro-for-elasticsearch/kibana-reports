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

import React, { Fragment, useState } from 'react';
import {
  EuiButton,
  // @ts-ignore
  EuiLink,
  EuiText,
  EuiIcon,
  EuiEmptyPrompt,
  EuiInMemoryTable,
} from '@elastic/eui';
import {
  fileFormatsUpper,
  humanReadableDate,
  generateReportById,
} from './main_utils';
import { GenerateReportLoadingModal } from './loading_modal';

const reportStatusOptions = [
  'Created',
  'Error',
  'Pending',
  'Shared',
  'Archived',
];
const reportTypeOptions = ['Schedule', 'On demand'];

const emptyMessageReports = (
  <EuiEmptyPrompt
    title={<h3>No reports to display</h3>}
    titleSize="xs"
    body={
      <div>
        <EuiText>
          Create a report definition, or share/download a report from a
          dashboard, saved search or visualization.
        </EuiText>
        <EuiText>
          To learn more, see{' '}
          <EuiLink>
            Get started with Kibana reporting <EuiIcon type="popout" />
          </EuiLink>
        </EuiText>
      </div>
    }
  />
);

export function ReportsTable(props) {
  const {
    pagination,
    reportsTableItems,
    httpClient,
    handleSuccessToast,
    handleErrorToast,
    handlePermissionsMissingToast,
  } = props;

  const [sortField, setSortField] = useState('timeCreated');
  const [sortDirection, setSortDirection] = useState('des');
  const [showLoading, setShowLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoading = (e) => {
    setShowLoading(e);
  };

  const onDemandDownload = async (id: any) => {
    handleLoading(true);
    await generateReportById(
      id,
      httpClient,
      handleSuccessToast,
      handleErrorToast,
      handlePermissionsMissingToast
    );
    handleLoading(false);
  };

  const reportsTableColumns = [
    {
      field: 'reportName',
      name: 'Name',
      render: (reportName, item) => (
        <EuiLink
          disabled={item.state === 'Pending'}
          onClick={() => {
            window.location.assign(
              `opendistro_kibana_reports#/report_details/${item.id}`
            );
          }}
          id={'reportDetailsLink'}
        >
          {reportName}
        </EuiLink>
      ),
    },
    {
      // TODO: link to dashboard/visualization snapshot, use "queryUrl" field. Display dashboard name?
      field: 'reportSource',
      name: 'Source',
      render: (source, item) =>
        item.state === 'Pending' ? (
          <EuiText size="s">{source}</EuiText>
        ) : (
          <EuiLink href={item.url} target="_blank">
            {source}
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
      field: 'timeCreated',
      name: 'Creation time',
      render: (date) => {
        let readable = humanReadableDate(date);
        return <EuiText size="s">{readable}</EuiText>;
      },
    },
    {
      field: 'state',
      name: 'State',
      sortable: true,
      truncateText: false,
    },
    {
      field: 'id',
      name: 'Generate',
      render: (id, item) =>
        item.state === 'Pending' ? (
          <EuiText size="s">
            {fileFormatsUpper[item.format]} <EuiIcon type="importAction" />
          </EuiText>
        ) : (
          <EuiLink onClick={() => onDemandDownload(id)}>
            {fileFormatsUpper[item.format]} <EuiIcon type="importAction" />
          </EuiLink>
        ),
    },
  ];

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const reportsListSearch = {
    box: {
      incremental: true,
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'type',
        name: 'Type',
        multiSelect: 'or',
        options: reportTypeOptions.map((type) => ({
          value: type,
          name: type,
          view: type,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'state',
        name: 'State',
        multiSelect: 'or',
        options: reportStatusOptions.map((state) => ({
          value: state,
          name: state,
          view: state,
        })),
      },
    ],
  };

  const displayMessage =
    reportsTableItems.length === 0
      ? emptyMessageReports
      : '0 reports match the search criteria. Search again';

  const showLoadingModal = showLoading ? 
    <GenerateReportLoadingModal setShowLoading={setShowLoading} /> : null;

  return (
    <Fragment>
      <EuiInMemoryTable
        items={reportsTableItems}
        itemId="id"
        loading={false}
        message={displayMessage}
        columns={reportsTableColumns}
        search={reportsListSearch}
        pagination={pagination}
        sorting={sorting}
        hasActions={true}
        tableLayout={'auto'}
      />
      {showLoadingModal}
    </Fragment>
  );
}
