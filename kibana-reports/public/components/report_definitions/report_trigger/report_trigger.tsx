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
import { reportDefinitionParams } from '../create/create_report_definition';
import {
  AVAILABLE_MONITOR_OPTIONS,
  AVAILABLE_TRIGGER_OPTIONS,
} from './report_trigger_test_data';
import {
  SCHEDULE_RECURRING_OPTIONS,
  INTERVAL_TIME_PERIODS,
  WEEKLY_CHECKBOX_OPTIONS,
  MONTHLY_ON_THE_OPTIONS,
  MONTHLY_DAY_SELECT_OPTIONS,
  TRIGGER_TYPE_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
  TIMEZONE_OPTIONS,
} from './report_trigger_constants';

type ReportTriggerProps = {
  edit: boolean;
  editDefinitionId: string;
  reportDefinitionRequest: reportDefinitionParams;
  httpClientProps: any;
};

export function ReportTrigger(props: ReportTriggerProps) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
  } = props;

  const [reportTriggerType, setReportTriggerType] = useState(TRIGGER_TYPE_OPTIONS[0].id);

  const [scheduleType, setScheduleType] = useState('Recurring');
  //TODO: should read local timezone and display
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0].value);
  const [scheduleRecurringFrequency, setScheduleRecurringFrequency] = useState(
    'daily'
  );
  const [recurringDailyTime, setRecurringDailyTime] = useState(moment());

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

  let onRender = true;

  const handleReportTriggerType = (e: string) => {
    setReportTriggerType(e);
    reportDefinitionRequest.trigger.trigger_type = e;
    if (e === 'On demand') {
      delete reportDefinitionRequest.trigger.trigger_params;
    }
    else if (e === 'Schedule') {

    }
  };

  const handleScheduleType = (e: React.SetStateAction<string>) => {
    setScheduleType(e);
  };

  const handleTimezone = (e) => {
    setTimezone(e.target.value);
  };

  const handleScheduleRecurringFrequency = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setScheduleRecurringFrequency(e.target.value);
    reportDefinitionRequest.trigger.trigger_params.schedule_type = e.target.value;
  };

  const handleRecurringDailyTime = (e: React.SetStateAction<moment.Moment>) => {
    setRecurringDailyTime(e);
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

  const RequestTime = () => {
    useEffect(() => {
      let recurringDaily = {
        interval: {
          period: 1,
          unit: 'DAYS',
          start_time: recurringDailyTime.valueOf(),
        },
      };
      reportDefinitionRequest.trigger.trigger_params = {
        ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: recurringDailyTime.valueOf(),
        schedule: recurringDaily,
      };
    }, []);

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
        <EuiSpacer />
        <TimezoneSelect />
      </div>
    );
  };

  const RecurringInterval = () => {
    const [intervalText, setIntervalText] = useState('');
    const [intervalTimePeriod, setIntervalTimePeriod] = useState(
      INTERVAL_TIME_PERIODS[0].value
    );

    const handleIntervalText = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setIntervalText(e.target.value);
    };

    const handleIntervalTimePeriod = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setIntervalTimePeriod(e.target.value);
    };

    useEffect(() => {
      let interval = {
        interval: {
          period: parseInt(intervalText, 10),
          unit: intervalTimePeriod,
          start_time: recurringDailyTime.valueOf(),
        },
      };
      reportDefinitionRequest.trigger.trigger_params = {
        ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: recurringDailyTime.valueOf(),
        schedule: interval,
      };
    }, [intervalTimePeriod, intervalText]);

    return (
      <div>
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
        <EuiFormRow label="Start time">
          <EuiDatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={recurringDailyTime}
            onChange={handleRecurringDailyTime}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </EuiFormRow>
      </div>
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
      reportDefinitionRequest.trigger.trigger_params.schedule.cron.expression = e.target.value;
    };

    useEffect(() => {
      let cron = {
        cron: {
          expression: cronExpression,
          timezone: timezone,
        },
      };
      reportDefinitionRequest.trigger.trigger_params = {
        ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: Date.now().valueOf(),
        schedule: cron,
      };
    }, [cronExpression, timezone]);

    useEffect(() => {
      if (edit) {
        httpClientProps
        .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
        .then(async (response) => {
          if (response.report_definition.trigger.trigger_params.schedule_type === 'Cron based') {
            setCronExpression(response.report_definition.trigger.trigger_params.schedule.cron.expression);
          }
        })
      }
    }, [])

    return (
      <div>
        <EuiFormRow
          label="Custom cron expression"
          labelAppend={
            <EuiText size="xs">
              <EuiLink href="https://opendistro.github.io/for-elasticsearch-docs/docs/alerting/cron/">
                Cron help
              </EuiLink>
            </EuiText>
          }
        >
          <EuiFieldText
            placeholder={'Ex: 0 0 12 * * ? (Fire at 12:00 PM (noon) every day)'}
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
        <EuiSpacer />
        {display_daily}
        {display_interval}
        {display_weekly}
        {display_monthly}
      </div>
    );
  };

  const ScheduleTrigger = () => {
    const display_recurring =
      scheduleType === 'Recurring' ? <ScheduleTriggerRecurring /> : null;

    const display_cron =
      scheduleType === 'Cron based' ? <CronExpression /> : null;

    useEffect(() => {
      // Set default trigger_type
      SCHEDULE_TYPE_OPTIONS.map((item) => {
        if (item.id === scheduleType) {
          reportDefinitionRequest.trigger.trigger_params = {
            ...reportDefinitionRequest.trigger.trigger_params,
            schedule_type: item.label,
            //TODO: need better handle
            enabled: true,
          };
        }
      });
    }, [scheduleType]);

    return (
      <div>
        <EuiFormRow label="Request time">
          <EuiRadioGroup
            options={SCHEDULE_TYPE_OPTIONS}
            idSelected={scheduleType}
            onChange={handleScheduleType}
          />
        </EuiFormRow>
        <EuiSpacer />
        {display_recurring}
        {display_cron}
      </div>
    );
  };

  const schedule =
    reportTriggerType === 'Schedule' ? <ScheduleTrigger /> : null;

  const defaultEditTriggerType = (trigger_type) => {
    let index = 0;
    for (index; index < TRIGGER_TYPE_OPTIONS.length; ++index) {
      if (TRIGGER_TYPE_OPTIONS[index].label === trigger_type) {
        setReportTriggerType(TRIGGER_TYPE_OPTIONS[index].id);
      }
    }
  };

  const defaultEditRequestType = (trigger) => {
    let index = 0;
    for (index; index < SCHEDULE_TYPE_OPTIONS.length; ++index) {
      if (SCHEDULE_TYPE_OPTIONS[index].label === trigger.trigger_params.schedule_type) {
        setScheduleType(SCHEDULE_TYPE_OPTIONS[index].id);
      }
    }
  };

  const defaultEditScheduleFrequency = (trigger_params) => {
    if (trigger_params.schedule_type === 'Recurring') {
      if (trigger_params.schedule.interval.unit === 'DAYS') {
        setScheduleRecurringFrequency('daily');
      }
      else {
        setScheduleRecurringFrequency('byInterval');
      }
    }
    else if (trigger_params.schedule_type === 'Cron based') {

    }
  }

  const defaultConfigurationEdit = (trigger) => {
    defaultEditTriggerType(trigger.trigger_type);
    defaultEditRequestType(trigger);
    if (trigger.trigger_type === 'Schedule') {
      defaultEditScheduleFrequency(trigger.trigger_params);
    }
  };

  useEffect(() => {
    if (edit) {
      httpClientProps
        .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
        .then(async (response) => {
          defaultConfigurationEdit(response.report_definition.trigger);
          reportDefinitionRequest.trigger = response.report_definition.trigger;
        })
        .then(() => {
          console.log("report defintiion request after useeffect edit is", reportDefinitionRequest);
        })
    }
    // Set default trigger_type for create new report definition 
    else {
      TRIGGER_TYPE_OPTIONS.map((item) => {
      if (item.id === reportTriggerType) {
        reportDefinitionRequest.trigger.trigger_type = item.label;
      }
    });    
    }

  }, []);

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
            options={TRIGGER_TYPE_OPTIONS}
            idSelected={reportTriggerType}
            onChange={handleReportTriggerType}
          />
        </EuiFormRow>
        <EuiSpacer />
        {schedule}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
