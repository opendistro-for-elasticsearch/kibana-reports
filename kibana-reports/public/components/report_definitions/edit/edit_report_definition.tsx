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
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiPage,
  EuiTitle,
  EuiPageBody,
  EuiSpacer,
  EuiGlobalToastList,
} from '@elastic/eui';
import { ReportSettings } from '../report_settings';
import { ReportDelivery } from '../delivery';
import { ReportTrigger } from '../report_trigger';
import { ReportDefinitionSchemaType } from 'server/model';
import { converter } from '../utils';
import {
  permissionsMissingToast,
  permissionsMissingActions,
} from '../../utils/utils';
import { definitionInputValidation } from '../utils/utils';

export function EditReportDefinition(props) {
  const [toasts, setToasts] = useState([]);
  const [comingFromError, setComingFromError] = useState(false);
  const [preErrorData, setPreErrorData] = useState({});

  const [
    showSettingsReportNameError,
    setShowSettingsReportNameError,
  ] = useState(false);
  const [
    settingsReportNameErrorMessage,
    setSettingsReportNameErrorMessage,
  ] = useState('');
  const [
    showTriggerIntervalNaNError,
    setShowTriggerIntervalNaNError,
  ] = useState(false);
  const [showCronError, setShowCronError] = useState(false);
  const [
    showEmailRecipientsError, 
    setShowEmailRecipientsError
  ] = useState(false);
  const [
    emailRecipientsErrorMessage,
    setEmailRecipientsErrorMessage,
  ] = useState('');
  const [showTimeRangeError, setShowTimeRangeError] = useState(false);

  const addPermissionsMissingViewEditPageToastHandler = (errorType: string) => {
    let toast = {};
    if (errorType === 'permissions') {
      toast = permissionsMissingToast(
        permissionsMissingActions.VIEWING_EDIT_PAGE
      );
    } else if (errorType === 'API') {
      toast = {
        title: 'Error loading report definition values.',
        color: 'danger',
        iconType: 'alert',
        id: 'errorToast',
      };
    }
    setToasts(toasts.concat(toast));
  };

  const handleViewEditPageErrorToast = (errorType: string) => {
    addPermissionsMissingViewEditPageToastHandler(errorType);
  };

  const addInputValidationErrorToastHandler = () => {
    const errorToast = {
      title: 'One or more fields have an error. Please check and try again.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleInputValidationErrorToast = () => {
    addInputValidationErrorToastHandler();
  };

  const addErrorUpdatingReportDefinitionToastHandler = (errorType: string) => {
    let toast = {};
    if (errorType === 'permissions') {
      toast = permissionsMissingToast(
        permissionsMissingActions.UPDATING_DEFINITION
      );
    } else if (errorType === 'API') {
      toast = {
        title: 'Error updating report definition.',
        color: 'danger',
        iconType: 'alert',
        id: 'errorToast',
      };
    }
    setToasts(toasts.concat(toast));
  };

  const handleErrorUpdatingReportDefinitionToast = (errorType: string) => {
    addErrorUpdatingReportDefinitionToastHandler(errorType);
  };

  const addErrorDeletingReportDefinitionToastHandler = () => {
    const errorToast = {
      title: 'Error deleting old scheduled report definition.',
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

  const reportDefinitionId = props['match']['params']['reportDefinitionId'];
  let reportDefinition: ReportDefinitionSchemaType;
  let editReportDefinitionRequest = {
    report_params: {
      report_name: '',
      report_source: '',
      description: '',
      core_params: {
        base_url: '',
        report_format: '',
        time_duration: '',
      },
    },
    delivery: {
      delivery_type: '',
      delivery_params: {},
    },
    trigger: {
      trigger_type: '',
    },
    time_created: 0,
    last_updated: 0,
    status: '',
  };
  reportDefinition = editReportDefinitionRequest; // initialize reportDefinition object

  let timeRange = {
    timeFrom: new Date(),
    timeTo: new Date(),
  };

  if (comingFromError) {
    editReportDefinitionRequest = preErrorData;
  }

  const callUpdateAPI = async (metadata) => {
    const { httpClient } = props;
    httpClient
      .put(`../api/reporting/reportDefinitions/${reportDefinitionId}`, {
        body: JSON.stringify(metadata),
        params: reportDefinitionId.toString(),
      })
      .then(async () => {
        window.location.assign(`opendistro_kibana_reports#/edit=success`);
      })
      .catch((error) => {
        console.log('error in updating report definition:', error);
        if (error.body.statusCode === 400) {
          handleInputValidationErrorToast();
        } else if (error.body.statusCode === 403) {
          handleErrorUpdatingReportDefinitionToast('permissions');
        } else {
          handleErrorUpdatingReportDefinitionToast('API');
        }
        setPreErrorData(metadata);
        setComingFromError(true);
      });
  };

  const editReportDefinition = async (metadata) => {
    if ('header' in metadata.report_params.core_params) {
      metadata.report_params.core_params.header = converter.makeHtml(
        metadata.report_params.core_params.header
      );
    }
    if ('footer' in metadata.report_params.core_params) {
      metadata.report_params.core_params.footer = converter.makeHtml(
        metadata.report_params.core_params.footer
      );
    }
    
    // client-side input validation
    let error = false;
    await definitionInputValidation(
      metadata,
      error,
      setShowSettingsReportNameError,
      setSettingsReportNameErrorMessage,
      setShowTriggerIntervalNaNError,
      timeRange,
      setShowTimeRangeError,
      setShowCronError,
      setShowEmailRecipientsError,
      setEmailRecipientsErrorMessage
    ).then((response) => {
      error = response;
    });
    if (error) {
      handleInputValidationErrorToast();
      setPreErrorData(metadata);
      setComingFromError(true);
    } else {
      await callUpdateAPI(metadata);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const { httpClient } = props;
    httpClient
      .get(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then((response) => {
        reportDefinition = response.report_definition;
        const {
          time_created: timeCreated,
          status,
          last_updated: lastUpdated,
          report_params: { report_name: reportName },
        } = reportDefinition;
        // configure non-editable fields
        editReportDefinitionRequest.time_created = timeCreated;
        editReportDefinitionRequest.last_updated = lastUpdated;
        editReportDefinitionRequest.status = status;

        props.setBreadcrumbs([
          {
            text: 'Reporting',
            href: '#',
          },
          {
            text: `Report definition details: ${reportName}`,
            href: `#/report_definition_details/${reportDefinitionId}`,
          },
          {
            text: `Edit report definition: ${reportName}`,
          },
        ]);
      })
      .catch((error) => {
        console.error(
          'error when loading edit report definition page: ',
          error
        );
        if (error.body.statusCode === 403) {
          handleViewEditPageErrorToast('permissions');
        } else {
          handleViewEditPageErrorToast('API');
        }
      });
  }, []);

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle>
          <h1>Edit report definition</h1>
        </EuiTitle>
        <EuiSpacer />
        <ReportSettings
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
          timeRange={timeRange}
          showSettingsReportNameError={showSettingsReportNameError}
          settingsReportNameErrorMessage={settingsReportNameErrorMessage}
          showTimeRangeError={showTimeRangeError}
        />
        <EuiSpacer />
        <ReportTrigger
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
          timeRange={timeRange}
          showTriggerIntervalNaNError={showTriggerIntervalNaNError}
          showCronError={showCronError}
        />
        <EuiSpacer />
        <ReportDelivery
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
          timeRange={timeRange}
          showEmailRecipientsError={showEmailRecipientsError}
          emailRecipientsErrorMessage={emailRecipientsErrorMessage}
        />
        <EuiSpacer />
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              onClick={() => {
                window.location.assign('opendistro_kibana_reports#/');
              }}
            >
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              onClick={() => editReportDefinition(editReportDefinitionRequest)}
              id={'editReportDefinitionButton'}
            >
              Save Changes
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </EuiPageBody>
    </EuiPage>
  );
}
