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
  EuiCheckbox,
  EuiSuperDatePicker,
  EuiTextArea,
} from '@elastic/eui';
import moment from 'moment';
import {
  REPORT_SOURCE_VISUALIZATION_OPTIONS,
  REPORT_SOURCE_DASHBOARD_OPTIONS,
  REPORT_SOURCE_SAVED_SEARCH_OPTIONS,
} from './report_settings_test_data';
import {
  REPORT_SOURCE_RADIOS,
  PDF_PNG_FILE_FORMAT_OPTIONS,
  SAVED_SEARCH_FORMAT_OPTIONS,
} from './report_settings_constants';
import dateMath from '@elastic/datemath';

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

  isValidTimeRange(dateMath.parse(start), 'start');
  isValidTimeRange(dateMath.parse(end, { roundUp: true }), 'end');

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
  const [reportSourceId, setReportSourceId] = useState('dashboardReportSource');
  const [dashboardSourceSelect, setDashboardSourceSelect] = useState(
    REPORT_SOURCE_DASHBOARD_OPTIONS[0].value
  );
  const [visualizationSourceSelect, setVisualizationSourceSelect] = useState(
    REPORT_SOURCE_VISUALIZATION_OPTIONS[0].value
  );
  const [savedSearchSourceSelect, setSavedSearchSourceSelect] = useState(
    REPORT_SOURCE_SAVED_SEARCH_OPTIONS[0].value
  );
  const [fileFormat, setFileFormat] = useState('pdfFormat');
  const [savedSearchFileFormat, setSavedSearchFileFormat] = useState(
    'csvFormat'
  );
  const [includeHeader, setIncludeHeader] = useState(false);
  const [includeFooter, setIncludeFooter] = useState(false);

  const handleReportName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportName(e.target.value);
  };

  const handleReportDescription = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportDescription(e.target.value);
  };

  const handleReportSource = (e: React.SetStateAction<string>) => {
    setReportSourceId(e);
  };

  const handleDashboardSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDashboardSourceSelect(e.target.value);
  };

  const handleVisualizationSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setVisualizationSourceSelect(e.target.value);
  };

  const handleSavedSearchSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSavedSearchSourceSelect(e.target.value);
  };

  const handleFileFormat = (e: React.SetStateAction<string>) => {
    setFileFormat(e);
  };

  const handleSavedSearchFileFormat = (e: React.SetStateAction<string>) => {
    setSavedSearchFileFormat(e);
  };

  const handleIncludeHeader = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setIncludeHeader(e.target.checked);
  };

  const handleIncludeFooter = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setIncludeFooter(e.target.checked);
  };

  const HeaderAndFooter = () => {
    const [header, setHeader] = useState('');
    const [footer, setFooter] = useState('');

    const handleHeader = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setHeader(e.target.value);
    };

    const handleFooter = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setFooter(e.target.value);
    };

    const showHeader = includeHeader ? (
      <EuiTextArea
        placeholder="Header text"
        value={header}
        onChange={handleHeader}
      />
    ) : null;

    const showFooter = includeFooter ? (
      <EuiTextArea
        placeholder="Footer text"
        value={footer}
        onChange={handleFooter}
      />
    ) : null;

    return (
      <div>
        <EuiCheckbox
          id="includeHeaderCheckbox"
          label="Include header"
          checked={includeHeader}
          onChange={handleIncludeHeader}
        />
        {showHeader}
        <EuiSpacer />
        <EuiCheckbox
          id="includeFooterCheckbox"
          label="Include footer"
          checked={includeFooter}
          onChange={handleIncludeFooter}
        />
        {showFooter}
      </div>
    );
  };

  const PDFandPNGFileFormats = () => {
    return (
      <div>
        <EuiFormRow label="File format">
          <EuiRadioGroup
            options={PDF_PNG_FILE_FORMAT_OPTIONS}
            idSelected={fileFormat}
            onChange={handleFileFormat}
          />
        </EuiFormRow>
        <EuiSpacer />
        <HeaderAndFooter />
      </div>
    );
  };

  const ReportSourceDashboard = () => {
    return (
      <div>
        <EuiFormRow label="Select dashboard">
          <EuiSelect
            id="reportSourceDashboardSelect"
            options={REPORT_SOURCE_DASHBOARD_OPTIONS}
            value={dashboardSourceSelect}
            onChange={handleDashboardSelect}
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
            options={REPORT_SOURCE_VISUALIZATION_OPTIONS}
            value={visualizationSourceSelect}
            onChange={handleVisualizationSelect}
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
            options={REPORT_SOURCE_SAVED_SEARCH_OPTIONS}
            value={savedSearchSourceSelect}
            onChange={handleSavedSearchSelect}
          />
        </EuiFormRow>
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <EuiFormRow label="File format">
          <EuiRadioGroup
            options={SAVED_SEARCH_FORMAT_OPTIONS}
            idSelected={savedSearchFileFormat}
            onChange={handleSavedSearchFileFormat}
          />
        </EuiFormRow>
      </div>
    );
  };

  const displayDashboardSelect =
    reportSourceId === 'dashboardReportSource' ? (
      <ReportSourceDashboard />
    ) : null;

  const displayVisualizationSelect =
    reportSourceId === 'visualizationReportSource' ? (
      <ReportSourceVisualization />
    ) : null;

  const displaySavedSearchSelect =
    reportSourceId === 'savedSearchReportSource' ? (
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
                onChange={handleReportName}
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
                onChange={handleReportDescription}
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
            options={REPORT_SOURCE_RADIOS}
            idSelected={reportSourceId}
            onChange={handleReportSource}
          />
        </EuiFormRow>
        <EuiSpacer />
        {displayDashboardSelect}
        {displayVisualizationSelect}
        {displaySavedSearchSelect}
        <EuiSpacer />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
