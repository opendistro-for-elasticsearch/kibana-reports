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
import { i18n } from '@kbn/i18n';
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
  EuiOverlayMask,
  EuiConfirmModal,
} from '@elastic/eui';
import {
  ReportDetailsComponent,
  formatEmails,
  trimAndRenderAsText,
} from '../report_details/report_details';
import { fileFormatsUpper, generateReportFromDefinitionId } from '../main_utils';
import { ReportDefinitionSchemaType } from '../../../../server/model';
import moment from 'moment';
import { converter } from '../../report_definitions/utils';
import {
  permissionsMissingToast,
  permissionsMissingActions,
} from '../../utils/utils';
import { GenerateReportLoadingModal } from '../loading_modal';

const ON_DEMAND = 'On demand';

export function ReportDefinitionDetails(props) {
  const [reportDefinitionDetails, setReportDefinitionDetails] = useState({});
  const [
    reportDefinitionRawResponse,
    setReportDefinitionRawResponse,
  ] = useState({});
  const [toasts, setToasts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const reportDefinitionId = props.match['params']['reportDefinitionId'];

  const handleLoading = (e) => {
    setShowLoading(e);
  }

  const handleShowDeleteModal = (e) => {
    setShowDeleteModal(e);
  };

  const addPermissionsMissingStatusChangeToastHandler = () => {
    const toast = permissionsMissingToast(
      permissionsMissingActions.CHANGE_SCHEDULE_STATUS
    );
    setToasts(toasts.concat(toast));
  };

  const addPermissionsMissingDeleteToastHandler = () => {
    const toast = permissionsMissingToast(
      permissionsMissingActions.DELETE_REPORT_DEFINITION
    );
    setToasts(toasts.concat(toast));
  };

  const handlePermissionsMissingDeleteToast = () => {
    addPermissionsMissingDeleteToastHandler();
  };

  const addPermissionsMissingGenerateReportToastHandler = () => {
    const toast = permissionsMissingToast(
      permissionsMissingActions.GENERATING_REPORT
    );
    setToasts(toasts.concat(toast));
  };

  const addErrorLoadingDetailsToastHandler = () => {
    const errorToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.errorLoadingReportDefinitionDetails. ', { defaultMessage: 'Error loading report definition details.' }),
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
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.successfullyGeneratedReport. ', { defaultMessage: 'Successfully generated report.' }),
      color: 'success',
      iconType: 'check',
      id: 'generateReportSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessGeneratingReportToast = () => {
    addSuccessGeneratingReportToastHandler();
  };

  const addErrorGeneratingReportToastHandler = () => {
    const errorToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.errorGeneratingReport. ', { defaultMessage: 'Error generating report.' }),
      color: 'danger',
      iconType: 'alert',
      id: 'generateReportErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorGeneratingReportToast = (errorType: string) => {
    if (errorType === 'permissions') {
      addPermissionsMissingGenerateReportToastHandler();
    } else if (errorType === 'API') {
      addErrorGeneratingReportToastHandler();
    }
  };

  const addSuccessEnablingScheduleToastHandler = () => {
    const successToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.successfullyEnabledSchedule. ', { defaultMessage: 'Successfully enabled schedule.' }),
      color: 'success',
      iconType: 'check',
      id: 'successEnableToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const addErrorEnablingScheduleToastHandler = () => {
    const errorToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.errorEnablingSchedule. ', { defaultMessage: 'Error enabling schedule.' }),
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const addSuccessDisablingScheduleToastHandler = () => {
    const successToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.successfullyDisabledSchedule.  ', { defaultMessage: 'Successfully disabled schedule.' }),
      color: 'success',
      iconType: 'check',
      id: 'successDisableToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessChangingScheduleStatusToast = (statusChange: string) => {
    if (statusChange === 'enable') {
      addSuccessEnablingScheduleToastHandler();
    } else if (statusChange === 'disable') {
      addSuccessDisablingScheduleToastHandler();
    }
  };

  const addErrorDisablingScheduleToastHandler = () => {
    const errorToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.errorDisablingSchedule.  ', { defaultMessage: 'Error disabling schedule.' }),
      color: 'danger',
      iconType: 'alert',
      id: 'errorDisableToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorChangingScheduleStatusToast = (statusChange: string) => {
    if (statusChange === 'enable') {
      addErrorEnablingScheduleToastHandler();
    } else if (statusChange === 'disable') {
      addErrorDisablingScheduleToastHandler();
    } else if (statusChange === 'permissions') {
      addPermissionsMissingStatusChangeToastHandler();
    }
  };

  const addErrorDeletingReportDefinitionToastHandler = () => {
    const errorToast = {
      title: i18n.translate('odfe.reports.reportDefinitionsDetails.toast.errorDeletingReport definition.  ', { defaultMessage: 'Error deleting report definition.' }),
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

  const DeleteConfirmationModal = () => {
    const closeModal = () => {
      setShowDeleteModal(false);
    };

    return (
      <div>
        <EuiOverlayMask>
          <EuiConfirmModal
            title={i18n.translate('odfe.reports.reportDefinitionsDetails.button.delete.title', { defaultMessage: 'Delete report definition' })}
            onCancel={closeModal}
            onConfirm={deleteReportDefinition}
            cancelButtonText={i18n.translate('odfe.reports.reportDefinitionsDetails.button.delete.cancel', { defaultMessage: 'Cancel' })}
            confirmButtonText={i18n.translate('odfe.reports.reportDefinitionsDetails.button.delete.confirm', {defaultMessage: 'Delete'})}
            buttonColor="danger"
            defaultFocusedButton="confirm"
          >
            <p>
              {i18n.translate('odfe.reports.reportDefinitionsDetails.button.delete.query', { defaultMessage: 'Are you sure you want to delete "{name}"?', values:{name:reportDefinitionDetails.name} })}
            </p>
          </EuiConfirmModal>
        </EuiOverlayMask>
      </div>
    );
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
          scheduleDetails = i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.dailyAt', { defaultMessage:'Daily @ {time}', values:{time:date.toTimeString()} });
        }
        // By interval
        else {
          const date = new Date(
            trigger.trigger_params.schedule.interval.start_time
          );
          scheduleDetails = i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.byInterval', {
            defaultMessage:'By interval, every  {period} {unit}, starting @ {time}', values: {
              period: trigger.trigger_params.schedule.interval.period,
              unit: trigger.trigger_params.schedule.interval.unit.toLowerCase(),
              time: date.toTimeString()
              }
          });
        }
      }
      // Cron
      else if (trigger.trigger_params.schedule_type === 'Cron based') {
        scheduleDetails = i18n.translate(
          'odfe.reports.reportDefinitionsDetails.schedule.cronBased', {
            defaultMessage:'Cron based: {expression} ({timezone})',
            values: {expression : trigger.trigger_params.schedule.cron.expression, timezone: trigger.trigger_params.schedule.cron.timezone}
          });
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
      reportHeader: reportParams.core_params.hasOwnProperty('header') && reportParams.core_params.header != ""
        ? converter.makeMarkdown(reportParams.core_params.header)
        : `\u2014`,
      reportFooter: reportParams.core_params.hasOwnProperty('footer') && reportParams.core_params.footer != ""
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
            text: i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.breadcrumb.reporting', { defaultMessage:'Reporting' }),
            href: '#',
          },
          {
            text: i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.breadcrumb.reportDefinitionDetails', {
              defaultMessage:'Report definition details: {name}',
              values:{name: response.report_definition.report_params.report_name}
            }),
          },
        ]);
      })
      .catch((error) => {
        console.error(i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.breadcrumb.error', { defaultMessage:'error when getting report definition details: {error}', values: {error:error}  }));
        handleDetailsErrorToast();
      });
  }, []);

  const downloadIconDownload = async () => {
    handleLoading(true);
    await generateReportFromDetails();
    handleLoading(false);
  }

  const fileFormatDownload = (data) => {
    let formatUpper = data['fileFormat'];
    formatUpper = fileFormatsUpper[formatUpper];
    return (
      <EuiLink onClick={downloadIconDownload} id='generateReportFromDetailsButton'>
        {formatUpper + ' '}
        <EuiIcon type="importAction" />
      </EuiLink>
    );
  };

  const sourceURL = (data) => {
    return (
      <EuiLink href={`${data.baseUrl}`} target="_blank">
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
          handleSuccessChangingScheduleStatusToast('enable');
        } else if (statusChange === 'Disable') {
          handleSuccessChangingScheduleStatusToast('disable');
        }
      })
      .catch((error) => {
        console.error('error in updating report definition status:', error);
        if (error.body.statusCode === 403) {
          handleErrorChangingScheduleStatusToast('permissions');
        } else {
          if (statusChange === 'Enable') {
            handleErrorChangingScheduleStatusToast('enable');
          } else if (statusChange === 'Disable') {
            handleErrorChangingScheduleStatusToast('disable');
          }
        }
      });
  };

  const ScheduledDefinitionStatus = () => {
    const status =
      reportDefinitionDetails.status === 'Active' ? 'Disable' : 'Enable';

    return (
      <EuiButton
        onClick={() => changeScheduledReportDefinitionStatus(status)}
        id={'changeStatusFromDetailsButton'}
      >
        {status}
      </EuiButton>
    );
  };

  const generateReportFromDetails = async () => {
    const { httpClient } = props;
    handleLoading(true);
    let generateReportSuccess = await generateReportFromDefinitionId(
      reportDefinitionId,
      httpClient
    );
    handleLoading(false);
    if (generateReportSuccess.status) {
      handleSuccessGeneratingReportToast();
    } else {
      if (generateReportSuccess.permissionsError) {
        handleErrorGeneratingReportToast('permissions');
      } else {
        handleErrorGeneratingReportToast('API');
      }
    }
  };

  const deleteReportDefinition = () => {
    const { httpClient } = props;
    httpClient
      .delete(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then(() => {
        window.location.assign(`opendistro_kibana_reports#/delete=success`);
      })
      .catch((error) => {
        console.log('error when deleting report definition:', error);
        if (error.body.statusCode === 403) {
          handlePermissionsMissingDeleteToast();
        } else {
          handleErrorDeletingReportDefinitionToast();
        }
      });
  };

  const showActionButton =
    reportDefinitionDetails.triggerType === ON_DEMAND ? (
      <EuiButton
        onClick={() => generateReportFromDetails()}
        id={'generateReportFromDetailsButton'}
      >
        Generate report
      </EuiButton>
    ) : (
      <ScheduledDefinitionStatus />
    );

  const triggerSection =
    reportDefinitionDetails.triggerType === ON_DEMAND ? (
      <ReportDetailsComponent
        reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.triggerSection.triggerType', { defaultMessage:'Trigger type' })}
        reportDetailsComponentContent={reportDefinitionDetails.triggerType}
      />
    ) : (
      <EuiFlexGroup>
        <ReportDetailsComponent
          reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.triggerSection.triggerType', { defaultMessage:'Trigger type' })}
          reportDetailsComponentContent={reportDefinitionDetails.triggerType}
        />
        <ReportDetailsComponent
          reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.triggerSection.scheduleDetails', { defaultMessage:'Schedule details' })}
          reportDetailsComponentContent={
            reportDefinitionDetails.scheduleDetails
          }
        />
        <ReportDetailsComponent
          reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.schedule.triggerSection.status', { defaultMessage:'Status' })}
          reportDetailsComponentContent={reportDefinitionDetails.status}
        />
        <ReportDetailsComponent />
      </EuiFlexGroup>
    );

  const showDeleteConfirmationModal = showDeleteModal ? (
    <DeleteConfirmationModal />
  ) : null;

  const showLoadingModal = showLoading ?
    <GenerateReportLoadingModal setShowLoading={setShowLoading} /> : null;

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle size="l">
          <h1>{i18n.translate('odfe.reports.reportDefinitionsDetails.title', { defaultMessage:'Report definition details' })}</h1>
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
                <EuiButton
                  color={'danger'}
                  onClick={handleShowDeleteModal}
                  id={'deleteReportDefinitionButton'}
                >
                  {i18n.translate('odfe.reports.reportDefinitionsDetails.deleteReportDefinitionButton', { defaultMessage:'Delete' })}
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
                  id={'editReportDefinitionButton'}
                >
                  {i18n.translate('odfe.reports.reportDefinitionsDetails.editReportDefinitionButton', { defaultMessage:'Edit' })}
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageHeader>
          <EuiHorizontalRule />
          <EuiTitle>
            <h3>{i18n.translate('odfe.reports.reportDefinitionsDetails.reportSettings', { defaultMessage:'Report settings' })}</h3>
          </EuiTitle>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.name', { defaultMessage:'Name' })}
              reportDetailsComponentContent={reportDefinitionDetails.name}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.description', { defaultMessage:'Description' })}
              reportDetailsComponentContent={
                reportDefinitionDetails.description
              }
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.created', { defaultMessage:'Created' })}
              reportDetailsComponentContent={reportDefinitionDetails.created}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.lastUpdated', { defaultMessage:'Last updated' })}
              reportDetailsComponentContent={
                reportDefinitionDetails.lastUpdated
              }
            />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.source', { defaultMessage:'Source' })}
              reportDetailsComponentContent={sourceURL(reportDefinitionDetails)}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.timePeriod', { defaultMessage:'Time period' })}
              reportDetailsComponentContent={`Last ${reportDefinitionDetails.timePeriod}`}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.fileFormat', { defaultMessage:'File format' })}
              reportDetailsComponentContent={fileFormatDownload(
                reportDefinitionDetails
              )}
            />
            <EuiFlexItem />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup>
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.reportHeader', { defaultMessage:'Report header' })}
              reportDetailsComponentContent={trimAndRenderAsText(
                reportDefinitionDetails.reportHeader
              )}
            />
            <ReportDetailsComponent
              reportDetailsComponentTitle={i18n.translate('odfe.reports.reportDefinitionsDetails.fields.reportFooter', { defaultMessage:'Report footer' })}
              reportDetailsComponentContent={trimAndRenderAsText(
                reportDefinitionDetails.reportFooter
              )}
            />
            <EuiFlexItem />
            <EuiFlexItem />
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiTitle>
            <h3>{i18n.translate('odfe.reports.reportDefinitionsDetails.fields.reportTrigger', { defaultMessage:'Report trigger' })}</h3>
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
        {showDeleteConfirmationModal}
        {showLoadingModal}
      </EuiPageBody>
    </EuiPage>
  );
}
