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
import { EuiFormRow, EuiSuperDatePicker } from '@elastic/eui';

const isValidTimeRange = (
  timeRangeMoment: number | moment.Moment,
  limit: string
) => {
  if (limit === 'start') {
    if (!timeRangeMoment || !timeRangeMoment.isValid()) {
      throw new Error('Unable to parse start string');
    }
  } else if (limit === 'end') {
    if (
      !timeRangeMoment ||
      !timeRangeMoment.isValid() ||
      timeRangeMoment > moment()
    ) {
      throw new Error('Unable to parse end string');
    }
  }
};

export function TimeRangeSelect(props) {
  const {
    reportDefinitionRequest,
    timeRange,
    edit,
    id,
    httpClientProps,
  } = props;

  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState('now-30m');
  const [end, setEnd] = useState('now');
  const [isPaused, setIsPaused] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState();

  const setDefaultEditTimeRange = (duration, unmounted) => {
    let time_difference = moment.now() - duration;
    const fromDate = new Date(time_difference);
    parseTimeRange(fromDate, end, reportDefinitionRequest);
    if (!unmounted) {
      setStart(fromDate.toISOString());
      setEnd(end);
    }
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
    const recentlyUsedRange = recentlyUsedRanges.filter((recentlyUsedRange) => {
      const isDuplicate =
        recentlyUsedRange.start === start && recentlyUsedRange.end === end;
      return !isDuplicate;
    });
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
  };

  const parseTimeRange = (start, end, reportDefinitionRequest) => {
    timeRange.timeFrom = dateMath.parse(start);
    timeRange.timeTo = dateMath.parse(end);
    const timeDuration = moment.duration(
      dateMath.parse(end).diff(dateMath.parse(start))
    );
    reportDefinitionRequest.report_params.core_params.time_duration = timeDuration.toISOString();
  };

  const onRefresh = ({ start, end, refreshInterval }) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    }).then(() => {
      console.log(start, end, refreshInterval);
    });
  };

  const startLoading = () => {
    setTimeout(stopLoading, 1000);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const onRefreshChange = ({ isPaused, refreshInterval }) => {
    setIsPaused(isPaused);
    setRefreshInterval(refreshInterval);
  };

  isValidTimeRange(dateMath.parse(start), 'start');
  isValidTimeRange(dateMath.parse(end, { roundUp: true }), 'end');

  return (
    <div>
      <EuiFormRow
        label="Time range"
        helpText="Time range is relative to the report creation date on the report trigger."
      >
        <EuiSuperDatePicker
          isDisabled={false}
          isLoading={isLoading}
          start={start}
          end={end}
          onTimeChange={onTimeChange}
          onRefresh={onRefresh}
          isPaused={isPaused}
          refreshInterval={refreshInterval}
          onRefreshChange={onRefreshChange}
          recentlyUsedRanges={recentlyUsedRanges}
          showUpdateButton={false}
        />
      </EuiFormRow>
    </div>
  );
}
