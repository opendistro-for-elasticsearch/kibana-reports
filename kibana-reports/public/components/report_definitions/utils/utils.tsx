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

import { isValidCron } from "cron-validator";
import moment from "moment";

 export const definitionInputValidation = async (
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
    ) => {
    // check report name
    // allow a-z, A-Z, 0-9, (), [], ',' - and _ and spaces
    let regexp = /^[\w\-\s\(\)\[\]\,\_\-+]+$/;
    if (metadata.report_params.report_name.search(regexp) === -1) {
      setShowSettingsReportNameError(true);
      if (metadata.report_params.report_name === '') {
        setSettingsReportNameErrorMessage('Name must not be empty.');
      } else {
        setSettingsReportNameErrorMessage('Invalid characters in report name.');
      }
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
        setEmailRecipientsErrorMessage(
          'Email recipients list cannot be empty.'
        );
        error = true;
      }
      // recipients have invalid email addresses: regexp checks format xxxxx@yyyy.zzz
      let emailRegExp = /\S+@\S+\.\S+/;
      let index;
      let recipients = metadata.delivery.delivery_params.recipients;
      for (index = 0; index < recipients.length; ++index) {
        if (recipients[0].search(emailRegExp) === -1) {
          setShowEmailRecipientsError(true);
          setEmailRecipientsErrorMessage(
            'Invalid email addresses in recipients list.'
          );
          error = true;
        }
      }
    }
    return error;
  };