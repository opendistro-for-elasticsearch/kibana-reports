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

import React, { useEffect, useState } from 'react';
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

export function ReportDefinitionDetails(props) {
  const [reportDefinitionDetails, setReportDefinitionDetails] = useState({});
  const reportDefinitionId = props.match['params']['reportDefinitionId'];

  const handleReportDefinitionDetails = (e) => {
    setReportDefinitionDetails(e);
  };

  const getReportDefinitionDetailsMetadata = (data) => {
    let reportDefinitionDetails = {
      name: data['report_name'],
      description: data['description'],
      created: data['time_created'],
      last_updated: data['last_updated'],
      source: data['report_source'],
      time_period:
        data['trigger']['trigger_params']['schedule']['interval']['period'] +
        data['trigger']['trigger_params']['schedule']['interval']['days'],
      file_format: data['report_params']['report_format'],
      report_header: '--',
      report_footer: '--',
      trigger_type: data['trigger']['trigger_type'],
      schedule_details: '--',
      alert_details: '--',
      status: data['status'],
      delivery_channels: data['delivery']['channel'],
      kibana_recipients: data['delivery']['delivery_params']['recipients'],
      email_recipients: '--', // todo: data model needs separate field for email vs kibana recipients
      email_subject: data['delivery']['delivery_params']['subject'],
      email_body: data['delivery']['delivery_params']['body'],
      include_report_as_attachment:
        data['delivery']['delivery_params']['has_attachment'],
    };
    return reportDefinitionDetails;
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get('../api/reporting/reportDefinitions/' + reportDefinitionId)
      .then((response) => {
        handleReportDefinitionDetails(
          getReportDefinitionDetailsMetadata(response)
        );
      })
      .catch((error) => {});
  }, []);

  const includeReportAsAttachmentString = reportDefinitionDetails[
    'include_report_as_attachment'
  ]
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
                  <h2>{reportDefinitionDetails['name']}</h2>
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
              reportDetailsComponentContent={reportDefinitionDetails['name']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Description'}
              reportDetailsComponentContent={
                reportDefinitionDetails['description']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Created'}
              reportDetailsComponentContent={reportDefinitionDetails['created']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Last updated'}
              reportDetailsComponentContent={
                reportDefinitionDetails['last_updated']
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source'}
              reportDetailsComponentContent={reportDefinitionDetails['source']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Time period'}
              reportDetailsComponentContent={
                reportDefinitionDetails['time_period']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'File format'}
              reportDetailsComponentContent={
                reportDefinitionDetails['file_format']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report header'}
              ReportDefinitionDetails={reportDefinitionDetails['report_header']}
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report footer'}
              reportDetailsComponentContent={
                reportDefinitionDetails['report_footer']
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
                reportDefinitionDetails['trigger_type']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule details'}
              reportDetailsComponentContent={
                reportDefinitionDetails['schedule_details']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Alert details'}
              reportDetailsComponentContent={
                reportDefinitionDetails['alert_details']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Status'}
              reportDetailsComponentContent={reportDefinitionDetails['status']}
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
                reportDefinitionDetails['delivery_channels']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Kibana recipients'}
              reportDetailsComponentContent={
                reportDefinitionDetails['kibana_recipients']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipients'}
              reportDetailsComponentContent={
                reportDefinitionDetails['email_recipients']
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email subject'}
              reportDetailsComponentContent={
                reportDefinitionDetails['email_subject']
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email body'}
              reportDetailsComponentContent={
                reportDefinitionDetails['email_body']
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
