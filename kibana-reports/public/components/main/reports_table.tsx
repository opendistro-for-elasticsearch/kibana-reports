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
import {
  fileFormatsUpper,
  generateReport,
  humanReadableDate,
} from './main_utils';
import { returnStatement } from '@babel/types';

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
          <EuiLink>
            Get started with Kibana reporting <EuiIcon type="popout" />
          </EuiLink>
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
        report_format: url['format'], // current default format
      },
    };
    return onDemandDownloadMetadata;
  };

  const getReportsTableItemContent = (url) => {
    let index;
    for (index = 0; index < props.reportsTableItems.length; ++index) {
      if (url === reportsTableItems[index].url) {
        return reportsTableItems[index];
      }
    }
  };

  const onDemandDownload = async (url: any) => {
    let data = getReportsTableItemContent(url);
    handleLoading(true);
    await generateReport(updateMetadata(data), httpClient);
    handleLoading(false);
  };

  const getReportsTableItemId = (reportName) => {
    let index;
    for (index = 0; index < props.reportsTableItems.length; ++index) {
      if (reportName === reportsTableItems[index].reportName) {
        return reportsTableItems[index].id;
      }
    }
  };

  const getReportsTableItemFormat = (url) => {
    let index;
    for (index = 0; index < props.reportsTableItems.length; ++index) {
      if (url === reportsTableItems[index].url) {
        return reportsTableItems[index].format;
      }
    }
  };

  const navigateToReportDetails = (reportName: any) => {
    let id = getReportsTableItemId(reportName);
    window.location.assign(`opendistro_kibana_reports#/report_details/${id}`);
  };

  const reportsTableColumns = [
    {
      field: 'reportName',
      name: 'Name',
      render: (reportName) => (
        <EuiLink onClick={() => navigateToReportDetails(reportName)}>
          {reportName}
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
      field: 'sender',
      name: 'Sender',
      sortable: true,
      truncateText: false,
    },
    {
      field: 'kibanaRecipients',
      name: 'Kibana recipient(s)',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'emailRecipients',
      name: 'Email recipient(s)',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'reportSource',
      name: 'Source',
      render: (source) => <EuiLink>{source}</EuiLink>,
    },
    {
      field: 'lastUpdated',
      name: 'Last updated',
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
      field: 'url',
      name: 'Generate',
      render: (data) => {
        let format = getReportsTableItemFormat(data);
        return (
          <EuiLink onClick={() => onDemandDownload(data)}>
            {fileFormatsUpper[format]} <EuiIcon type="importAction" />
          </EuiLink>
        );
      },
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
        field: 'kibanaRecipients',
        name: 'Kibana recipients',
        multiselect: false,
        options: uniqueRecipients.map((user) => ({
          value: user,
          name: user,
          view: user,
        })),
      },
      {
        type: 'field_value_selection',
        field: 'recipients',
        name: 'Email recipients',
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
    <Fragment>
      <EuiInMemoryTable
        items={reportsTableItems}
        itemId="id"
        loading={false}
        message={emptyMessageReports}
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
