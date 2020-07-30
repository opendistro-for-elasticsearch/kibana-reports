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
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiHorizontalRule,
  EuiSpacer,
  EuiPageHeaderSection,
  EuiButton,
  EuiText,
} from '@elastic/eui';
import { ReportDetailsComponent } from '../report_details/report_details';

const created_date = new Date('April 20, 2020 20:32:12');

const reportDefinitionDetailsMockMetadata = {
  name: '[Logs] Web traffic',
  description: '--',
  created: created_date.toString(),
  last_updated: '--',
  source: 'dashboards/daily_sales',
  time_period: 'Last 30 minutes',
  file_format: 'PDF',
  report_header: '--',
  report_footer: '--',
  trigger_type: 'Schedule',
  schedule_details: '--',
  alert_details: '--',
  status: 'Active',
  delivery_channels: ['Kibana reports'],
  kibana_recipients: ['admin'],
  email_recipients: 'user1@email.com',
  email_subject: 'Latest web traffic report',
  email_body:
    'View report details %REPORT_DETAILS_URL% Download report file %FILE_DOWNLOAD_URL%',
  include_report_as_attachment: true,
};

interface ReportDefinitionDetailsRouteProps {
  reportDefinitionId: string;
  reportDefinitionDetailsMetadata: {
    name: string;
    description: string;
    created: string;
    last_updated: string;
    source: string;
    time_period: string;
    file_format: string;
    report_header: string;
    report_footer: string;
    trigger_type: string;
    schedule_details: string;
    alert_details: string;
    status: string;
    delivery_channels: string[];
    kibana_recipients: string[];
    email_recipients: string;
    email_subject: string;
    email_body: string;
    include_report_as_attachment: boolean;
  };
}

export function ReportDefinitionDetails(
  props: ReportDefinitionDetailsRouteProps
) {
  const reportId = props.reportDefinitionId;

  const includeReportAsAttachmentString = reportDefinitionDetailsMockMetadata.include_report_as_attachment
    ? 'True'
    : 'False';

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle size="l">
          <h1>Report definition</h1>
        </EuiTitle>
        <EuiSpacer size="m" />
        <EuiPageContent panelPaddingSize={'l'}>
          <EuiPageHeader>
            <EuiFlexItem>
              <EuiPageHeaderSection>
                <EuiTitle>
                  <h2>{reportDefinitionDetailsMockMetadata.name}</h2>
                </EuiTitle>
              </EuiPageHeaderSection>
            </EuiFlexItem>
            <EuiFlexGroup
              justifyContent="flexEnd"
              alignItems="flexEnd"
              gutterSize="xs"
            >
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem>
                <EuiText size="xs">
                  <h2>
                    <a href="#">Disable</a>
                  </h2>
                  <div></div>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText size="xs">
                  <h2>
                    <a href="#">Enable</a>
                  </h2>
                  <div></div>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton 
                  fill={true}
                  onClick={() => {
                    window.location.assign('opendistro_kibana_reports#/edit');
                  }}
                >
                  Edit
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageHeader>
          <EuiHorizontalRule />
          <EuiTitle>
            <h3>Report settings</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Name'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.name
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Description'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.description
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Created'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.created
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Last updated'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.last_updated
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.source
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Time period'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.time_period
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'File format'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.file_format
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report header'}
              ReportDefinitionDetails={
                reportDefinitionDetailsMockMetadata.report_header
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report footer'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.report_footer
              }
            />
            <ReportDetailsComponent />
            <ReportDetailsComponent />
            <ReportDetailsComponent />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiTitle>
            <h3>Report trigger</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Trigger type'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.trigger_type
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule details'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.schedule_details
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Alert details'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.alert_details
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Status'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.status
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiTitle>
            <h3>Delivery settings</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Delivery channels'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.delivery_channels
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Kibana recipients'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.kibana_recipients
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipients'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.email_recipients
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email subject'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.email_subject
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email body'}
              reportDetailsComponentContent={
                reportDefinitionDetailsMockMetadata.email_body
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Include report as attachment'}
              reportDetailsComponentContent={includeReportAsAttachmentString}
            />
            <ReportDetailsComponent />
            <ReportDetailsComponent />
          </EuiFlexGroup>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
