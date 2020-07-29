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
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiPageHeaderSection,
  EuiButton,
  EuiText,
} from '@elastic/eui';
import { ShareModal } from './share_modal/share_modal';

interface ReportDetailsRouteProps {
  reportId: string;
  httpClient: any;
  reportDetailsMetadata: {
    report_name: string;
    description: string;
    created: string;
    last_updated: string;
    source_type: string;
    source: string;
    default_file_format: string;
    report_header: string;
    report_footer: string;
    report_type: string;
    schedule_type: string;
    schedule_details: string;
    alert_details: string;
    channel: string;
    kibana_recipients: string;
    email_recipients: string;
    email_subject: string;
    email_body: string;
    report_as_attachment: boolean;
  };
}

export const ReportDetailsComponent = (props) => {
  const { reportDetailsComponentTitle, reportDetailsComponentContent } = props;

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
};

export function ReportDetails(props) {
  const [reportDetails, setReportDetails] = useState({});
  const reportId = props.match["params"]["reportId"];
  // todo: replace values with values from props.reportDetailsMetadata

  const handleReportDetails = (e) => {
    setReportDetails(e);
  }

  const getReportDetailsData = (data) => {
    let reportDetails = {
      report_name: data["report_name"],
      description: data["description"],
      created: data["time_created"],
      last_updated: "--",
      source_type: data["report_type"],
      source: data["source_type"],
      default_file_format: data["report_params"]["report_format"],
      report_header: '--',
      report_footer: '--',
      report_type: data["report_type"],
      schedule_type: '--',
      schedule_details: '--',
      alert_details: '--',
      channel: '--',
      kibana_recipients: '--',
      email_recipients: '--',
      email_subject: '--',
      email_body: '--',
      report_as_attachment: false
    }
    return reportDetails;
  }

  useEffect(() => {
    const { httpClient } = props;
    httpClient.get('../api/reporting/reports/' + reportId)
      .then((response) => {
        handleReportDetails(getReportDetailsData(response));
      })
      .catch((error) => {
        console.log("Error when fetching report details: ", error);
      })
  }, []);

  const includeReportAsAttachmentString = reportDetails["report_as_attachment"]
    ? 'True'
    : 'False';
  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle size="l">
          <h1>Report details</h1>
        </EuiTitle>
        <EuiSpacer size="m" />
        <EuiPageContent panelPaddingSize={'l'}>
          <EuiPageHeader>
            <EuiFlexItem>
              <EuiPageHeaderSection>
                <EuiTitle>
                  <h2>{reportDetails["report_name"]}</h2>
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
                    <a href="#">Archive</a>
                  </h2>
                  <div></div>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem>
                <ShareModal />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton fill={true}>Download</EuiButton>
              </EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageHeader>
          <EuiHorizontalRule />
          <EuiTitle>
            <h3>Report Settings</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Name'}
              reportDetailsComponentContent={reportDetails["report_name"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Description'}
              reportDetailsComponentContent={reportDetails["description"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Created'}
              reportDetailsComponentContent={reportDetails["created"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Last updated'}
              reportDetailsComponentContent={reportDetails["last_updated"]}
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source type'}
              reportDetailsComponentContent={reportDetails["source_type"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source'}
              reportDetailsComponentContent={reportDetails["source"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Default file format'}
              reportDetailsComponentContent={
                reportDetails["default_file_format"]
              }
            />
            <ReportDetailsComponent />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report header'}
              reportDetailsComponentContent={
                reportDetails["report_header"]
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report footer'}
              reportDetailsComponentContent={
                reportDetails["report_footer"]
              }
            />
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
              reportDetailsComponentTitle={'Report type'}
              reportDetailsComponentContent={reportDetails["report_type"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule type'}
              reportDetailsComponentContent={
                reportDetails["schedule_type"]
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule details'}
              reportDetailsComponentContent={
                reportDetails["schedule_details"]
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Alert details'}
              reportDetailsComponentContent={
                reportDetails["alert_details"]
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
              reportDetailsComponentTitle={'Channel'}
              reportDetailsComponentContent={reportDetails["channel"]}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Kibana recipients'}
              reportDetailsComponentContent={
                reportDetails["kibana_recipients"]
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipients'}
              reportDetailsComponentContent={
                reportDetails["email_recipients"]
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email subject'}
              reportDetailsComponentContent={
                reportDetails["email_subject"]
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email body'}
              reportDetailsComponentContent={reportDetails["email_body"]}
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
