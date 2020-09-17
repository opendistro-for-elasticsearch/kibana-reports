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
  EuiLink,
  EuiIcon,
} from '@elastic/eui';
import { ShareModal } from './share_modal/share_modal';
import { fileFormatsUpper } from '../main_utils';
import { ReportSchemaType } from '../../../../server/model';

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

  const convertTimestamp = (timestamp: number) => {
    let displayDate = `\u2014`;
    if (timestamp) {
      let readableDate = new Date(timestamp);
      displayDate = readableDate.toLocaleString();
    }
    return displayDate;
  };

  const getReportDetailsData = (report: ReportSchemaType) => {
    const reportDefinition = report.report_definition;
    const reportParams = reportDefinition.report_params;
    const coreParams = reportParams.core_params;
    const trigger = reportDefinition.trigger;
    // covert timestamp to local date-time string

    let reportDetails = {
      reportName: reportParams.report_name,
      description: reportParams.description,
      created: convertTimestamp(report.time_created),
      lastUpdated: convertTimestamp(report.last_updated),
      source: reportParams.report_source,
      // TODO:  we have all data needed, time_from, time_to, time_duration,
      // think of a way to better display
      time_period: report.last_updated,
      defaultFileFormat: coreParams.report_format,
      state: report.state,
      reportHeader: `\u2014`,
      reportFooter: `\u2014`,
      triggerType: trigger.trigger_type,
      scheduleType: `\u2014`,
      scheduleDetails: `\u2014`,
      alertDetails: `\u2014`,
      channel: `\u2014`,
      kibanaRecipients: `\u2014`,
      emailRecipients: `\u2014`,
      emailSubject: `\u2014`,
      emailBody: `\u2014`,
      reportAsAttachment: `\u2014`,
      queryUrl: report.query_url,
    };
    return reportDetails;
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get('../api/reporting/reports/' + reportId)
      .then((response) => {
        handleReportDetails(getReportDetailsData(response));
        props.setBreadcrumbs([
          {
            text: 'Reporting',
            href: '#',
          },
          {
            text:
              'Report details: ' +
              response.report_definition.report_params.report_name,
          },
        ]);
      })
      .catch((error) => {
        console.log('Error when fetching report details: ', error);
      });
  }, []);

  const fileFormatDownload = (data) => {
    let formatUpper = data['defaultFileFormat'];
    formatUpper = fileFormatsUpper[formatUpper];
    return (
      <EuiLink>
        {formatUpper + ' '}
        <EuiIcon type="importAction" />
      </EuiLink>
    );
  };

  const sourceURL = (data) => {
    return (
      <EuiLink href={data.queryUrl} target="_blank">
        {data['source']}
      </EuiLink>
    );
  };

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle size="l">
          <h1>Report details</h1>
        </EuiTitle>
        <EuiSpacer size="m" />
        <EuiPageContent panelPaddingSize={'l'}>
          <EuiPageHeader>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiPageHeaderSection>
                  <EuiTitle>
                    <h2>{reportDetails['reportName']}</h2>
                  </EuiTitle>
                </EuiPageHeaderSection>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup
              justifyContent="flexEnd"
              alignItems="flexEnd"
              gutterSize="l"
            >
              <EuiFlexItem grow={false}>
                <ShareModal />
              </EuiFlexItem>
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
              reportDetailsComponentTitle={'Source'}
              reportDetailsComponentContent={sourceURL(reportDetails)}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'File format'}
              reportDetailsComponentContent={fileFormatDownload(reportDetails)}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'State'}
              reportDetailsComponentContent={reportDetails['state']}
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
              reportDetailsComponentTitle={'Trigger type'}
              reportDetailsComponentContent={reportDetails['triggerType']}
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
              reportDetailsComponentTitle={'Kibana recipient(s)'}
              reportDetailsComponentContent={reportDetails['kibanaRecipients']}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipient(s)'}
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
              reportDetailsComponentContent={
                reportDetails['reportAsAttachment']
              }
            />
            <ReportDetailsComponent />
            <ReportDetailsComponent />
          </EuiFlexGroup>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
