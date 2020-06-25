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
import ReactDOM from 'react-dom';
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
  EuiEmptyPrompt
} from '@elastic/eui';
import {reports_list_columns, reports_list_users, reports_list_search, reports_list_selection_value} from './reports_table'
import {scheduled_report_columns, scheduled_reports} from './scheduled_reports_table'

let httpClientGlobal: { post: (arg0: string, arg1: string) => Promise<any>; };

function fetchDownloadApi(url: string) {
    console.log("fetch download api")
    var data = {
      url: url
    }
     httpClientGlobal.post('../api/reporting/download', JSON.stringify(data)).then((resp) => {
      console.log(resp)
    });
}

const emptyMessageReports = (
  <EuiEmptyPrompt
    title={<h3>You Have No Reports</h3>}
    titleSize="xs"
    body="Create a report from a dashboard or template"
    actions={
      <EuiButton fill>Create report</EuiButton>
    }
  />
)

interface RouterHomeProps {
  httpClient?: any
}

const emptyMessageScheduledReports = (
  <div>
    <h3>You have no scheduled reports</h3>
    <p>
      Create a new schedule to get started
    </p>
    <EuiButton fill>Create schedule</EuiButton>
  </div>
)

const error = "Error: Unable to load table";

export class Main extends React.Component<RouterHomeProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      dashboardList: [],
      selectedDashboard: "",
      selectedScheduleFrequency: "",
      selectedDashboardForSchedule: "",
      schedulerEmailAddress: "",
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

  getRowProps = (item: any) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: (e: any) => {
        if (!$(e.target).is('button')) {
          window.location.assign(`opendistro-kibana-reports#/report_details/${item.id}${this.props.history.location.search}`)
        }
      }
    }
  }

  render() {
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent panelPaddingSize={"l"}>
            <EuiFlexGroup justifyContent="spaceEvenly">
              <EuiFlexItem>
                <EuiTitle>
                  <h2>Reports ({reports_list_users.length})</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">
                  Delete
                </EuiButton>  
              </EuiFlexItem>  
            </EuiFlexGroup>
            <EuiHorizontalRule/>
            <EuiInMemoryTable
              items={reports_list_users}
              itemId="id"
              loading={false}
              message={emptyMessageReports}
              columns={reports_list_columns}
              search={reports_list_search}
              pagination={this.pagination}
              sorting={true}
              selection={reports_list_selection_value}
              isSelectable={true}
              rowProps={this.getRowProps}
              />
          </EuiPageContent>
          <EuiSpacer/>
          <EuiPageContent panelPaddingSize={"l"}>
            <EuiFlexGroup justifyContent="spaceEvenly">
              <EuiFlexItem>
                <EuiTitle>
                  <h2>Scheduled Reports ({scheduled_reports.length})</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">
                  Delete
                </EuiButton>  
              </EuiFlexItem>  
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">
                  Edit
                </EuiButton>  
              </EuiFlexItem>              
              <EuiFlexItem component="span" grow={false}>
                <EuiButton 
                  fill={true}
                  onClick={() => {window.location.assign('opendistro-kibana-reports#/create')}}
                >
                  Create
                </EuiButton>
              </EuiFlexItem>          
            </EuiFlexGroup>
            <EuiHorizontalRule/>
            <EuiInMemoryTable
              items={scheduled_reports}
              itemId="id"
              loading={false}
              message={emptyMessageScheduledReports}
              columns={scheduled_report_columns}
              search={reports_list_search} // todo: change?
              pagination={this.pagination}
              sorting={true}
              selection={reports_list_selection_value} // todo: change?
              isSelectable={true}
            />
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
