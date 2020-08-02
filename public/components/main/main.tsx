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
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  // @ts-ignore
  EuiPage,
  EuiTitle,
  // @ts-ignore
  EuiPageBody,
  // @ts-ignore
  EuiPageContent,
  // @ts-ignore
  EuiInMemoryTable,
  EuiHorizontalRule,
  EuiSpacer,
  // @ts-ignore
  EuiEmptyPrompt,
  EuiToast,
  EuiLoadingSpinner,
  EuiGlobalToastList,
  EuiModal,
  EuiOverlayMask,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiText,
  EuiComboBoxTitle,
} from '@elastic/eui';
import { ReportsTable } from './reports_table';
import { ReportDefinitions } from './report_definitions_table';
import {
  extractFilename,
  extractFileFormat,
  getFileFormatPrefix,
  addReportsTableContent,
  addReportDefinitionsTableContent,
  getReportSettingDashboardOptions,
  removeDuplicatePdfFileFormat,
} from './main_utils';

interface RouterHomeProps {
  httpClient?: any;
}

export class Main extends React.Component<RouterHomeProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      pagination: this.pagination,
      renderCreateReport: false,
      showGenerateReportLoadingModal: false,
      showGenerateReportSuccessfulToast: false,
      generateReportFilename: '',
      generateReportFileFormat: '',
      generateReportStatus: '',
      reportsTableContent: [],
      reportDefinitionsTableContent: [],
      reportSourceDashboardOptions: [],
    };
  }

  pagination = {
    initialPageSize: 10,
    pageSizeOptions: [8, 10, 13],
  };

  GenerateReportLoadingModal() {
    const [isModalVisible, setIsModalVisible] = useState(true);

    const closeModal = () => setIsModalVisible(false);
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
  }

  readStreamToFile = async (stream: string) => {
    let link = document.createElement('a');
    let fileFormatPrefix = getFileFormatPrefix(
      this.state.generateReportFileFormat
    );
    console.log('fileformat prefix is', fileFormatPrefix);
    let url = fileFormatPrefix + stream;
    if (typeof link.download !== 'string') {
      window.open(url, '_blank');
      return;
    }
    link.download = this.state.generateReportFilename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    await this.updateReportsTableContent();
    document.body.removeChild(link);
  };

  generateReport = async (metadata) => {
    const { httpClient } = this.props;
    this.setState({
      showGenerateReportLoadingToast: true,
    });
    httpClient
      .post('../api/reporting/generateReport', {
        body: JSON.stringify(metadata),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async (response) => {
        const fileFormat = extractFileFormat(response['filename']);
        const fileName = extractFilename(response['filename']);
        this.setState({
          generateReportFilename: fileName,
          generateReportFileFormat: fileFormat,
        });
        this.readStreamToFile(await response['data']);
        this.setState({
          showGenerateReportLoadingToast: false,
        });
        return response;
      })
      .catch((error) => {
        console.log('error on generating report:', error);
        this.setState({
          showGenerateReportLoadingToast: false,
        });
      });
  };

  updateReportsTableContent = async () => {
    const { httpClient } = this.props;
    httpClient
      .get('../api/reporting/reports')
      .then((response) => {
        this.setState({
          reportsTableContent: addReportsTableContent(response.data),
        });
      })
      .catch((error) => {
        console.log('error when fetching all reports: ', error);
      });
  };

  componentDidMount() {
    const { httpClient } = this.props;
    // get all reports
    httpClient
      .get('../api/reporting/reports')
      .then((response) => {
        console.log('get reports response is', response);
        this.setState({
          reportsTableContent: addReportsTableContent(response.data),
        });
        addReportsTableContent(response.data);
      })
      .catch((error) => {
        console.log('error when fetching all reports: ', error);
      });

    // get all report definitions
    httpClient
      .get('../api/reporting/reportDefinitions')
      .then((response) => {
        this.setState({
          reportDefinitionsTableContent: addReportDefinitionsTableContent(
            response.data
          ),
        });
      })
      .catch((error) => {
        console.log('error when fetching all report definitions: ', error);
      });
  }

  refreshReportsTable = async () => {
    const { httpClient } = this.props;
    await httpClient
      .get('../api/reporting/reports')
      .then((response) => {
        this.setState({
          reportsTableContent: addReportsTableContent(response.data),
        });
        addReportsTableContent(response.data);
      })
      .catch((error) => {
        console.log('error when fetching all reports: ', error);
      });
  };

  refreshReportsDefinitionsTable = async () => {
    const { httpClient } = this.props;
    await httpClient
      .get('../api/reporting/reportDefinitions')
      .then((response) => {
        this.setState({
          reportDefinitionsTableContent: addReportDefinitionsTableContent(
            response.data
          ),
        });
      })
      .catch((error) => {
        console.log('error when fetching all report definitions: ', error);
      });
  };

  getReportsRowProps = (item: any) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: (e: any) => {
        if (!$(e.target).is('button')) {
          window.location.assign(
            `opendistro_kibana_reports#/report_details/${item.id}${this.props.history.location.search}`
          );
        }
      },
    };
  };

  getReportDefinitionsRowProps = (item: any) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: (e: any) => {
        if (!$(e.target).is('button')) {
          window.location.assign(
            `opendistro_kibana_reports#/report_definition_details/${item.id}${this.props.history.location.search}`
          );
        }
      },
    };
  };

  render() {
    const showLoading = this.state.showGenerateReportLoadingToast ? (
      <this.GenerateReportLoadingModal />
    ) : null;

    return (
      <div>
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent panelPaddingSize={'l'}>
              <EuiFlexGroup justifyContent="spaceEvenly">
                <EuiFlexItem>
                  <EuiTitle>
                    <h2>Reports ({this.state.reportsTableContent.length})</h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem component="span" grow={false}>
                  <EuiButton size="m" onClick={this.refreshReportsTable}>
                    Refresh
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiHorizontalRule />
              <ReportsTable
                getRowProps={this.getReportsRowProps}
                pagination={this.pagination}
                generateReport={this.generateReport}
                reports_table_items={this.state.reportsTableContent}
              />
            </EuiPageContent>
            <EuiSpacer />
            <EuiPageContent panelPaddingSize={'l'}>
              <EuiFlexGroup justifyContent="spaceEvenly">
                <EuiFlexItem>
                  <EuiTitle>
                    <h2>
                      Report definitions (
                      {this.state.reportDefinitionsTableContent.length})
                    </h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton onClick={this.refreshReportsDefinitionsTable}>
                    Refresh
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem component="span" grow={false}>
                  <EuiButton
                    fill={true}
                    onClick={() => {
                      window.location.assign(
                        'opendistro_kibana_reports#/create'
                      );
                    }}
                  >
                    Create
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiHorizontalRule />
              <ReportDefinitions
                pagination={this.pagination}
                getRowProps={this.getReportDefinitionsRowProps}
                report_definitions_table_content={
                  this.state.reportDefinitionsTableContent
                }
              />
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
        {showLoading}
      </div>
    );
  }
}
