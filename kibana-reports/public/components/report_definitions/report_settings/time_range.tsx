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

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { parseInContextUrl } from './report_settings_helpers';
import dateMath from '@elastic/datemath';
import {
  EuiFormRow,
  EuiGlobalToastList,
  EuiSuperDatePicker,
} from '@elastic/eui';

export function TimeRangeSelect(props) {
  const {
    reportDefinitionRequest,
    timeRange,
    edit,
    id,
    httpClientProps,
    showTimeRangeError,
  } = props;

  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState('now-30m');
  const [end, setEnd] = useState('now');

  const [toasts, setToasts] = useState([]);

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

  const isValidTimeRange = (
    timeRangeMoment: number | moment.Moment,
    limit: string,
    handleInvalidTimeRangeToast: any
  ) => {
    if (limit === 'start') {
      if (!timeRangeMoment || !timeRangeMoment.isValid()) {
        handleInvalidTimeRangeToast();
      }
    } else if (limit === 'end') {
      if (
        !timeRangeMoment ||
        !timeRangeMoment.isValid() ||
        timeRangeMoment > moment.now()
      ) {
        handleInvalidTimeRangeToast();
      }
    }
  };

  const setDefaultEditTimeRange = (duration, unmounted) => {
    let time_difference = moment.now() - duration;
    const fromDate = new Date(time_difference);
    parseTimeRange(fromDate, end, reportDefinitionRequest);
    if (!unmounted) {
      setStart(fromDate.toISOString());
      setEnd(end);
    }
  };

  // valid time range check for absolute time end date
  const checkValidAbsoluteEndDate = (end) => {
    let endDate = new Date(end);
    let nowDate = new Date(moment.now());
    let valid = true;
    if (endDate.getTime() > nowDate.getTime()) {
      end = 'now';
      valid = false;
    }
    return valid;
  };

  useEffect(() => {
    let unmounted = false;
    // if we are coming from the in-context menu
    if (window.location.href.indexOf('?') > -1) {
      const url = window.location.href;
      const timeFrom = parseInContextUrl(url, 'timeFrom');
      const timeTo = parseInContextUrl(url, 'timeTo');
      parseTimeRange(timeFrom, timeTo, reportDefinitionRequest);
      if (!unmounted) {
        setStart(timeFrom);
        setEnd(timeTo);
      }
    } else {
      if (edit) {
        httpClientProps
          .get(`../api/reporting/reportDefinitions/${id}`)
          .then(async (response: {}) => {
            let duration =
              response.report_definition.report_params.core_params
                .time_duration;
            duration = moment.duration(duration);
            setDefaultEditTimeRange(duration, unmounted);
          })
          .catch((error) => {
            console.error(
              'error in fetching report definition details:',
              error
            );
          });
      } else {
        parseTimeRange(start, end, reportDefinitionRequest);
      }
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const onTimeChange = ({ start, end }) => {
    isValidTimeRange(
      dateMath.parse(start),
      'start',
      handleInvalidTimeRangeToast
    );
    isValidTimeRange(
      dateMath.parse(end, { roundUp: true }),
      'end',
      handleInvalidTimeRangeToast
    );

    const recentlyUsedRange = recentlyUsedRanges.filter((recentlyUsedRange) => {
      const isDuplicate =
        recentlyUsedRange.start === start && recentlyUsedRange.end === end;
      return !isDuplicate;
    });
    const validEndDate = checkValidAbsoluteEndDate(end);
    if (!validEndDate) {
      handleInvalidTimeRangeToast();
      return;
    }

    recentlyUsedRange.unshift({ start, end });
    setStart(start);
    setEnd(end);
    setRecentlyUsedRanges(
      recentlyUsedRange.length > 10
        ? recentlyUsedRange.slice(0, 9)
        : recentlyUsedRange
    );
    setIsLoading(true);
    startLoading();
    parseTimeRange(start, end, reportDefinitionRequest);
  };

  const parseTimeRange = (start, end, reportDefinitionRequest) => {
    timeRange.timeFrom = dateMath.parse(start);
    timeRange.timeTo = dateMath.parse(end);
    const timeDuration = moment.duration(
      dateMath.parse(end).diff(dateMath.parse(start))
    );
    reportDefinitionRequest.report_params.core_params.time_duration = timeDuration.toISOString();
  };

  const startLoading = () => {
    setTimeout(stopLoading, 1000);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <div>
      <div>
        <EuiFormRow
          label="Time range"
          helpText="Time range is relative to the report creation date on the report trigger."
          isInvalid={showTimeRangeError}
          error={'Invalid time range selected.'}
        >
          <EuiSuperDatePicker
            isDisabled={false}
            isLoading={isLoading}
            start={start}
            end={end}
            onTimeChange={onTimeChange}
            showUpdateButton={false}
          />
        </EuiFormRow>
      </div>
      <div>
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </div>
    </div>
  );
}
