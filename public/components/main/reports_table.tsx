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
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiOverlayMask,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { reports_list_users } from './test_data';
import { generateReport } from './main_utils';

const reportStatusOptions = [
  'Created',
  'Error',
  'Pending',
  'Shared',
  'Archived',
];
const reportTypeOptions = ['Schedule', 'Download', 'Alert'];

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
  const { getRowProps, pagination, reportsTableItems, httpClient } = props;

  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('des');
  const [showLoading, setShowLoading] = useState(false);

  const handleLoading = (e) => {
    setShowLoading(e);
  };

  const GenerateReportLoadingModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(true);

    const closeModal = () => {
      setIsModalVisible(false);
      setShowLoading(false);
    };
    const showModal = () => setIsModalVisible(true);

    return (
      <div>
        <EuiOverlayMask>
          <EuiModal onClose={closeModal}>
            <EuiModalHeader>
              <EuiTitle>
                <EuiText textAlign="right">
                  <h2>Generating report</h2>
                </EuiText>
              </EuiTitle>
            </EuiModalHeader>
            <EuiModalBody>
              <EuiText>Preparing your file for download...</EuiText>
              <EuiSpacer />
              <EuiFlexGroup justifyContent="spaceAround" alignItems="center">
                <EuiFlexItem>
                  <EuiLoadingSpinner size="xl" />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiModalBody>
          </EuiModal>
        </EuiOverlayMask>
      </div>
    );
  };

  const updateMetadata = (url: any) => {
    const onDemandDownloadMetadata = {
      report_name: url['reportName'],
      report_source: url['reportSource'],
      report_type: 'Download',
      description: 'On-demand download of report ' + url['reportName'],
      report_params: {
        url: url['url'],
        window_width: 1440,
        window_height: 2560,
        report_format: 'pdf', // current default format
      },
    };
    return onDemandDownloadMetadata;
  };

  const onDemandDownload = async (url: any) => {
    handleLoading(true);
    await generateReport(updateMetadata(url), httpClient);
    handleLoading(false);
  };

  const reportsTableColumns = [
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
      field: 'url',
      name: 'Download',
      sortable: false,
      actions: [
        {
          name: 'Generate report',
          description: 'Generates the report',
          type: 'icon',
          icon: 'download',
          onClick: (url: any) => onDemandDownload(url),
        },
      ],
    },
  ];

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

  const reportsListSearch = {
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
        options: reportStatusOptions.map((state) => ({
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
        options: reportTypeOptions.map((type) => ({
          value: type,
          name: type,
          view: type,
        })),
      },
    ],
  };

  const showLoadingModal = showLoading ? <GenerateReportLoadingModal /> : null;

  return (
    <div>
      <EuiInMemoryTable
        items={reportsTableItems}
        itemId="id"
        loading={false}
        message={emptyMessageReports}
        columns={reportsTableColumns}
        search={reportsListSearch}
        pagination={pagination}
        sorting={sorting}
        rowProps={getRowProps}
      />
      {showLoadingModal}
    </div>
  );
}
