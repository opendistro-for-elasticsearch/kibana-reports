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
  EuiGlobalToastList,
  EuiButton,
  EuiTitle,
  EuiPageBody,
  EuiSpacer,
} from '@elastic/eui';
import { ReportSettings } from '../report_settings';
import { ReportDelivery } from '../delivery';
import { ReportTrigger } from '../report_trigger';
import { generateReport } from '../../main/main_utils';
import { isValidCron } from 'cron-validator';
import moment from 'moment';

interface reportParamsType {
  report_name: string;
  report_source: string;
  description: string;
  header: string;
  footer: string;
  core_params: visualReportParams | dataReportParams;
}
interface visualReportParams {
  base_url: string;
  report_format: string;
  time_duration: string;
}

interface dataReportParams {
  saved_search_id: number;
  base_url: string;
  report_format: string;
  time_duration: string;
}
interface triggerType {
  trigger_type: string;
  trigger_params?: any;
}

interface deliveryType {
  delivery_type: string;
  delivery_params: any;
}

export interface TriggerParamsType {
  schedule_type: string;
  schedule: Recurring | Cron;
  enabled_time: number;
  enabled: boolean;
}

interface Recurring {
  interval: {
    period: number;
    unit: string;
    start_time: number;
  };
}

interface Cron {
  cron: {
    cron_expression: string;
    time_zone: string;
  };
}

export interface reportDefinitionParams {
  report_params: reportParamsType;
  delivery: deliveryType;
  trigger: triggerType;
}

export interface timeRangeParams {
  timeFrom: Date;
  timeTo: Date;
}

export function CreateReport(props) {
  let createReportDefinitionRequest: reportDefinitionParams = {
    report_params: {
      report_name: '',
      report_source: '',
      description: '',
      header: '',
      footer: '',
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
  };

  const [toasts, setToasts] = useState([]);
  const [comingFromError, setComingFromError] = useState(false);
  const [preErrorData, setPreErrorData] = useState({});

  const [
    showSettingsReportNameError,
    setShowSettingsReportNameError,
  ] = useState(false);
  const [
    showTriggerIntervalNaNError,
    setShowTriggerIntervalNaNError,
  ] = useState(false);
  const [showCronError, setShowCronError] = useState(false);
  const [showEmailRecipientsError, setShowEmailRecipientsError] = useState(
    false
  );
  const [showTimeRangeError, setShowTimeRangeError] = useState(false);

  // preserve the state of the request after an invalid create report definition request
  if (comingFromError) {
    createReportDefinitionRequest = preErrorData;
  }

  const addErrorToastHandler = () => {
    const errorToast = {
      title: 'Error creating report definition',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorToast = () => {
    addErrorToastHandler();
  };

  const addSuccessToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: <p>Report definition successfully created!</p>,
      id: 'successToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessToast = () => {
    addSuccessToastHandler();
  };

  const addInvalidTimeRangeToastHandler = () => {
    const errorToast = {
      title: 'Invalid time range selected',
      color: 'danger',
      iconType: 'alert',
      id: 'timeRangeErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleInvalidTimeRangeToast = () => {
    addInvalidTimeRangeToastHandler();
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  let timeRange = {
    timeFrom: new Date(),
    timeTo: new Date(),
  };

  const definitionInputValidation = async (metadata, error) => {
    // check report name
    // allow a-z, A-Z, 0-9, (), [], ',' - and _ and spaces
    let regexp = /^[\w\-\s\(\)\[\]\,\_\-+]+$/;
    if (metadata.report_params.report_name.search(regexp) === -1) {
      setShowSettingsReportNameError(true);
      error = true;
    }

    // if recurring by interval and input is not a number
    if (
      metadata.trigger.trigger_type === 'Schedule' &&
      metadata.trigger.trigger_params.schedule_type === 'Recurring'
    ) {
      let interval = parseInt(
        metadata.trigger.trigger_params.schedule.interval.period
      );
      if (isNaN(interval)) {
        setShowTriggerIntervalNaNError(true);
        error = true;
      }
    }

    // if time range is invalid
    const nowDate = new Date(moment.now());
    if (timeRange.timeFrom > timeRange.timeTo || timeRange.timeTo > nowDate) {
      setShowTimeRangeError(true);
      error = true;
    }

    // if cron based and cron input is invalid
    if (
      metadata.trigger.trigger_type === 'Schedule' &&
      metadata.trigger.trigger_params.schedule_type === 'Cron based'
    ) {
      if (
        !isValidCron(metadata.trigger.trigger_params.schedule.cron.expression)
      ) {
        setShowCronError(true);
        error = true;
      }
    }
    // if email delivery
    if (metadata.delivery.delivery_type === 'Channel') {
      // no recipients are listed
      if (metadata.delivery.delivery_params.recipients.length === 0) {
        setShowEmailRecipientsError(true);
        error = true;
      }
      // recipients have invalid email addresses: regexp checks format xxxxx@yyyy.zzz
      let emailRegExp = /\S+@\S+\.\S+/;
      let index;
      let recipients = metadata.delivery.delivery_params.recipients;
      for (index = 0; index < recipients.length; ++index) {
        if (recipients[0].search(emailRegExp) === -1) {
          setShowEmailRecipientsError(true);
          error = true;
        }
      }
    }
    return error;
  };

  const createNewReportDefinition = async (
    metadata: reportDefinitionParams,
    timeRange: timeRangeParams
  ) => {
    const { httpClient } = props;

    //TODO: need better handle
    if (
      metadata.trigger.trigger_type === 'On demand' &&
      metadata.trigger.trigger_params !== undefined
    ) {
      delete metadata.trigger.trigger_params;
    }

    let error = false;
    await definitionInputValidation(metadata, error).then((response) => {
      error = response;
    });
    if (error) {
      handleErrorToast();
      setPreErrorData(metadata);
      setComingFromError(true);
    } else {
      httpClient
        .post('../api/reporting/reportDefinition', {
          body: JSON.stringify(metadata),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(async (resp) => {
          //TODO: consider handle the on demand report generation from server side instead
          if (metadata.trigger.trigger_type === 'On demand') {
            let onDemandDownloadMetadata = {
              query_url: `${
                metadata.report_params.core_params.base_url
              }?_g=(time:(from:'${timeRange.timeFrom.toISOString()}',to:'${timeRange.timeTo.toISOString()}'))`,
              time_from: timeRange.timeFrom.valueOf(),
              time_to: timeRange.timeTo.valueOf(),
              report_definition: metadata,
            };
            generateReport(onDemandDownloadMetadata, httpClient);
          }
          await handleSuccessToast();
          window.location.assign(`opendistro_kibana_reports#/`);
        })
        .catch((error) => {
          console.log('error in creating report definition: ' + error);
          handleErrorToast();
        });
    }
  };

  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Reporting',
        href: '#',
      },
      {
        text: 'Create report definition',
        href: '#/create',
      },
    ]);
  }, []);

  return (
    <div>
      <EuiPageBody>
        <EuiTitle>
          <h1>Create report definition</h1>
        </EuiTitle>
        <EuiSpacer />
        <ReportSettings
          edit={false}
          reportDefinitionRequest={createReportDefinitionRequest}
          httpClientProps={props['httpClient']}
          timeRange={timeRange}
          showSettingsReportNameError={showSettingsReportNameError}
          showTimeRangeError={showTimeRangeError}
        />
        <EuiSpacer />
        <ReportTrigger
          edit={false}
          reportDefinitionRequest={createReportDefinitionRequest}
          showTriggerIntervalNaNError={showTriggerIntervalNaNError}
          showCronError={showCronError}
        />
        <EuiSpacer />
        <ReportDelivery
          edit={false}
          reportDefinitionRequest={createReportDefinitionRequest}
          showEmailRecipientsError={showEmailRecipientsError}
        />
        <EuiSpacer />
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              onClick={() => {
                window.location.assign(`opendistro_kibana_reports#/${true}`);
              }}
            >
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              fill={true}
              onClick={() =>
                createNewReportDefinition(
                  createReportDefinitionRequest,
                  timeRange
                )
              }
            >
              Create
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </EuiPageBody>
    </div>
  );
}
