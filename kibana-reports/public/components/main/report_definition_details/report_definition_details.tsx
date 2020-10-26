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
  EuiGlobalToastList,
} from '@elastic/eui';
import {
  ReportDetailsComponent,
  formatEmails,
  trimAndRenderAsText,
} from '../report_details/report_details';
import { fileFormatsUpper, generateReport } from '../main_utils';
import { ReportDefinitionSchemaType } from '../../../../server/model';
import moment from 'moment';
import { converter } from '../../report_definitions/utils';

const ON_DEMAND = 'On demand';

export function ReportDefinitionDetails(props) {
  const [reportDefinitionDetails, setReportDefinitionDetails] = useState({});
  const [
    reportDefinitionRawResponse,
    setReportDefinitionRawResponse,
  ] = useState({});
  const [toasts, setToasts] = useState([]);
  const reportDefinitionId = props.match['params']['reportDefinitionId'];

  const addErrorLoadingDetailsToastHandler = () => {
    const errorToast = {
      title: 'Error loading report definition details',
      color: 'danger',
      iconType: 'alert',
      id: 'reportDefinitionDetailsErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleDetailsErrorToast = () => {
    addErrorLoadingDetailsToastHandler();
  };

  const addSuccessGeneratingReportToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: <p>Report successfully downloaded!</p>,
      id: 'generateReportSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessGeneratingReportToast = () => {
    addSuccessGeneratingReportToastHandler();
  };

  const addErrorGeneratingReportToastHandler = () => {
    const errorToast = {
      title: 'Error generating report',
      color: 'danger',
      iconType: 'alert',
      id: 'generateReportErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorGeneratingReportToast = () => {
    addErrorGeneratingReportToastHandler();
  };

  const addSuccessEnablingScheduleToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: <p>Schedule successfully enabled!</p>,
      id: 'successEnableToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessEnablingScheduleToast = () => {
    addSuccessEnablingScheduleToastHandler();
  };

  const addErrorEnablingScheduleToastHandler = () => {
    const errorToast = {
      title: 'Error enabling schedule',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorEnablingScheduleToast = () => {
    addErrorEnablingScheduleToastHandler();
  };

  const addSuccessDisablingScheduleToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: <p>Schedule successfully disabled!</p>,
      id: 'successDisableToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessDisablingScheduleToast = () => {
    addSuccessDisablingScheduleToastHandler();
  };

  const addErrorDisablingScheduleToastHandler = () => {
    const errorToast = {
      title: 'Error disabling schedule',
      color: 'danger',
      iconType: 'alert',
      id: 'errorDisableToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorDisablingScheduleToast = () => {
    addErrorDisablingScheduleToastHandler();
  };

  const addErrorDeletingReportDefinitionToastHandler = () => {
    const errorToast = {
      title: 'Error deleting report definition',
      color: 'danger',
      iconType: 'alert',
      id: 'errorDeleteToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorDeletingReportDefinitionToast = () => {
    addErrorDeletingReportDefinitionToastHandler();
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const handleReportDefinitionDetails = (e) => {
    setReportDefinitionDetails(e);
  };

  const handleReportDefinitionRawResponse = (e) => {
    setReportDefinitionRawResponse(e);
  };

  const humanReadableScheduleDetails = (trigger) => {
    let scheduleDetails = '';
    if (trigger.trigger_type === 'Schedule') {
      if (trigger.trigger_params.schedule_type === 'Recurring') {
        // Daily
        if (
          trigger.trigger_params.schedule.interval.unit === 'DAYS' &&
          trigger.trigger_params.schedule.interval.period === 1
        ) {
          const date = new Date(
            trigger.trigger_params.schedule.interval.start_time
          );
          scheduleDetails = 'Daily @ ' + date.toTimeString();
        }
        // By interval
        else {
          const date = new Date(
            trigger.trigger_params.schedule.interval.start_time
          );
          scheduleDetails =
            'By interval, every ' +
            trigger.trigger_params.schedule.interval.period +
            ' ' +
            trigger.trigger_params.schedule.interval.unit.toLowerCase() +
            ', starting @ ' +
            date.toTimeString();
        }
      }
      // Cron
      else if (trigger.trigger_params.schedule_type === 'Cron based') {
        scheduleDetails =
          'Cron based: ' +
          trigger.trigger_params.schedule.cron.expression +
          ' (' +
          trigger.trigger_params.schedule.cron.timezone +
          ')';
      }
    }
    return scheduleDetails;
  };

  const getReportDefinitionDetailsMetadata = (data) => {
    const reportDefinition: ReportDefinitionSchemaType = data.report_definition;
    const {
      report_params: reportParams,
      trigger,
      delivery,
      time_created: timeCreated,
      last_updated: lastUpdated,
    } = reportDefinition;
    const {
      trigger_type: triggerType,
      trigger_params: triggerParams,
    } = trigger;
    const {
      delivery_type: deliveryType,
      delivery_params: deliveryParams,
    } = delivery;
    const {
      core_params: {
        base_url: baseUrl,
        report_format: reportFormat,
        time_duration: timeDuration,
      },
    } = reportParams;

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
      description:
        reportParams.description === '' ? `\u2014` : reportParams.description,
      created: displayCreatedDate,
      lastUpdated: displayUpdatedDate,
      source: reportParams.report_source,
      baseUrl: baseUrl,
      // TODO: need better display
      timePeriod: moment.duration(timeDuration).humanize(),
      fileFormat: reportFormat,
      reportHeader: reportParams.core_params.hasOwnProperty('header')
        ? converter.makeMarkdown(reportParams.core_params.header)
        : `\u2014`,
      reportFooter: reportParams.core_params.hasOwnProperty('footer')
        ? converter.makeMarkdown(reportParams.core_params.footer)
        : `\u2014`,
      triggerType: triggerType,
      scheduleDetails: triggerParams
        ? humanReadableScheduleDetails(data.report_definition.trigger)
        : `\u2014`,
      channel: deliveryType,
      status: reportDefinition.status,
      kibanaRecipients: deliveryParams.kibana_recipients
        ? deliveryParams.kibana_recipients
        : `\u2014`,
      emailRecipients:
        deliveryType === 'Channel' ? deliveryParams.recipients : `\u2014`,
      emailSubject:
        deliveryType === 'Channel' ? deliveryParams.title : `\u2014`,
      emailBody:
        deliveryType === 'Channel' ? deliveryParams.textDescription : `\u2014`,
    };
    return reportDefinitionDetails;
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then((response) => {
        handleReportDefinitionRawResponse(response);
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
        handleDetailsErrorToast();
      });
  }, []);

  const fileFormatDownload = (data) => {
    let formatUpper = data['fileFormat'];
    formatUpper = fileFormatsUpper[formatUpper];
    return (
      <EuiLink onClick={generateReportFromDetails}>
        {formatUpper + ' '}
        <EuiIcon type="importAction" />
      </EuiLink>
    );
  };

  const sourceURL = (data) => {
    return (
      <EuiLink href={`${location.host}${data.baseUrl}`} target="_blank">
        {data['source']}
      </EuiLink>
    );
  };

  const getRelativeStartDate = (duration) => {
    duration = moment.duration(duration);
    let time_difference = moment.now() - duration;
    return new Date(time_difference);
  };

  const changeScheduledReportDefinitionStatus = (statusChange) => {
    let updatedReportDefinition = reportDefinitionRawResponse.report_definition;
    if (statusChange === 'Disable') {
      updatedReportDefinition.trigger.trigger_params.enabled = false;
      updatedReportDefinition.status = 'Disabled';
    } else if (statusChange === 'Enable') {
      updatedReportDefinition.trigger.trigger_params.enabled = true;
      updatedReportDefinition.status = 'Active';
    }

    const { httpClient } = props;
    httpClient
      .put(`../api/reporting/reportDefinitions/${reportDefinitionId}`, {
        body: JSON.stringify(updatedReportDefinition),
        params: reportDefinitionId.toString(),
      })
      .then(() => {
        const updatedRawResponse = { report_definition: {} };
        updatedRawResponse.report_definition = updatedReportDefinition;
        handleReportDefinitionRawResponse(updatedRawResponse);
        setReportDefinitionDetails(
          getReportDefinitionDetailsMetadata(updatedRawResponse)
        );
        if (statusChange === 'Enable') {
          handleSuccessEnablingScheduleToast();
        } else if (statusChange === 'Disable') {
          handleSuccessDisablingScheduleToast();
        }
      })
      .catch((error) => {
        console.error('error in updating report definition status:', error);
        if (statusChange === 'Enable') {
          handleErrorEnablingScheduleToast();
        } else if (statusChange === 'Disable') {
          handleErrorDisablingScheduleToast();
        }
      });
  };

  const ScheduledDefinitionStatus = () => {
    const status =
      reportDefinitionDetails.status === 'Active' ? 'Disable' : 'Enable';

    return (
      <EuiButton onClick={() => changeScheduledReportDefinitionStatus(status)}>
        {status}
      </EuiButton>
    );
  };

  const generateReportFromDetails = async () => {
    let duration =
      reportDefinitionRawResponse.report_definition.report_params.core_params
        .time_duration;
    const fromDate = getRelativeStartDate(duration);
    let onDemandDownloadMetadata = {
      query_url: `${
        reportDefinitionDetails.baseUrl
      }?_g=(time:(from:'${fromDate.toISOString()}',to:'${moment().toISOString()}'))`,
      time_from: fromDate.valueOf(),
      time_to: moment().valueOf(),
      report_definition: reportDefinitionRawResponse.report_definition,
    };
    const { httpClient } = props;
    let generateReportSuccess = await generateReport(
      onDemandDownloadMetadata,
      httpClient
    );
    if (generateReportSuccess) {
      handleSuccessGeneratingReportToast();
    } else {
      handleErrorGeneratingReportToast();
    }
  };

  const deleteReportDefinition = () => {
    const { httpClient } = props;
    httpClient
      .delete(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then(() => {
        window.location.assign(`opendistro_kibana_reports#/`);
      })
      .catch((error) => {
        console.log('error when deleting report definition:', error);
        handleErrorDeletingReportDefinitionToast();
      });
  };

  const showActionButton =
    reportDefinitionDetails.triggerType === ON_DEMAND ? (
      <EuiButton onClick={() => generateReportFromDetails()}>
        Generate report
      </EuiButton>
    ) : (
      <ScheduledDefinitionStatus />
    );

  const triggerSection =
    reportDefinitionDetails.triggerType === ON_DEMAND ? (
      <ReportDetailsComponent
        reportDetailsComponentTitle={'Trigger type'}
        reportDetailsComponentContent={reportDefinitionDetails.triggerType}
      />
    ) : (
      <EuiFlexGroup>
        <ReportDetailsComponent
          reportDetailsComponentTitle={'Trigger type'}
          reportDetailsComponentContent={reportDefinitionDetails.triggerType}
        />
        <ReportDetailsComponent
          reportDetailsComponentTitle={'Schedule details'}
          reportDetailsComponentContent={
            reportDefinitionDetails.scheduleDetails
          }
        />
        <ReportDetailsComponent
          reportDetailsComponentTitle={'Status'}
          reportDetailsComponentContent={reportDefinitionDetails.status}
        />
        <ReportDetailsComponent />
      </EuiFlexGroup>
    );

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
              <EuiFlexItem grow={false}>{showActionButton}</EuiFlexItem>
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
            <EuiFlexItem />
          </EuiFlexGroup>
          {/* <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report header'}
              reportDetailsComponentContent={trimAndRenderAsText(
                reportDefinitionDetails.reportHeader
              )}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Report footer'}
              reportDetailsComponentContent={trimAndRenderAsText(
                reportDefinitionDetails.reportFooter
              )}
            />
            <EuiFlexItem />
            <EuiFlexItem />
          </EuiFlexGroup> */}
          <EuiSpacer />
          <EuiTitle>
            <h3>Report trigger</h3>
          </EuiTitle>
          <EuiSpacer />
          {triggerSection}
          <EuiSpacer />
          {/* <EuiTitle>
            <h3>Notification settings</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email recipients'}
              reportDetailsComponentContent={formatEmails(
                reportDefinitionDetails.emailRecipients
              )}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Email subject'}
              reportDetailsComponentContent={
                reportDefinitionDetails.emailSubject
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={'Optional message'}
              reportDetailsComponentContent={trimAndRenderAsText(
                reportDefinitionDetails.emailBody
              )}
            />
            <ReportDetailsComponent />
          </EuiFlexGroup> */}
        </EuiPageContent>
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </EuiPageBody>
    </EuiPage>
  );
}
