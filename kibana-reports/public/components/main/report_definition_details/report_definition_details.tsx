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

  const getReportDefinitionDetailsMetadata = (data) => {
    const reportDefinition: ReportDefinitionSchemaType = data.report_definition;
    const { report_params: reportParams, trigger, delivery, time_created: timeCreated, last_updated: lastUpdated } = reportDefinition
    const { trigger_type: triggerType, trigger_params: triggerParams } = trigger;
    const { delivery_type: deliveryType, delivery_params: deliveryParams } = delivery;
    const { core_params: { base_url: baseUrl, report_format: reportFormat, time_duration: timeDuration} } = reportParams;

    let readableDate = new Date(timeCreated);
    let displayCreatedDate =
      readableDate.toDateString() + ' ' + readableDate.toLocaleTimeString();

    let readableUpdatedDate = new Date(lastUpdated);
    let displayUpdatedDate =
      readableUpdatedDate.toDateString() +
      ' ' +
      readableUpdatedDate.toLocaleTimeString();

    let reportDefinitionDetails = {
      name: reportParams.report_name,
      description: reportParams.description,
      created: displayCreatedDate,
      lastUpdated: displayUpdatedDate,
      source: reportParams.report_source,
      baseUrl: baseUrl,
      // TODO: need better display
      timePeriod: moment.duration(timeDuration).humanize(),
      fileFormat: reportFormat,
      // TODO: to be added to schema, currently hardcoded in backend
      reportHeader: `\u2014`,
      reportFooter: `\u2014`,
      triggerType: triggerType,
      scheduleDetails: triggerParams ? triggerParams.schedule_type : `\u2014`,
      alertDetails: `\u2014`,
      channel: deliveryType,
      status: reportDefinition.status,
      kibanaRecipients: deliveryParams.kibana_recipients ? deliveryParams.kibana_recipients : `\u2014`,
      emailRecipients: deliveryType === 'Channel' ? deliveryParams.recipients : `\u2014`,
      emailSubject: deliveryType === 'Channel' ? deliveryParams.title : `\u2014`,
      emailBody: deliveryType === 'Channel' ? deliveryParams.htmlDescription : `\u2014`,
      reportAsAttachment: (deliveryType === 'Channel' && deliveryParams.email_format === 'Attachment')? 'True' : 'False',
    };
    return reportDefinitionDetails;
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then((response) => {
        handleReportDefinitionDetails(
          getReportDefinitionDetailsMetadata(response)
        );
        props.setBreadcrumbs([
          {
            text: 'Reporting',
            href: '#',
          },
          {
            text: `Report definition details: ${response.report_definition.report_params.report_name}`,
          },
        ]);
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
        {formatUpper + ' '}
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

  const deleteReportDefinition = () => {
    const { httpClient } = props;
    httpClient
      .delete(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then((response) => {
        window.location.assign(`opendistro_kibana_reports#/`);
      })
      .catch((error) => {
        console.log('error when deleting report definition:', error);
      });
  };

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
                <EuiButton color={'danger'} onClick={deleteReportDefinition}>
                  Delete
                </EuiButton>
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
              reportDetailsComponentTitle={'Channel'}
              reportDetailsComponentContent={
                reportDefinitionDetails.channel
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
              reportDetailsComponentContent={reportDefinitionDetails.reportAsAttachment}
            />
            <ReportDetailsComponent />
            <ReportDetailsComponent />
          </EuiFlexGroup>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
