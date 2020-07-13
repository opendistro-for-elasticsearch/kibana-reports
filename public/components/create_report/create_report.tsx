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
  EuiButtonEmpty,
  EuiDatePicker,
  EuiSelect,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiButton,
  EuiPage,
  EuiTitle,
  EuiPageBody,
  EuiSpacer,
  EuiRadioGroup,
} from '@elastic/eui';
import { htmlIdGenerator } from '@elastic/eui/lib/services';
import moment, { Moment } from 'moment';
import { ReportSettings } from './report_settings/report_settings';
import { ReportDelivery } from './delivery/delivery';
import { ReportSchedule } from './schedule/schedule';

const idPrefix = htmlIdGenerator()();

const recurringDayOptions = [
  { value: 'Monday', text: 'Monday' },
  { value: 'Tuesday', text: 'Tuesday' },
  { value: 'Wednesday', text: 'Wednesday' },
  { value: 'Thursday', text: 'Thursday' },
  { value: 'Friday', text: 'Friday' },
  { value: 'Saturday', text: 'Saturday' },
  { value: 'Sunday', text: 'Sunday' },
];

const timezone_options = [
  { value: -4, text: 'EDT -04:00' },
  { value: -5, text: 'CDT -05:00' },
  { value: -6, text: 'MDT -06:00' },
  { value: -7, text: 'MST/PDT -07:00' },
  { value: -8, text: 'AKDT -08:00' },
  { value: -10, text: 'HST -10:00' },
];

function ScheduleRecurringFrequency() {
  const [scheduleRecurringFrequency, setScheduleRecurringFrequency] = useState(
    'Daily'
  );
  const [scheduleRecurringStartDate, setScheduleRecurringStartDate] = useState(
    moment()
  );
  const [scheduleRecurringUTCOffset, setScheduleRecurringUTCOffset] = useState(
    0
  );
  const [
    scheduleRecurringWeeklyDayOfWeek,
    setScheduleRecurringWeeklyDayOfWeek,
  ] = useState('Monday');

  const options = [
    { value: 'Daily', text: 'Daily' },
    { value: 'Weekly', text: 'Weekly' },
    { value: 'Monthly', text: 'Monthly' },
  ];

  const onChangeScheduleRecurringFrequency = (e) => {
    setScheduleRecurringFrequency(e.target.value);
  };

  const ScheduleRecurringDailyInput = () => {
    const handleTimeChange = (date) => {
      setScheduleRecurringStartDate(date);
    };

    const onSelectOffsetChange = (e) => {
      setScheduleRecurringUTCOffset(parseInt(e.target.value, 10));
    };

    return (
      <div>
        <EuiFormRow label="Around">
          <EuiDatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={scheduleRecurringStartDate}
            onChange={handleTimeChange}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </EuiFormRow>
        <EuiFormRow label="UTC offset">
          <EuiSelect
            options={timezone_options}
            value={scheduleRecurringUTCOffset}
            onChange={onSelectOffsetChange}
          />
        </EuiFormRow>
      </div>
    );
  };

  const ScheduleRecurringWeeklyInput = () => {
    const onChangeDayOfWeek = (e: React.MouseEvent<>) => {
      setScheduleRecurringWeeklyDayOfWeek(e.target.value);
    };

    return (
      <div>
        <EuiFormRow label="Every">
          <EuiSelect
            options={recurringDayOptions}
            value={scheduleRecurringWeeklyDayOfWeek}
            onChange={onChangeDayOfWeek}
          />
        </EuiFormRow>
        <ScheduleRecurringDailyInput />
      </div>
    );
  };

  const ScheduleRecurringMonthlyInput = () => {
    const handleChangeMonthly = (date) => {
      setScheduleRecurringStartDate(date);
    };
    return (
      <div>
        <EuiFormRow label="On">
          <EuiDatePicker
            showTimeSelect
            selected={scheduleRecurringStartDate}
            onChange={handleChangeMonthly}
            minDate={moment()}
            maxDate={moment().endOf('month')}
          />
        </EuiFormRow>
      </div>
    );
  };

  let frequency = null;
  switch (scheduleRecurringFrequency) {
    case 'Daily':
      frequency = <ScheduleRecurringDailyInput />;
      break;
    case 'Weekly':
      frequency = <ScheduleRecurringWeeklyInput />;
      break;
    case 'Monthly':
      frequency = <ScheduleRecurringMonthlyInput />;
      break;
  }

  return (
    <div>
      <EuiFormRow label="Frequency">
        <EuiSelect
          options={options}
          value={scheduleRecurringFrequency}
          onChange={onChangeScheduleRecurringFrequency}
        />
      </EuiFormRow>
      {frequency}
    </div>
  );
}

function ScheduleFutureDatePicker() {
  const [scheduleFutureDate, setScheduleFutureDate] = useState(moment());
  const [scheduleUTCOffset, setScheduleUTCOffset] = useState(0);

  const handleChangeScheduleDate = (date) => {
    setScheduleFutureDate(date);
  };

  const onSelectOffsetChange = (e) => {
    setScheduleUTCOffset(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <EuiFormRow label="Time select on">
        <EuiDatePicker
          showTimeSelect
          selected={scheduleFutureDate}
          onChange={handleChangeScheduleDate}
        />
      </EuiFormRow>
      <EuiFormRow label="UTC offset">
        <EuiSelect
          options={timezone_options}
          value={scheduleUTCOffset}
          onChange={onSelectOffsetChange}
        />
      </EuiFormRow>
    </div>
  );
}

export function CreateReport() {
  // todo: simplify useState
  const [reportSettingsDashboard, setReportSettingsDashboard] = useState('');
  const [deliveryEmailSubject, setDeliveryEmailSubject] = useState('');
  const [deliveryEmailBody, setDeliveryEmailBody] = useState('');
  const [
    scheduleRadioFutureDateSelected,
    setScheduleRadioFutureDateSelected,
  ] = useState(false);
  const [
    scheduleRadioRecurringSelected,
    setScheduleRadioRecurringSelected,
  ] = useState(false);
  const [scheduleRadioIdSelected, setScheduleRadioIdSelected] = useState(
    `${idPrefix}7`
  );

  const onChangeReportSettingsDashboard = (e) => {
    setReportSettingsDashboard(e.target.value);
  };

  const onChangeDeliveryEmailSubject = (e) => {
    setDeliveryEmailSubject(e.target.value);
  };

  const onChangeDeliveryEmailBody = (e) => {
    setDeliveryEmailBody(e.target.value);
  };

  const onChangeScheduleSettingsRadio = (optionId) => {
    setScheduleRadioIdSelected(optionId);
    if (optionId === `${idPrefix}7`) {
      setScheduleRadioFutureDateSelected(false);
      setScheduleRadioRecurringSelected(false);
    } else if (optionId === `${idPrefix}8`) {
      setScheduleRadioFutureDateSelected(true);
      setScheduleRadioRecurringSelected(false);
    } else if (optionId === `${idPrefix}9`) {
      setScheduleRadioFutureDateSelected(false);
      setScheduleRadioRecurringSelected(true);
    }
  };

  const ScheduleRadio = () => {
    const radios = [
      {
        id: `${idPrefix}7`,
        label: 'Now',
      },
      {
        id: `${idPrefix}8`,
        label: 'Future Date',
      },
      {
        id: `${idPrefix}9`,
        label: 'Recurring',
      },
    ];
    return (
      <EuiRadioGroup
        options={radios}
        idSelected={scheduleRadioIdSelected}
        onChange={onChangeScheduleSettingsRadio}
        name="scheduleRadioGroup"
      />
    );
  };

  const scheduleFutureDateCalendar = scheduleRadioFutureDateSelected ? (
    <ScheduleFutureDatePicker />
  ) : null;

  const scheduleRecurringFrequencySelect = scheduleRadioRecurringSelected ? (
    <ScheduleRecurringFrequency />
  ) : null;

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle>
          <h1>Create report definition</h1>
        </EuiTitle>
        <EuiSpacer/>
        <ReportSettings
          reportSettingsDashboard={reportSettingsDashboard}
          onChangeReportSettingsDashboard={onChangeReportSettingsDashboard}
        />
        <EuiSpacer />
        <ReportDelivery
          deliveryEmailSubject={deliveryEmailSubject}
          onChangeDeliveryEmailSubject={onChangeDeliveryEmailSubject}
          deliveryEmailBody={deliveryEmailBody}
          onChangeDeliveryEmailBody={onChangeDeliveryEmailBody}
        />
        <EuiSpacer />
        <ReportSchedule
          ScheduleRadio={ScheduleRadio}
          scheduleFutureDateCalendar={scheduleFutureDateCalendar}
          scheduleRecurringFrequencySelect={scheduleRecurringFrequencySelect}
        />
        <EuiSpacer />
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              onClick={() => {
                window.location.assign('opendistro_kibana_reports#/');
              }}
            >
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton fill>Create</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageBody>
    </EuiPage>
  );
}
