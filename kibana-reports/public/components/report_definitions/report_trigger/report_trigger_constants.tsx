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

export const TRIGGER_TYPE_OPTIONS = [
  {
    id: 'onDemandOption',
    label: 'On demand',
  },
  {
    id: 'scheduleOption',
    label: 'Schedule',
  },
];

export const SCHEDULE_TYPE_OPTIONS = [
  {
    id: 'recurringOption',
    label: 'Recurring',
  },
  {
    id: 'cronBasedOption',
    label: 'Cron based',
  },
];

export const SCHEDULE_RECURRING_OPTIONS = [
  {
    value: 'daily',
    text: 'Daily',
  },
  {
    value: 'byInterval',
    text: 'By interval',
  },
  {
    value: 'weekly',
    text: 'Weekly',
  },
  {
    value: 'monthly',
    text: 'Monthly',
  },
];

export const INTERVAL_TIME_PERIODS = [
  {
    value: 'MINUTES',
    text: 'Minutes',
  },
  {
    value: 'HOURS',
    text: 'Hours',
  },
  {
    value: 'DAYS',
    text: 'Days',
  },
];

export const WEEKLY_CHECKBOX_OPTIONS = [
  {
    id: 'monCheckbox',
    label: 'Mon',
  },
  {
    id: 'tueCheckbox',
    label: 'Tue',
  },
  {
    id: 'wedCheckbox',
    label: 'Wed',
  },
  {
    id: 'thuCheckbox',
    label: 'Thu',
  },
  {
    id: 'friCheckbox',
    label: 'Fri',
  },
  {
    id: 'satCheckbox',
    label: 'Sat',
  },
  {
    id: 'sunCheckbox',
    label: 'Sun',
  },
];

export const MONTHLY_ON_THE_OPTIONS = [
  {
    value: 'day',
    text: 'Day',
  },
  {
    value: 'first',
    text: 'First',
  },
  {
    value: 'second',
    text: 'Second',
  },
  {
    value: 'third',
    text: 'Third',
  },
  {
    value: 'fourth',
    text: 'Fourth',
  },
  {
    value: 'last',
    text: 'Last',
  },
];

export const MONTHLY_DAY_SELECT_OPTIONS = [
  {
    value: 'day',
    text: 'Day',
  },
  {
    value: 'weekday',
    text: 'Weekday',
  },
  {
    value: 'weekendDay',
    text: 'Weekend day',
  },
  {
    value: 'sunday',
    text: 'Sunday',
  },
  {
    value: 'monday',
    text: 'Monday',
  },
  {
    value: 'tuesday',
    text: 'Tuesday',
  },
  {
    value: 'wednesday',
    text: 'Wednesday',
  },
  {
    value: 'thursday',
    text: 'Thursday',
  },
  {
    value: 'friday',
    text: 'Friday',
  },
  {
    value: 'saturday',
    text: 'Saturday',
  },
];

export const SCHEDULE_OPTION_MAP = {
  recurringOption: 'Recurring',
  cronBasedOption: 'Cron',
};

export const TRIGGER_TYPE = {
  scheduleOption: 'Schedule',
  alertOption: 'Alert',
  onDemandOption: 'On demand',
};

//TODO: need to figure out what kind of timezone to use for both display and scheduler
export const TIMEZONE_OPTIONS = [
  { value: 'EST', text: 'EST US/Eastern' },
  { value: 'PST8PDT', text: 'PST US/Pacific' },
];
