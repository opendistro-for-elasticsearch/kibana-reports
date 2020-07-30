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
} from '@elastic/eui';
import { reports_list_users, report_definitions } from './test_data';
import { ReportsTable } from './reports_table';
import { ReportDefinitions } from './report_definitions_table';

let httpClientGlobal: { post: (arg0: string, arg1: string) => Promise<any> };

interface RouterHomeProps {
  httpClient?: any;
}

const error = 'Error: Unable to load table';

export class Main extends React.Component<RouterHomeProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dashboardList: [],
      selectedDashboard: '',
      selectedScheduleFrequency: '',
      selectedDashboardForSchedule: '',
      schedulerEmailAddress: '',
      scheduledReportFileName: [],
      pagination: this.pagination,
      renderCreateReport: false,
    };
  }

  pagination = {
    initialPageSize: 10,
    pageSizeOptions: [8, 10, 13],
  };

  componentDidMount() {
    const { httpClient } = this.props;
    httpClientGlobal = httpClient;
  }

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
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent panelPaddingSize={'l'}>
            <EuiFlexGroup justifyContent="spaceEvenly">
              <EuiFlexItem>
                <EuiTitle>
                  <h2>Reports ({reports_list_users.length})</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">Refresh</EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule />
            <ReportsTable
              getRowProps={this.getReportsRowProps}
              pagination={this.pagination}
            />
          </EuiPageContent>
          <EuiSpacer />
          <EuiPageContent panelPaddingSize={'l'}>
            <EuiFlexGroup justifyContent="spaceEvenly">
              <EuiFlexItem>
                <EuiTitle>
                  <h2>Report definitions ({report_definitions.length})</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem component="span" grow={false}>
                <EuiButton
                  fill={true}
                  onClick={() => {
                    window.location.assign('opendistro_kibana_reports#/create');
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
            />
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
