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
  EuiIcon,
  EuiLink,
} from '@elastic/eui';
import { ReportDetailsComponent } from '../report_details/report_details';
import { fileFormatsUpper } from '../main_utils';

export function ReportDefinitionDetails(props) {
  const [reportDefinitionDetails, setReportDefinitionDetails] = useState({});
  const reportDefinitionId = props.match['params']['reportDefinitionId'];

  const handleReportDefinitionDetails = (e) => {
    setReportDefinitionDetails(e);
  };

  const readableTimeRange = (data) => {
    let timeRangeString = '';
    if (
      data['trigger']['trigger_params']['schedule']['interval']['unit'] ===
      'DAYS'
    ) {
      timeRangeString +=
        'Every ' +
        data['trigger']['trigger_params']['schedule']['interval']['period'] +
        ' days';
    }
    return timeRangeString;
  };

  const getReportDefinitionDetailsMetadata = (data) => {
    let readableDate = new Date(data['time_created']);
    let displayCreatedDate =
      readableDate.toDateString() + ' ' + readableDate.toLocaleTimeString();

    let readableUpdatedDate = new Date(data['last_updated']);
    let displayUpdatedDate =
      readableUpdatedDate.toDateString() +
      ' ' +
      readableUpdatedDate.toLocaleTimeString();

    let timeRangeDisplay = `\u2014`;
    if (data['trigger']['trigger_type'] === 'Schedule') {
      readableTimeRange(data);
    }

    let reportDefinitionDetails = {
      name: data['report_name'],
      description: data['description'],
      created: displayCreatedDate,
      lastUpdated: displayUpdatedDate,
      source: data['report_source'],
      timePeriod: timeRangeDisplay,
      fileFormat: data['report_params']['report_format'],
      reportHeader: `\u2014`,
      reportFooter: `\u2014`,
      triggerType: data['trigger']['trigger_type'],
      scheduleDetails: data['trigger']['trigger_params']['schedule_type'],
      alertDetails: `\u2014`,
      status: data['status'],
      deliveryChannels: data['delivery']['channel'],
      kibanaRecipients: data['delivery']['delivery_params']['recipients'],
      emailRecipients: `\u2014`, // todo: data model needs separate field for email vs kibana recipients
      emailSubject: data['delivery']['delivery_params']['subject'],
      emailBody: data['delivery']['delivery_params']['body'],
      includeReportAsAttachment:
        data['delivery']['delivery_params']['has_attachment'],
    };
    return reportDefinitionDetails;
  };

  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Reporting',
        href: '#',
      },
      {
        text: 'Report definition details',
        href: `#/report_definition_details/${props.match['params']['reportDefinitionId']}`,
      },
      {
        text: `${props.match['params']['reportDefinitionId']}`,
      },
    ]);
    const { httpClient } = props;
    httpClient
      .get(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then((response) => {
        console.log("response in def details is", response);
        handleReportDefinitionDetails(
          getReportDefinitionDetailsMetadata(response)
        );
      })
      .catch((error) => {
        console.error('error when getting report definition details:', error);
      });
  }, []);

  const fileFormatDownload = (data) => {
    let formatUpper = data['fileFormat'];
    formatUpper = fileFormatsUpper[formatUpper];
    return (
      <EuiLink>
        {formatUpper}
        <EuiIcon type="importAction" />
      </EuiLink>
    );
  };

  const sourceURL = (data) => {
    return <EuiLink>{data['source']}</EuiLink>;
  };

  const scheduleOrOnDemandDefinition = (data) => {
    if (data.scheduleDetails === 'Now') {
      return <EuiButton>Generate report</EuiButton>;
    } else if (
      data.triggerType === 'Schedule' ||
      data.triggerType === 'Trigger'
    ) {
      if (data.status === 'Active') {
        return <EuiButton>Disable</EuiButton>;
      } else {
        return <EuiButton>Enable</EuiButton>;
      }
    }
  };

  const includeReportAsAttachmentString = reportDefinitionDetails.includeReportAsAttachment
    ? 'True'
    : 'False';

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle size="l">
          <h1>Report definition details</h1>
        </EuiTitle>
        <EuiSpacer size="m" />
        <EuiPageContent panelPaddingSize={'l'}>
          <EuiPageHeader>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiPageHeaderSection>
                  <EuiTitle>
                    <h2>{reportDefinitionDetails.name}</h2>
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
                <EuiButton color={'danger'}>Delete</EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                {scheduleOrOnDemandDefinition(reportDefinitionDetails)}
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
              reportDetailsComponentContent={reportDefinitionDetails.name}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Description'}
              reportDetailsComponentContent={
                reportDefinitionDetails.description
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Created'}
              reportDetailsComponentContent={reportDefinitionDetails.created}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Last updated'}
              reportDetailsComponentContent={
                reportDefinitionDetails.lastUpdated
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Source'}
              reportDetailsComponentContent={sourceURL(reportDefinitionDetails)}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Time period'}
              reportDetailsComponentContent={reportDefinitionDetails.timePeriod}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'File format'}
              reportDetailsComponentContent={fileFormatDownload(
                reportDefinitionDetails
              )}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report header'}
              reportDetailsComponentContent={
                reportDefinitionDetails.reportHeader
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report footer'}
              reportDetailsComponentContent={
                reportDefinitionDetails.reportFooter
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
                reportDefinitionDetails.triggerType
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Schedule details'}
              reportDetailsComponentContent={
                reportDefinitionDetails.scheduleDetails
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Alert details'}
              reportDetailsComponentContent={
                reportDefinitionDetails.alertDetails
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Status'}
              reportDetailsComponentContent={reportDefinitionDetails.status}
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
                reportDefinitionDetails.deliveryChannels
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Kibana recipients'}
              reportDetailsComponentContent={
                reportDefinitionDetails.kibanaRecipients
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipients'}
              reportDetailsComponentContent={
                reportDefinitionDetails.emailRecipients
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email subject'}
              reportDetailsComponentContent={
                reportDefinitionDetails.emailSubject
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email body'}
              reportDetailsComponentContent={reportDefinitionDetails.emailBody}
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
