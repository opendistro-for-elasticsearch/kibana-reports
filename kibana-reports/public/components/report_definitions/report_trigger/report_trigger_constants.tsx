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

import moment from 'moment-timezone';

export const TRIGGER_TYPE_OPTIONS = [
  {
    id: 'On demand',
    label: 'On demand',
  },
  {
    id: 'Schedule',
    label: 'Schedule',
  },
];

export const SCHEDULE_TYPE_OPTIONS = [
  {
    id: 'Recurring',
    label: 'Recurring',
  },
  {
    id: 'Cron based',
    label: 'Cron-based',
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
  // TODO: disable on UI. Add them back once we support
//   {
//     value: 'weekly',
//     text: 'Weekly',
//   },
//   {
//     value: 'monthly',
//     text: 'Monthly',
//   },
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
];

export const TIMEZONE_OPTIONS = moment.tz
  .names()
  .map((tz) => ({ value: tz, text: tz }));
