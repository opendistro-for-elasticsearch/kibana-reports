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
  EuiIcon,
  EuiLink,
} from '@elastic/eui';
import { ReportDetailsComponent } from '../report_details/report_details';
import { fileFormatsUpper } from '../main_utils';
import { ReportDefinitionSchemaType } from '../../../../server/model';
import moment from 'moment';

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
    const reportDefinition: ReportDefinitionSchemaType = data.report_definition;
    const reportParams = reportDefinition.report_params;
    const trigger = reportDefinition.trigger;
    const triggerParams = trigger.trigger_params;
    const coreParams = reportParams.core_params;

    let readableDate = new Date(reportDefinition.time_created);
    let displayCreatedDate =
      readableDate.toDateString() + ' ' + readableDate.toLocaleTimeString();

    let readableUpdatedDate = new Date(reportDefinition.last_updated);
    let displayUpdatedDate =
      readableUpdatedDate.toDateString() +
      ' ' +
      readableUpdatedDate.toLocaleTimeString();

    let timeRangeDisplay = `\u2014`;
    if (trigger.trigger_type === 'Schedule') {
      readableTimeRange(data);
    }

    let reportDefinitionDetails = {
      name: reportParams.report_name,
      description: reportParams.description,
      created: displayCreatedDate,
      lastUpdated: displayUpdatedDate,
      source: reportParams.report_source,
      baseUrl: coreParams.base_url,
      // TODO: need better display
      timePeriod: moment.duration(coreParams.time_duration).humanize(),
      fileFormat: coreParams.report_format,
      // TODO: to be added to schema, currently hardcoded in backend
      reportHeader: `\u2014`,
      reportFooter: `\u2014`,
      triggerType: trigger.trigger_type,
      scheduleDetails: triggerParams ? triggerParams.schedule_type : `\u2014`,
      alertDetails: `\u2014`,
      status: reportDefinition.status,
      deliveryChannels: `\u2014`,
      kibanaRecipients: `\u2014`,
      emailRecipients: `\u2014`, // todo: data model needs separate field for email vs kibana recipients
      emailSubject: `\u2014`,
      emailBody: `\u2014`,
      includeReportAsAttachment: `\u2014`,
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
    return (
      <EuiLink href={data.baseUrl} target="_blank">
        {data['source']}
      </EuiLink>
    );
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
                    window.location.assign(
                      `opendistro_kibana_reports#/edit/${reportDefinitionId}`
                    );
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
              reportDetailsComponentContent={`Last ${reportDefinitionDetails.timePeriod}`}
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
