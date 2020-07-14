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
  EuiSpacer,
  EuiRadioGroup,
  EuiSelect,
  EuiDatePickerRange,
  EuiDatePicker,
  EuiForm,
  EuiCheckbox,
  EuiSuperDatePicker, EuiTextArea
} from '@elastic/eui';
import moment from 'moment';
import {
  report_source_visualization_options,
  report_source_dashboard_options,
  report_source_saved_search_options,
} from './report_settings_test_data';
import {
  report_source_radios,
  pdf_png_file_format_options,
  saved_search_format_options,
} from './report_settings_constants';
import dateMath from '@elastic/datemath';

function TimeRangeSelect() {
  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState('now-30m');
  const [end, setEnd] = useState('now');
  const [isPaused, setIsPaused] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState();

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

  const startMoment = dateMath.parse(start);
  // dateMath.parse is inconsistent with unparsable strings.
  // Sometimes undefined is returned, other times an invalid moment is returned
  if (!startMoment || !startMoment.isValid()) {
    throw new Error('Unable to parse start string');
  }

  // Pass roundUp when parsing end string
  const endMoment = dateMath.parse(end, { roundUp: true });
  if (!endMoment || !endMoment.isValid() || endMoment > moment()) {
    throw new Error('Unable to parse end string');
  }

  return (
    <div>
      <EuiFormRow
        label="Time range"
        helpText="Time range is relative to the report creation date on the report trigger"
      >
        <EuiSuperDatePicker
          isLoading={isLoading}
          start={start}
          end={end}
          onTimeChange={onTimeChange}
          onRefresh={onRefresh}
          isPaused={isPaused}
          refreshInterval={refreshInterval}
          onRefreshChange={onRefreshChange}
          recentlyUsedRanges={recentlyUsedRanges}
          commonlyUsedRanges={[]}
        />
      </EuiFormRow>
    </div>
  );
}

export function ReportSettings() {
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSourceId, setReportSourceId] = useState(
    'dashboard_report_source'
  );
  const [dashboardSourceSelect, setDashboardSourceSelect] = useState(
    report_source_dashboard_options[0].value
  );
  const [visualizationSourceSelect, setVisualizationSourceSelect] = useState(
    report_source_visualization_options[0].value
  );
  const [savedSearchSourceSelect, setSavedSearchSourceSelect] = useState(
    report_source_saved_search_options[0].value
  );
  const [fileFormat, setFileFormat] = useState('pdf_format');
  const [savedSearchFileFormat, setSavedSearchFileFormat] = useState(
    'csv_format'
  );
  const [includeHeader, setIncludeHeader] = useState(false);
  const [includeFooter, setIncludeFooter] = useState(false);
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');

  const onChangeReportName = (e) => {
    setReportName(e.target.value);
  };

  const onChangeReportDescription = (e) => {
    setReportDescription(e.target.value);
  };

  const onChangeReportSource = (e) => {
    setReportSourceId(e);
  };

  const onChangeDashboardSelect = (e) => {
    setDashboardSourceSelect(e.target.value);
  };

  const onChangeVisualizationSelect = (e) => {
    setVisualizationSourceSelect(e.target.value);
  };

  const onChangeSavedSearchSelect = (e) => {
    setSavedSearchSourceSelect(e.target.value);
  };

  const onChangeFileFormat = (e) => {
    setFileFormat(e);
  };

  const onChangeSavedSearchFileFormat = (e) => {
    setSavedSearchFileFormat(e);
  };

  const onChangeIncludeHeader = (e) => {
    setIncludeHeader(e.target.checked);
  };

  const onChangeIncludeFooter = (e) => {
    setIncludeFooter(e.target.checked);
  };

  const onChangeHeader = (e) => {
    setHeader(e.target.value);
  }

  const onChangeFooter = (e) => {
    setFooter(e.target.value);
  }

  const HeaderAndFooter = () => {
    const show_header = (includeHeader)
      ? (
        <EuiTextArea
          placeholder="Header text"
          value={header}
          onChange={onChangeHeader}
        />
      )
      : null;

    const show_footer = (includeFooter)
      ? (
        <EuiTextArea
          placeholder="Footer text"
          value={footer}
          onChange={onChangeFooter}
        />
      )
      : null;

    return (
      <div>
        <EuiCheckbox
          id="include-header-checkbox"
          label="Include header"
          checked={includeHeader}
          onChange={onChangeIncludeHeader}
        />
        {show_header}
        <EuiSpacer />
        <EuiCheckbox
          id="include-footer-checkbox"
          label="Include footer"
          checked={includeFooter}
          onChange={onChangeIncludeFooter}
        />
        {show_footer}
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
        <EuiSpacer />
        <HeaderAndFooter/>
      </div>
    );
  };

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
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <PDFandPNGFileFormats />
      </div>
    );
  };

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
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <PDFandPNGFileFormats />
      </div>
    );
  };

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
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <EuiFormRow label="File format">
          <EuiRadioGroup
            options={saved_search_format_options}
            idSelected={savedSearchFileFormat}
            onChange={onChangeSavedSearchFileFormat}
          />
        </EuiFormRow>
      </div>
    );
  };

  const display_dashboard_select =
    reportSourceId === 'dashboard_report_source' ? (
      <ReportSourceDashboard />
    ) : null;

  const display_visualization_select =
    reportSourceId === 'visualization_report_source' ? (
      <ReportSourceVisualization />
    ) : null;

  const display_saved_search_select =
    reportSourceId === 'saved_search_report_source' ? (
      <ReportSourceSavedSearch />
    ) : null;

  return (
    <EuiPageContent panelPaddingSize={'l'}>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Report Settings</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule />
      <EuiPageContentBody>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow
              label="Name"
              helpText="Valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen) and (space)"
            >
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
        <EuiSpacer />
        <EuiFormRow
          label="Report source"
          helpText="Where is the report generated from"
        >
          <EuiRadioGroup
            options={report_source_radios}
            idSelected={reportSourceId}
            onChange={onChangeReportSource}
          />
        </EuiFormRow>
        <EuiSpacer />
        {display_dashboard_select}
        {display_visualization_select}
        {display_saved_search_select}
        <EuiSpacer />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
