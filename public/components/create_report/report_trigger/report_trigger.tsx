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
import moment from 'moment';
import { timezone_options } from '../create_report';
import {
  available_monitor_options,
  available_trigger_options,
} from './report_trigger_test_data';
import {
  report_type_options,
  schedule_request_time_options,
  schedule_recurring_options,
  interval_time_periods,
  weekly_checkbox_options,
  monthly_on_the_options,
  monthly_day_select_options,
} from './report_trigger_constants';

export function ReportTrigger() {
  const [reportTriggerType, setReportTriggerTypes] = useState(
    'schedule_option'
  );
  const [scheduleRequestTime, setScheduleRequestTime] = useState('now_option');
  const [timezone, setTimezone] = useState(timezone_options[0].value);
  const [futureDateTimeSelect, setFutureDateTimeSelect] = useState(moment());
  const [scheduleRecurringFrequency, setScheduleRecurringFrequency] = useState(
    'daily'
  );
  const [recurringDailyTime, setRecurringDailyTime] = useState(moment());
  const [intervalText, setIntervalText] = useState('');
  const [intervalTimePeriod, setIntervalTimePeriod] = useState(
    interval_time_periods[0].value
  );
  const [weeklyCheckbox, setWeeklyCheckbox] = useState({
    ['mon_checkbox']: true,
  });
  const [monthlySelect, setMonthlySelect] = useState(
    monthly_on_the_options[0].value
  );
  const [monthlyDayNumber, setMonthlyDayNumber] = useState('');
  const [monthlyDaySelect, setMonthlyDaySelect] = useState(
    monthly_day_select_options[0].value
  );
  const [cronExpression, setCronExpression] = useState('');
  const [monitor, setMonitor] = useState(available_monitor_options[0].value);
  const [trigger, setTrigger] = useState(available_trigger_options[0].value);

  const onChangeReportTriggerType = (e) => {
    setReportTriggerTypes(e);
  };

  const onChangeScheduleRequestTime = (e) => {
    setScheduleRequestTime(e);
  };

  const onChangeFutureDateTimeSelect = (e) => {
    setFutureDateTimeSelect(e);
  };

  const onChangeTimezone = (e) => {
    setTimezone(e.target.value);
  };

  const onChangeScheduleRecurringFrequency = (e) => {
    setScheduleRecurringFrequency(e.target.value);
  };

  const onChangeRecurringDailyTime = (e) => {
    setRecurringDailyTime(e);
  };

  const onChangeIntervalText = (e) => {
    setIntervalText(e.target.value);
  };

  const onChangeIntervalTimePeriod = (e) => {
    setIntervalTimePeriod(e.target.value);
  };

  const onChangeWeeklyCheckbox = (e) => {
    const newCheckboxIdToSelectedMap = {
      ...weeklyCheckbox,
      ...{
        [e]: !weeklyCheckbox[e],
      },
    };
    setWeeklyCheckbox(newCheckboxIdToSelectedMap);
  };

  const onChangeMonthlySelect = (e) => {
    setMonthlySelect(e.target.value);
  };

  const onChangeMonthlyDayNumber = (e) => {
    setMonthlyDayNumber(e.target.value);
  };

  const onChangeMonthlyDaySelect = (e) => {
    setMonthlyDaySelect(e.target.value);
  };

  const onChangeCronExpression = (e) => {
    setCronExpression(e.target.value);
  };

  const onChangeMonitor = (e) => {
    setMonitor(e.target.value);
  };

  const onChangeTrigger = (e) => {
    setTrigger(e.target.value);
  };

  const TimezoneSelect = () => {
    return (
      <div>
        <EuiFormRow label="Timezone">
          <EuiSelect
            id="setTimezone"
            options={timezone_options}
            value={timezone}
            onChange={onChangeTimezone}
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
            onChange={onChangeFutureDateTimeSelect}
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
            onChange={onChangeRecurringDailyTime}
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
    return (
      <EuiFormRow label="Every">
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiFieldText
              placeholder="Must be a number"
              value={intervalText}
              onChange={onChangeIntervalText}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow>
              <EuiSelect
                id="intervalTimeUnit"
                options={interval_time_periods}
                value={intervalTimePeriod}
                onChange={onChangeIntervalTimePeriod}
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
            options={weekly_checkbox_options}
            idToSelectedMap={weeklyCheckbox}
            onChange={onChangeWeeklyCheckbox}
          />
        </EuiFormRow>
        <EuiSpacer />
        <RequestTime />
      </div>
    );
  };

  const RecurringMonthly = () => {
    const on_the_day =
      monthlySelect === 'day' ? (
        <div>
          <EuiFieldText
            placeholder={'Day of month'}
            value={monthlyDayNumber}
            onChange={onChangeMonthlyDayNumber}
          />
        </div>
      ) : null;

    const select =
      monthlySelect != 'day' ? (
        <div>
          <EuiSelect
            id="monthlySelect"
            options={monthly_day_select_options}
            value={monthlyDaySelect}
            onChange={onChangeMonthlyDaySelect}
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
                options={monthly_on_the_options}
                value={monthlySelect}
                onChange={onChangeMonthlySelect}
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
    return (
      <div>
        <EuiFormRow label="Custom cron expression">
          <EuiTextArea
            placeholder={'Enter cron expression'}
            value={cronExpression}
            onChange={onChangeCronExpression}
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
      scheduleRecurringFrequency === 'by_interval' ? (
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
            options={schedule_recurring_options}
            value={scheduleRecurringFrequency}
            onChange={onChangeScheduleRecurringFrequency}
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
      scheduleRequestTime === 'future_date_option' ? (
        <ScheduleTriggerFutureDate />
      ) : null;

    const display_recurring =
      scheduleRequestTime === 'recurring_option' ? (
        <ScheduleTriggerRecurring />
      ) : null;

    const display_cron =
      scheduleRequestTime === 'cron_based_option' ? <CronExpression /> : null;

    return (
      <div>
        <EuiFormRow
          label="Request time"
          helpText="Define delivery schedule and frequency"
        >
          <EuiRadioGroup
            options={schedule_request_time_options}
            idSelected={scheduleRequestTime}
            onChange={onChangeScheduleRequestTime}
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
                options={available_monitor_options}
                value={monitor}
                onChange={onChangeMonitor}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            <EuiFormRow label="Available triggers">
              <EuiSelect
                id="selectAlertTrigger"
                options={available_trigger_options}
                value={trigger}
                onChange={onChangeTrigger}
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
    reportTriggerType === 'schedule_option' ? <ScheduleTrigger /> : null;

  const alert = reportTriggerType === 'alert_option' ? <AlertTrigger /> : null;

  return (
    <EuiPageContent panelPaddingSize={'l'}>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Report trigger</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule />
      <EuiPageContentBody>
        <EuiFormRow label="Report type">
          <EuiRadioGroup
            options={report_type_options}
            idSelected={reportTriggerType}
            onChange={onChangeReportTriggerType}
          />
        </EuiFormRow>
        <EuiSpacer />
        {schedule}
        {alert}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
