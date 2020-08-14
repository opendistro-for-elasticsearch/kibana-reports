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

import React, { useState } from 'react';
import {
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiHorizontalRule,
  EuiFormRow,
  EuiRadioGroup,
  EuiDatePicker,
  EuiSelect,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiFieldText,
  EuiCheckboxGroup,
  EuiTextArea,
  EuiLink,
  EuiButton,
} from '@elastic/eui';
import moment, { Moment } from 'moment';
import { TIMEZONE_OPTIONS } from '../create/create_report_definition';
import {
  AVAILABLE_MONITOR_OPTIONS,
  AVAILABLE_TRIGGER_OPTIONS,
} from './report_trigger_test_data';
import {
  REPORT_TYPE_OPTIONS,
  SCHEDULE_REQUEST_TIME_OPTIONS,
  SCHEDULE_RECURRING_OPTIONS,
  INTERVAL_TIME_PERIODS,
  WEEKLY_CHECKBOX_OPTIONS,
  MONTHLY_ON_THE_OPTIONS,
  MONTHLY_DAY_SELECT_OPTIONS,
  SCHEDULE_OPTION_MAP,
  TRIGGER_OPTION_MAP,
} from './report_trigger_constants';

const tempTriggerParamTime = '1553112384';

let trigger_params = {
  schedule_type: '',
  schedule: {},
};

let trigger_schema = {
  trigger_type: '',
  trigger_params: {},
};

let temp_trigger_params = {
  interval: {
    period: '7',
    unit: 'DAYS',
    start_time: tempTriggerParamTime,
  },
};

export function ReportTrigger(props) {
  const { createReportDefinitionRequest } = props;

  const [reportTriggerType, setReportTriggerTypes] = useState('scheduleOption');
  trigger_schema['trigger_type'] = 'Schedule';

  const [scheduleRequestTime, setScheduleRequestTime] = useState('nowOption');
  trigger_params['schedule_type'] = 'Now';
  createReportDefinitionRequest['report_type'] = 'Download';

  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0].value);
  const [futureDateTimeSelect, setFutureDateTimeSelect] = useState(moment());
  const [scheduleRecurringFrequency, setScheduleRecurringFrequency] = useState(
    'daily'
  );
  const [recurringDailyTime, setRecurringDailyTime] = useState(moment());
  const [intervalTimePeriod, setIntervalTimePeriod] = useState(
    INTERVAL_TIME_PERIODS[0].value
  );
  const [weeklyCheckbox, setWeeklyCheckbox] = useState({
    ['monCheckbox']: true,
  });
  const [monthlySelect, setMonthlySelect] = useState(
    MONTHLY_ON_THE_OPTIONS[0].value
  );
  const [monthlyDaySelect, setMonthlyDaySelect] = useState(
    MONTHLY_DAY_SELECT_OPTIONS[0].value
  );
  const [monitor, setMonitor] = useState(AVAILABLE_MONITOR_OPTIONS[0].value);
  const [trigger, setTrigger] = useState(AVAILABLE_TRIGGER_OPTIONS[0].value);

  const handleReportTriggerType = (e: React.SetStateAction<string>) => {
    setReportTriggerTypes(e);
    trigger_schema['trigger_type'] = TRIGGER_OPTION_MAP[e];
  };

  const handleScheduleRequestTime = (e: React.SetStateAction<string>) => {
    setScheduleRequestTime(e);
    trigger_params['schedule_type'] = SCHEDULE_OPTION_MAP[e];
    if (e === 'nowOption') {
      createReportDefinitionRequest['report_type'] = 'Download';
    }
  };

  const handleFutureDateTimeSelect = (
    e: React.SetStateAction<moment.Moment>
  ) => {
    setFutureDateTimeSelect(e);
  };

  const handleTimezone = (e: {
    target: { value: React.SetStateAction<number> };
  }) => {
    setTimezone(e.target.value);
  };

  const handleScheduleRecurringFrequency = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setScheduleRecurringFrequency(e.target.value);
  };

  const handleRecurringDailyTime = (e: React.SetStateAction<moment.Moment>) => {
    setRecurringDailyTime(e);
  };

  const handleIntervalTimePeriod = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setIntervalTimePeriod(e.target.value);
  };

  const handleWeeklyCheckbox = (e) => {
    const newCheckboxIdToSelectedMap = {
      ...weeklyCheckbox,
      ...{
        [e]: !weeklyCheckbox[e],
      },
    };
    setWeeklyCheckbox(newCheckboxIdToSelectedMap);
  };

  const handleMonthlySelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMonthlySelect(e.target.value);
  };

  const handleMonthlyDaySelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMonthlyDaySelect(e.target.value);
  };

  const handleMonitor = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMonitor(e.target.value);
  };

  const handleTrigger = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTrigger(e.target.value);
  };

  const TimezoneSelect = () => {
    return (
      <div>
        <EuiFormRow label="Timezone">
          <EuiSelect
            id="setTimezone"
            options={TIMEZONE_OPTIONS}
            value={timezone}
            onChange={handleTimezone}
          />
        </EuiFormRow>
      </div>
    );
  };

  const ScheduleTriggerFutureDate = () => {
    return (
      <div>
        <EuiFormRow label="Request time">
          <EuiDatePicker
            showTimeSelect
            selected={futureDateTimeSelect}
            onChange={handleFutureDateTimeSelect}
          />
        </EuiFormRow>
        <EuiSpacer />
        <TimezoneSelect />
      </div>
    );
  };

  const RequestTime = () => {
    return (
      <div>
        <EuiFormRow label="Request time">
          <EuiDatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={recurringDailyTime}
            onChange={handleRecurringDailyTime}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </EuiFormRow>
        <EuiSpacer size="s" />
        <TimezoneSelect />
      </div>
    );
  };

  const RecurringInterval = () => {
    const [intervalText, setIntervalText] = useState('');

    const handleIntervalText = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setIntervalText(e.target.value);
    };
    return (
      <EuiFormRow label="Every">
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiFieldText
              placeholder="Must be a number"
              value={intervalText}
              onChange={handleIntervalText}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow>
              <EuiSelect
                id="intervalTimeUnit"
                options={INTERVAL_TIME_PERIODS}
                value={intervalTimePeriod}
                onChange={handleIntervalTimePeriod}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    );
  };

  const RecurringWeekly = () => {
    return (
      <div>
        <EuiFormRow label="Every">
          <EuiCheckboxGroup
            options={WEEKLY_CHECKBOX_OPTIONS}
            idToSelectedMap={weeklyCheckbox}
            onChange={handleWeeklyCheckbox}
          />
        </EuiFormRow>
        <EuiSpacer />
        <RequestTime />
      </div>
    );
  };

  const RecurringMonthly = () => {
    const [monthlyDayNumber, setMonthlyDayNumber] = useState('');

    const handleMonthlyDayNumber = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setMonthlyDayNumber(e.target.value);
    };

    const on_the_day =
      monthlySelect === 'day' ? (
        <div>
          <EuiFieldText
            placeholder={'Day of month'}
            value={monthlyDayNumber}
            onChange={handleMonthlyDayNumber}
          />
        </div>
      ) : null;

    const select =
      monthlySelect != 'day' ? (
        <div>
          <EuiSelect
            id="monthlySelect"
            options={MONTHLY_DAY_SELECT_OPTIONS}
            value={monthlyDaySelect}
            onChange={handleMonthlyDaySelect}
          />
        </div>
      ) : null;

    return (
      <div>
        <EuiFormRow label="On the">
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiSelect
                id="monthlySelect"
                options={MONTHLY_ON_THE_OPTIONS}
                value={monthlySelect}
                onChange={handleMonthlySelect}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              {on_the_day}
              {select}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>
        <EuiSpacer size="s" />
        <RequestTime />
      </div>
    );
  };

  const CronExpression = () => {
    const [cronExpression, setCronExpression] = useState('');

    const handleCronExpression = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setCronExpression(e.target.value);
    };

    return (
      <div>
        <EuiFormRow label="Custom cron expression">
          <EuiTextArea
            placeholder={'Enter cron expression'}
            value={cronExpression}
            onChange={handleCronExpression}
          />
        </EuiFormRow>
        <EuiSpacer />
        <TimezoneSelect />
      </div>
    );
  };

  const ScheduleTriggerRecurring = () => {
    const display_daily =
      scheduleRecurringFrequency === 'daily' ? <RequestTime /> : null;

    const display_interval =
      scheduleRecurringFrequency === 'byInterval' ? (
        <RecurringInterval />
      ) : null;

    const display_weekly =
      scheduleRecurringFrequency === 'weekly' ? <RecurringWeekly /> : null;

    const display_monthly =
      scheduleRecurringFrequency === 'monthly' ? <RecurringMonthly /> : null;

    return (
      <div>
        <EuiFormRow label="Frequency">
          <EuiSelect
            id="recurringFrequencySelect"
            options={SCHEDULE_RECURRING_OPTIONS}
            value={scheduleRecurringFrequency}
            onChange={handleScheduleRecurringFrequency}
          />
        </EuiFormRow>
        <EuiSpacer size="s" />
        {display_daily}
        {display_interval}
        {display_weekly}
        {display_monthly}
      </div>
    );
  };

  const ScheduleTrigger = () => {
    const display_future_date =
      scheduleRequestTime === 'futureDateOption' ? (
        <ScheduleTriggerFutureDate />
      ) : null;

    const display_recurring =
      scheduleRequestTime === 'recurringOption' ? (
        <ScheduleTriggerRecurring />
      ) : null;

    const display_cron =
      scheduleRequestTime === 'cronBasedOption' ? <CronExpression /> : null;

    return (
      <div>
        <EuiFormRow
          label="Request time"
          helpText="Define delivery schedule and frequency"
        >
          <EuiRadioGroup
            options={SCHEDULE_REQUEST_TIME_OPTIONS}
            idSelected={scheduleRequestTime}
            onChange={handleScheduleRequestTime}
          />
        </EuiFormRow>
        <EuiSpacer />
        {display_future_date}
        {display_recurring}
        {display_cron}
      </div>
    );
  };

  const AlertTrigger = () => {
    return (
      <div>
        <EuiFlexGroup>
          <EuiFlexItem grow={1}>
            <EuiFormRow label="Available monitors">
              <EuiSelect
                id="selectAlertMonitor"
                options={AVAILABLE_MONITOR_OPTIONS}
                value={monitor}
                onChange={handleMonitor}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            <EuiFormRow label="Available triggers">
              <EuiSelect
                id="selectAlertTrigger"
                options={AVAILABLE_TRIGGER_OPTIONS}
                value={trigger}
                onChange={handleTrigger}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem></EuiFlexItem>
          <EuiFlexItem></EuiFlexItem>
          <EuiFlexItem></EuiFlexItem>
        </EuiFlexGroup>
      </div>
    );
  };

  const schedule =
    reportTriggerType === 'scheduleOption' ? <ScheduleTrigger /> : null;

  const alert = reportTriggerType === 'alertOption' ? <AlertTrigger /> : null;

  // TODO: Change schema so these values are not required depending on trigger type
  trigger_params['schedule'] = temp_trigger_params;
  trigger_schema['trigger_params'] = trigger_params;
  createReportDefinitionRequest['trigger'] = trigger_schema;

  return (
    <EuiPageContent panelPaddingSize={'l'}>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Report trigger</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule />
      <EuiPageContentBody>
        <EuiFormRow label="Trigger type">
          <EuiRadioGroup
            options={REPORT_TYPE_OPTIONS}
            idSelected={reportTriggerType}
            onChange={handleReportTriggerType}
          />
        </EuiFormRow>
        <EuiSpacer />
        {schedule}
        {alert}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
