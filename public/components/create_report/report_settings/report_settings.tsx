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
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiButton,
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiHorizontalRule,
  EuiText,
  EuiSpacer, EuiRadioGroup, EuiSelect, EuiDatePickerRange, EuiDatePicker, EuiForm, EuiCheckbox
} from '@elastic/eui';
import moment from 'moment';

const report_source_radios = [
  {
    id: 'dashboard_report_source',
    label: 'Dashboard'
  },
  {
    id: 'visualization_report_source',
    label: 'Visualization'
  },
  {
    id: 'saved_search_report_source',
    label: 'Saved query'
  }
]

const report_source_dashboard_options = [
  {
    value: 'daily saves',
    text: 'Daily saves'
  },
  {
    value: 'web logs',
    text: 'Web logs'
  },
  {
    value: 'flight traffic',
    text: 'Flight traffic'
  }
]

const report_source_visualization_options = [
  {
    value: 'vis 1',
    text: 'Vis 1'
  },
  {
    value: 'vis 2',
    text: 'Vis 2'
  },
  {
    value: 'vis 3',
    text: 'Vis 3'
  }
]

const report_source_saved_search_options = [
  {
    value: 'saved search 1',
    text: 'Saved search 1'
  },
  {
    value: 'saved search 2',
    text: 'Saved search 2'
  }
]

const pdf_png_file_format_options = [
  {
    id: 'pdf_format',
    label: 'PDF'
  },
  {
    id: 'png_format',
    label: 'PNG'
  }
]

const saved_search_format_options = [
  {
    id: 'csv_format',
    label: 'CSV'
  },
  {
    id: 'xls_format',
    label: 'XLS'
  }
]

export function ReportSettings(props) {
  
  // const { reportSettingsDashboard, onChangeReportSettingsDashboard } = props;

  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSourceId, setReportSourceId] = useState('dashboard_report_source');
  const [dashboardSourceSelect, setDashboardSourceSelect] = useState(report_source_dashboard_options[0].value);
  const [visualizationSourceSelect, setVisualizationSourceSelect] = useState(report_source_visualization_options[0].value);
  const [savedSearchSourceSelect, setSavedSearchSourceSelect] = useState(report_source_saved_search_options[0].value);
  const [timeRangeStartTime, setTimeRangeStartTime] = useState(moment());
  const [timeRangeEndTime, setTimeRangeEndTime] = useState(moment());
  const [fileFormat, setFileFormat] = useState('pdf_format');
  const [savedSearchFileFormat, setSavedSearchFileFormat] = useState('csv_format');
  const [includeHeader, setIncludeHeader] = useState(false);
  const [includeFooter, setIncludeFooter] = useState(false);

  const onChangeReportName =e => {
    setReportName(e.target.value);
  }

  const onChangeReportDescription = e => {
    setReportDescription(e.target.value);
  }

  const onChangeReportSource = e => {
    setReportSourceId(e);
  }

  const onChangeDashboardSelect = e => {
    setDashboardSourceSelect(e.target.value);
  }

  const onChangeVisualizationSelect = e => {
    setVisualizationSourceSelect(e.target.value);
  }

  const onChangeSavedSearchSelect = e => {
    setSavedSearchSourceSelect(e.target.value);
  }

  const onChangeStartTime = e => {
    setTimeRangeStartTime(e);
  }

  const onChangeEndTime = e => {
    setTimeRangeEndTime(e);
  }

  const onChangeFileFormat = e => {
    setFileFormat(e);
  }

  const onChangeSavedSearchFileFormat = e => {
    setSavedSearchFileFormat(e);
  }

  const onChangeIncludeHeader = e => {
    setIncludeHeader(e.target.checked);
  }

  const onChangeIncludeFooter = e => {
    setIncludeFooter(e.target.checked);
  }

  const TimeRangeSelect = () => {
    return (
      <div>
        <EuiFormRow label="Time range" helpText="Time range is relative to the report creation date on the report trigger">
          <EuiDatePickerRange
            startDateControl={
              <EuiDatePicker
                selected={timeRangeStartTime}
                onChange={onChangeStartTime}
                startDate={timeRangeStartTime}
                endDate={timeRangeEndTime}
                isInvalid={timeRangeStartTime > timeRangeEndTime}
                aria-label="Start date"
                showTimeSelect
              />
            }
            endDateControl={
              <EuiDatePicker
                selected={timeRangeEndTime}
                onChange={onChangeEndTime}
                startDate={timeRangeStartTime}
                endDate={timeRangeEndTime}
                isInvalid={timeRangeStartTime > timeRangeEndTime}
                aria-label="End date"
                showTimeSelect
              />
            }
          />
        </EuiFormRow>
      </div>
    )
  }

  const PDFandPNGFileFormats = () => {
    return (
      <div>
        <EuiFormRow label="File format">
          <EuiRadioGroup
            options={pdf_png_file_format_options}
            idSelected={fileFormat}
            onChange={onChangeFileFormat}
          />
        </EuiFormRow>
        <EuiSpacer/>
        <EuiCheckbox
          id="include-header-checkbox"
          label="Include header"
          checked={includeHeader}
          onChange={onChangeIncludeHeader}
        />
        <EuiSpacer/>
        <EuiCheckbox
          id="include-footer-checkbox"
          label="Include footer"
          checked={includeFooter}
          onChange={onChangeIncludeFooter}
        />
      </div>
    )
  }

  const ReportSourceDashboard = () => {
    return (
      <div>
        <EuiFormRow label="Select dashboard">
          <EuiSelect
            id="reportSourceDashboardSelect"
            options={report_source_dashboard_options}
            value={dashboardSourceSelect}
            onChange={onChangeDashboardSelect}
          />
        </EuiFormRow>
        <EuiSpacer/>
        <TimeRangeSelect/>
        <EuiSpacer/>
        <PDFandPNGFileFormats/>
      </div>
    )
  }

  const ReportSourceVisualization = () => {
    return (
      <div>
        <EuiFormRow label="Select visualization">
          <EuiSelect
            id="reportSourceVisualizationSelect"
            options={report_source_visualization_options}
            value={visualizationSourceSelect}
            onChange={onChangeVisualizationSelect}
          />
        </EuiFormRow>
        <EuiSpacer/>
        <TimeRangeSelect/>
        <EuiSpacer/>
        <PDFandPNGFileFormats/>
      </div>
    )
  }

  const ReportSourceSavedSearch = () => {
    return (
      <div>
        <EuiFormRow label="Select saved search">
          <EuiSelect
            id="reportSourceSavedSearchSelect"
            options={report_source_saved_search_options}
            value={savedSearchSourceSelect}
            onChange={onChangeSavedSearchSelect}
          />
        </EuiFormRow>
        <EuiSpacer/>
        <TimeRangeSelect/>
        <EuiSpacer/>
        <EuiFormRow label="File format">
          <EuiRadioGroup
            options={saved_search_format_options}
            idSelected={savedSearchFileFormat}
            onChange={onChangeSavedSearchFileFormat}
          />
        </EuiFormRow>
      </div>
    )
  }

  const display_dashboard_select = (reportSourceId === 'dashboard_report_source')
    ? <ReportSourceDashboard/>
    : null;

  const display_visualization_select = (reportSourceId === 'visualization_report_source')
    ? <ReportSourceVisualization/>
    : null;

  const display_saved_search_select = (reportSourceId === 'saved_search_report_source')
    ? <ReportSourceSavedSearch/>
    : null;

  return(
    <EuiPageContent panelPaddingSize={"l"}>
      <EuiPageHeader>
        <EuiTitle>
            <h2>Report Settings</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule/>
      <EuiPageContentBody>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Name" helpText="Valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen) and (space)">
              <EuiFieldText
                placeholder="Report name"
                value={reportName}
                onChange={onChangeReportName}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup style={{ maxWidth: 600 }}>
          <EuiFlexItem>
            <EuiFormRow label="Description" helpText="Optional">
              <EuiFieldText
                placeholder="Describe this report"
                value={reportDescription}
                onChange={onChangeReportDescription}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer/>
        <EuiFormRow label="Report source" helpText="Where is the report generated from">
          <EuiRadioGroup
            options={report_source_radios}
            idSelected={reportSourceId}
            onChange={onChangeReportSource}
          />
        </EuiFormRow>
        <EuiSpacer/>
        {display_dashboard_select}
        {display_visualization_select}
        {display_saved_search_select}
        <EuiSpacer/>
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
