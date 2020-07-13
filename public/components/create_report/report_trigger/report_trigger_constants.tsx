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

export const report_type_options = [
  {
    id: 'schedule_option',
    label: 'Schedule based',
  },
  {
    id: 'alert_option',
    label: 'Alert based',
  },
];

export const schedule_request_time_options = [
  {
    id: 'now_option',
    label: 'Now',
  },
  {
    id: 'future_date_option',
    label: 'Future date',
  },
  {
    id: 'recurring_option',
    label: 'Recurring',
  },
  {
    id: 'cron_based_option',
    label: 'Cron based',
  },
];

export const schedule_recurring_options = [
  {
    value: 'daily',
    text: 'Daily',
  },
  {
    value: 'by_interval',
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

export const interval_time_periods = [
  {
    value: 'minutes',
    text: 'Minutes',
  },
  {
    value: 'hours',
    text: 'Hours',
  },
];

export const weekly_checkbox_options = [
  {
    id: 'mon_checkbox',
    label: 'Mon',
  },
  {
    id: 'tue_checkbox',
    label: 'Tue',
  },
  {
    id: 'wed_checkbox',
    label: 'Wed',
  },
  {
    id: 'thu_checkbox',
    label: 'Thu',
  },
  {
    id: 'fri_checkbox',
    label: 'Fri',
  },
  {
    id: 'sat_checkbox',
    label: 'Sat',
  },
  {
    id: 'sun_checkbox',
    label: 'Sun',
  },
];

export const monthly_on_the_options = [
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

export const monthly_day_select_options = [
  {
    value: 'day',
    text: 'Day',
  },
  {
    value: 'weekday',
    text: 'Weekday',
  },
  {
    value: 'weekend_day',
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
