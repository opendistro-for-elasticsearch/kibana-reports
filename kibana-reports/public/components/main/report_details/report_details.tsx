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
  const reportId = props.match['params']['reportId'];

  const handleReportDetails = (e) => {
    setReportDetails(e);
  };

  const getReportDetailsData = (data) => {
    let reportDetails = {
      reportName: data['report_name'],
      description: data['description'],
      created: data['time_created'],
      lastUpdated: '--',
      sourceType: data['report_type'],
      source: data['report_source'],
      defaultFileFormat: data['report_params']['report_format'],
      reportHeader: '--',
      reportFooter: '--',
      reportType: data['report_type'],
      scheduleType: '--',
      scheduleDetails: '--',
      alertDetails: '--',
      channel: '--',
      kibanaRecipients: '--',
      emailRecipients: '--',
      emailSubject: '--',
      emailBody: '--',
      reportAsAttachment: false,
    };
    return reportDetails;
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get('../api/reporting/reports/' + reportId)
      .then((response) => {
        handleReportDetails(getReportDetailsData(response));
      })
      .catch((error) => {
        console.log('Error when fetching report details: ', error);
      });
  }, []);

  const includeReportAsAttachmentString = reportDetails['reportAsAttachment']
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
                  <h2>{reportDetails['reportName']}</h2>
                </EuiTitle>
              </EuiPageHeaderSection>
            </EuiFlexItem>
            <EuiFlexGroup
              justifyContent="flexEnd"
              alignItems="flexEnd"
              gutterSize="xs"
            >
              <EuiFlexItem />
              <EuiFlexItem />
              <EuiFlexItem />
              <EuiFlexItem />
              <EuiFlexItem />
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
              reportDetailsComponentContent={reportDetails['reportName']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Description'}
              reportDetailsComponentContent={reportDetails['description']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Created'}
              reportDetailsComponentContent={reportDetails['created']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Last updated'}
              reportDetailsComponentContent={reportDetails['lastUpdated']}
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source type'}
              reportDetailsComponentContent={reportDetails['sourceType']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source'}
              reportDetailsComponentContent={reportDetails['source']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Default file format'}
              reportDetailsComponentContent={reportDetails['defaultFileFormat']}
            />
            <ReportDetailsComponent />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report header'}
              reportDetailsComponentContent={reportDetails['reportHeader']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report footer'}
              reportDetailsComponentContent={reportDetails['reportFooter']}
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
              reportDetailsComponentContent={reportDetails['reportType']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule type'}
              reportDetailsComponentContent={reportDetails['scheduleType']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule details'}
              reportDetailsComponentContent={reportDetails['scheduleDetails']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Alert details'}
              reportDetailsComponentContent={reportDetails['alertDetails']}
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
              reportDetailsComponentContent={reportDetails['channel']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Kibana recipients'}
              reportDetailsComponentContent={reportDetails['kibanaRecipients']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipients'}
              reportDetailsComponentContent={reportDetails['emailRecipients']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email subject'}
              reportDetailsComponentContent={reportDetails['emailSubject']}
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email body'}
              reportDetailsComponentContent={reportDetails['emailBody']}
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
