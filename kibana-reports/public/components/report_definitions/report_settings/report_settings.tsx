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
  EuiPage, 
  EuiCheckboxGroup
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
  HEADER_FOOTER_CHECKBOX
} from './report_settings_constants';
import dateMath from '@elastic/datemath';
import Showdown from 'showdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

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
        helpText="Time range is relative to the report creation date on the report trigger."
      >
        <EuiSuperDatePicker
          isDisabled={false}
          isLoading={isLoading}
          start={start}
          end={end}
          onTimeChange={onTimeChange}
          onRefresh={onRefresh}
          isPaused={isPaused}
          refreshInterval={refreshInterval}
          onRefreshChange={onRefreshChange}
          recentlyUsedRanges={recentlyUsedRanges}
          // commonlyUsedRanges={[]}
          showUpdateButton={false}
          // isAutoRefreshOnly={true}
        />
      </EuiFormRow>
    </div>
  );
}

export function ReportSettings(props) {
  const { createReportDefinitionRequest, httpClientProps } = props;

  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSourceId, setReportSourceId] = useState('dashboardReportSource');

  const [dashboardSourceSelect, setDashboardSourceSelect] = useState('');
  const [dashboards, setDashboards] = useState([]);

  const [visualizationSourceSelect, setVisualizationSourceSelect] = useState(
    REPORT_SOURCE_VISUALIZATION_OPTIONS[0].value
  );
  const [visualizations, setVisualizations] = useState([]);

  const [savedSearchSourceSelect, setSavedSearchSourceSelect] = useState(
    REPORT_SOURCE_SAVED_SEARCH_OPTIONS[0].value
  );
  const [fileFormat, setFileFormat] = useState('pdfFormat');

  const [savedSearchFileFormat, setSavedSearchFileFormat] = useState(
    'csvFormat'
  );
  const [includeHeader, setIncludeHeader] = useState(false);
  const [includeFooter, setIncludeFooter] = useState(false);

  const [footer, setFooter] = useState('');
  const [selectedTabFooter, setSelectedTabFooter] = React.useState<
    'write' | 'preview'
  >('write');

  const [checkboxIdSelectHeaderFooter, setCheckboxIdSelectHeaderFooter] = 
    useState({['header']: false, ['footer']: false});

  const handleDashboards = (e) => {
    setDashboards(e);
  };

  const handleVisualizations = (e) => {
    setVisualizations(e);
  };

  const handleReportName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportName(e.target.value);
    createReportDefinitionRequest['report_name'] = e.target.value.toString();
  };

  const handleReportDescription = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportDescription(e.target.value);
    createReportDefinitionRequest['description'] = e.target.value.toString();
  };

  const handleReportSource = (e: React.SetStateAction<string>) => {
    setReportSourceId(e);
    if (e === 'dashboardReportSource') {
      createReportDefinitionRequest['report_source'] = 'Dashboard';
      createReportDefinitionRequest['report_params']['url'] =
        getDashboardBaseUrl() + dashboards[0].value;
    } else if (e === 'visualizationReportSource') {
      createReportDefinitionRequest['report_source'] = 'Visualization';
      createReportDefinitionRequest['report_params']['url'] =
        getVisualizationBaseUrl() + visualizations[0].value;
    }
  };

  const handleDashboardSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDashboardSourceSelect(e.target.value);
    createReportDefinitionRequest['report_params']['url'] =
      getDashboardBaseUrl() + e.target.value;
  };

  const handleVisualizationSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setVisualizationSourceSelect(e.target.value);
    createReportDefinitionRequest['report_params']['url'] =
      getVisualizationBaseUrl() + e.target.value;
  };

  const handleSavedSearchSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSavedSearchSourceSelect(e.target.value);
  };

  const handleFileFormat = (e: React.SetStateAction<string>) => {
    setFileFormat(e);
    if (e === 'pdfFormat') {
      createReportDefinitionRequest['report_params']['report_format'] = 'pdf';
    } else if (e === 'pngFormat') {
      createReportDefinitionRequest['report_params']['report_format'] = 'png';
    }
  };

  const handleSavedSearchFileFormat = (e: React.SetStateAction<string>) => {
    setSavedSearchFileFormat(e);
  };

  const handleCheckboxHeaderFooter = optionId => {
    const newCheckboxIdToSelectedMap = {
      ...checkboxIdSelectHeaderFooter,
      ...{
        [optionId]: !checkboxIdSelectHeaderFooter[optionId],
      },
    };
    setCheckboxIdSelectHeaderFooter(newCheckboxIdToSelectedMap);
  };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  const Header = () => {
    const [includeHeader, setIncludeHeader] = useState(false);

    const [header, setHeader] = useState('');
    const [selectedTabHeader, setSelectedTabHeader] = React.useState<
      'write' | 'preview'
    >('write');

    const handleIncludeHeader = (e: {
      target: { checked: React.SetStateAction<boolean> };
    }) => {
      setIncludeHeader(e.target.checked);
    };

    const showHeader = (checkboxIdSelectHeaderFooter.header) ? (
      <ReactMde
        value={header}
        onChange={setHeader}
        selectedTab={selectedTabHeader}
        onTabChange={setSelectedTabHeader}
        toolbarCommands={[
          ['header', 'bold', 'italic', 'strikethrough'],
          ['unordered-list', 'ordered-list', 'checked-list'],
        ]}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
    ) : null;

    return (
      <div>
        {/* <EuiCheckboxGroup 
            options={HEADER_FOOTER_CHECKBOX}
            idToSelectedMap={checkboxIdSelectHeaderFooter}
            onChange={handleCheckboxHeaderFooter}
            legend={{children:"Header and footer"}}
          />
        <EuiSpacer/> */}
        {showHeader}
      </div>
    );
  };

  const Footer = () => {
    const [includeFooter, setIncludeFooter] = useState(false);

    // const [footer, setFooter] = useState('');
    // const [selectedTabFooter, setSelectedTabFooter] = React.useState<
    //   'write' | 'preview'
    // >('write');

    const handleIncludeFooter = (e: {
      target: { checked: React.SetStateAction<boolean> };
    }) => {
      setIncludeFooter(e.target.checked);
    };

    const showFooter = (checkboxIdSelectHeaderFooter.footer) ? (
      <ReactMde
        value={footer}
        onChange={setFooter}
        selectedTab={selectedTabFooter}
        onTabChange={setSelectedTabFooter}
        toolbarCommands={[
          ['header', 'bold', 'italic', 'strikethrough'],
          ['unordered-list', 'ordered-list', 'checked-list'],
        ]}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
    ) : null;

    return (
      <div>
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
      </div>
    );
  };

  const ReportSourceDashboard = () => {
    return (
      <div>
        <EuiFormRow label="Select dashboard">
          <EuiSelect
            id="reportSourceDashboardSelect"
            options={dashboards}
            value={dashboardSourceSelect}
            onChange={handleDashboardSelect}
          />
        </EuiFormRow>
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <PDFandPNGFileFormats />
        <EuiSpacer />
        {/* <Header /> */}
        <EuiSpacer size="s" />
        {/* <Footer /> */}
        <EuiCheckboxGroup 
            options={HEADER_FOOTER_CHECKBOX}
            idToSelectedMap={checkboxIdSelectHeaderFooter}
            onChange={handleCheckboxHeaderFooter}
            legend={{children:"Header and footer"}}
        />
        <EuiSpacer/>
        <Header />
        <EuiSpacer/>
        <Footer/>
      </div>
    );
  };

  const ReportSourceVisualization = () => {
    return (
      <div>
        <EuiFormRow label="Select visualization">
          <EuiSelect
            id="reportSourceVisualizationSelect"
            options={visualizations}
            value={visualizationSourceSelect}
            onChange={handleVisualizationSelect}
          />
        </EuiFormRow>
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <PDFandPNGFileFormats />
        <EuiSpacer />
        <Header />
        <EuiSpacer size="s" />
        <Footer />
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

  let displayDashboardSelect =
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

  const getReportSettingDashboardOptions = (data) => {
    let index;
    let dashboard_options = [];
    for (index = 0; index < data.length; ++index) {
      let entry = {
        value: data[index]['_id'].substring(10),
        text: data[index]['_source']['dashboard']['title'],
      };
      dashboard_options.push(entry);
    }
    return dashboard_options;
  };

  const getDashboardBaseUrl = () => {
    let baseUrl = window.location.href;
    return baseUrl.replace(
      'opendistro_kibana_reports#/create',
      'kibana#/dashboard/'
    );
  };

  const getVisualizationOptions = (data) => {
    let index;
    let options = [];
    for (index = 0; index < data.length; ++index) {
      let entry = {
        value: data[index]['_id'].substring(14),
        text: data[index]['_source']['visualization']['title'],
      };
      options.push(entry);
    }
    return options;
  };

  const getVisualizationBaseUrl = () => {
    let baseUrl = window.location.href;
    return baseUrl.replace(
      'opendistro_kibana_reports#/create',
      'kibana#/visualize/edit/'
    );
  };

  useEffect(() => {
    // get dashboard options
    httpClientProps
      .get('../api/reporting/getReportSource/dashboard')
      .then(async (response) => {
        let dashboardOptions = getReportSettingDashboardOptions(
          response['hits']['hits']
        );
        await handleDashboards(dashboardOptions);
        await setDashboardSourceSelect(dashboardOptions[0].value);
        createReportDefinitionRequest['report_params']['url'] =
          getDashboardBaseUrl() +
          response['hits']['hits'][0]['_id'].substring(10);
      })
      .catch((error) => {
        console.log('error when fetching dashboards:', error);
      });
    createReportDefinitionRequest['report_params']['report_format'] = 'pdf';
    createReportDefinitionRequest['report_source'] = 'Dashboard';

    httpClientProps
      .get('../api/reporting/getReportSource/visualization')
      .then(async (response) => {
        let visualizationOptions = getVisualizationOptions(
          response['hits']['hits']
        );
        await handleVisualizations(visualizationOptions);
        await setVisualizationSourceSelect(visualizationOptions[0].value);
      })
      .catch((error) => {
        console.log('error when fetching visualizations:', error);
      });
  }, []);

  return (
    <EuiPage>
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
                helpText="Valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen) and (space)."
              >
                <EuiFieldText
                  placeholder="Report name (e.g Log Traffic Daily Report)"
                  value={reportName}
                  onChange={handleReportName}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup style={{ maxWidth: 600 }}>
            <EuiFlexItem>
              <EuiFormRow label="Description (optional)">
                <EuiFieldText
                  placeholder="Describe this report (e.g Morning daily reports for log traffic)"
                  value={reportDescription}
                  onChange={handleReportDescription}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFormRow label="Report source">
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
    </EuiPage>
  );
}
