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
    EuiDescriptionList,
    EuiDescriptionListTitle,
    EuiDescriptionListDescription,
    EuiPageHeaderSection,
    EuiButton,
    EuiText,
    EuiOverlayMask,
    EuiModal,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiModalBody,
    EuiModalFooter,
    EuiButtonEmpty,
    EuiSwitch,
  } from '@elastic/eui';
import { ShareModal } from './share_modal/share_modal'

  interface ReportDetailsRouteProps {
    reportId: string,
    reportDetailsMetadata: {
      report_name: string,
      description: string,
      created: string,
      last_updated: string,
      source_type: string,
      source: string,
      default_file_format: string,
      report_header: string,
      report_footer: string,
      report_type: string,
      schedule_type: string,
      schedule_details: string,
      alert_details: string,
      channel: string,
      kibana_recipients: string,
      email_recipients: string,
      email_subject: string,
      email_body: string,
      report_as_attachment: boolean
    }
  }

  const ReportDetailsComponent = (props) => {
    const {
      reportDetailsComponentTitle,
      reportDetailsComponentContent,
    } = props;

    return (
      <EuiFlexItem>
        <EuiDescriptionList>
          <EuiDescriptionListTitle>
            {reportDetailsComponentTitle}
          </EuiDescriptionListTitle>
          <EuiDescriptionListDescription>
            {reportDetailsComponentContent}
          </EuiDescriptionListDescription>
        </EuiDescriptionList>
      </EuiFlexItem>
    );
  }

  const created_date = new Date("April 20, 2020 20:32:12");

  const reportDetailsMockMetadata = {
    report_name: "Daily Sales Report-232o2jsf28492h3rjskfbwjk23",
    description: "Report Description Here",
    created: created_date.toString(),
    last_updated: created_date.toString(),
    source_type: "Download",
    source: "dashboard/daily_sales",
    default_file_format: "PDF",
    report_header: "--",
    report_footer: "--", 
    report_type: "Schedule",
    schedule_type: "Now",
    schedule_details: "--",
    alert_details: "--",
    channel: "Kibana Reports", 
    kibana_recipients: "admin",
    email_recipients: "--",
    email_subject: "--",
    email_body: "--",
    report_as_attachment: false
  }

  export function ReportDetails(props: ReportDetailsRouteProps) {
    const reportId = props.reportId;
    // todo: replace values with values from props.reportDetailsMetadata
    const reportDetailsMetadata = reportDetailsMockMetadata;

    const includeReportAsAttachmentString = reportDetailsMetadata.report_as_attachment ? "True" : "False"
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiTitle size='l'>
            <h1>Report details</h1>
          </EuiTitle>
          <EuiSpacer size="m"/>
          <EuiPageContent panelPaddingSize={"l"}>
            <EuiPageHeader>
              <EuiFlexItem>
                  <EuiPageHeaderSection>
                    <EuiTitle>
                      <h1>{reportDetailsMetadata.report_name}</h1>
                    </EuiTitle>
                  </EuiPageHeaderSection>
                </EuiFlexItem>
              <EuiFlexGroup justifyContent="flexEnd" alignItems="flexEnd" gutterSize="xs">
                <EuiFlexItem></EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
                <EuiFlexItem>
                  <EuiText size="xs">
                    <h2><a href="#">Archive</a></h2>
                    <div></div>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <ShareModal/>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton fill={true}>
                    Download
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageHeader>
            <EuiHorizontalRule/>
            <EuiTitle>
              <h2>Report Settings</h2>
            </EuiTitle>
            <EuiSpacer/>
            <EuiFlexGroup>
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Name"}
                reportDetailsComponentContent={reportDetailsMetadata.report_name}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Description"}
                reportDetailsComponentContent={reportDetailsMetadata.description}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Created"}
                reportDetailsComponentContent={reportDetailsMetadata.created}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Last updated"}
                reportDetailsComponentContent={reportDetailsMetadata.last_updated}
              />
            </EuiFlexGroup>
            <EuiFlexGroup>
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Source type"}
                reportDetailsComponentContent={reportDetailsMetadata.source_type}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Source"}
                reportDetailsComponentContent={reportDetailsMetadata.source}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Default file format"}
                reportDetailsComponentContent={reportDetailsMetadata.default_file_format}
              />
              <ReportDetailsComponent/>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Report header"}
                reportDetailsComponentContent={reportDetailsMetadata.report_header}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Report footer"}
                reportDetailsComponentContent={reportDetailsMetadata.report_footer}
              />
              <ReportDetailsComponent/>
              <ReportDetailsComponent/>
            </EuiFlexGroup>
            <EuiSpacer/>
            <EuiTitle>
              <h2>Report Trigger</h2> 
            </EuiTitle>
            <EuiSpacer/>
            <EuiFlexGroup>
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Report type"}
                reportDetailsComponentContent={reportDetailsMetadata.report_type}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Schedule type"}
                reportDetailsComponentContent={reportDetailsMetadata.schedule_type}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Schedule details"}
                reportDetailsComponentContent={reportDetailsMetadata.schedule_details}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Alert details"}
                reportDetailsComponentContent={reportDetailsMetadata.alert_details}
              />
            </EuiFlexGroup>
            <EuiSpacer/>
            <EuiTitle>
              <h2>Delivery Settings</h2>
            </EuiTitle>
            <EuiSpacer/>
            <EuiFlexGroup>
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Channel"}
                reportDetailsComponentContent={reportDetailsMetadata.channel}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Kibana recipients"}
                reportDetailsComponentContent={reportDetailsMetadata.kibana_recipients}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Email recipients"}
                reportDetailsComponentContent={reportDetailsMetadata.email_recipients}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Email subject"}
                reportDetailsComponentContent={reportDetailsMetadata.email_subject}
              />
            </EuiFlexGroup>
            <EuiFlexGroup>
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Email body"}
                reportDetailsComponentContent={reportDetailsMetadata.email_body}
              />
              <ReportDetailsComponent
                reportDetailsComponentTitle={"Include report as attachment"}
                reportDetailsComponentContent={includeReportAsAttachmentString}
              />
              <ReportDetailsComponent/>
              <ReportDetailsComponent/>
            </EuiFlexGroup>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    )
  }