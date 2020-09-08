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
  EuiCheckboxGroup,
} from '@elastic/eui';
import moment from 'moment';
import {
  REPORT_SOURCE_RADIOS,
  PDF_PNG_FILE_FORMAT_OPTIONS,
  SAVED_SEARCH_FORMAT_OPTIONS,
  HEADER_FOOTER_CHECKBOX,
  REPORT_SOURCE_TYPES,
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
          showUpdateButton={false}
        />
      </EuiFormRow>
    </div>
  );
}

export function ReportSettings(props) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
  } = props;

  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSourceId, setReportSourceId] = useState('dashboardReportSource');

  const [dashboardSourceSelect, setDashboardSourceSelect] = useState('');
  const [dashboards, setDashboards] = useState([]);

  const [visualizationSourceSelect, setVisualizationSourceSelect] = useState(
    ''
  );
  const [visualizations, setVisualizations] = useState([]);

  const [savedSearchSourceSelect, setSavedSearchSourceSelect] = useState('');
  const [savedSearches, setSavedSearches] = useState([]);

  const [fileFormat, setFileFormat] = useState('pdfFormat');

  const [savedSearchFileFormat, setSavedSearchFileFormat] = useState(
    'csvFormat'
  );

  const handleDashboards = (e) => {
    setDashboards(e);
  };

  const handleVisualizations = (e) => {
    setVisualizations(e);
  };

  const handleSavedSearches = (e) => {
    setSavedSearches(e);
  };

  const handleReportName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportName(e.target.value);
    reportDefinitionRequest['report_name'] = e.target.value.toString();
  };

  const handleReportDescription = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportDescription(e.target.value);
    reportDefinitionRequest['description'] = e.target.value.toString();
  };

  const handleReportSource = (e: React.SetStateAction<string>) => {
    setReportSourceId(e);
    if (e === 'dashboardReportSource') {
      reportDefinitionRequest['report_source'] = 'Dashboard';
      reportDefinitionRequest['report_params']['url'] =
        getDashboardBaseUrlCreate() + dashboards[0].value;
    } else if (e === 'visualizationReportSource') {
      reportDefinitionRequest['report_source'] = 'Visualization';
      reportDefinitionRequest['report_params']['url'] =
        getVisualizationBaseUrlCreate() + visualizations[0].value;
    }
  };

  const handleDashboardSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDashboardSourceSelect(e.target.value);
    reportDefinitionRequest['report_params']['url'] =
      getDashboardBaseUrlCreate() + e.target.value;
  };

  const handleVisualizationSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setVisualizationSourceSelect(e.target.value);
    reportDefinitionRequest['report_params']['url'] =
      getVisualizationBaseUrlCreate() + e.target.value;
  };

  const handleSavedSearchSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSavedSearchSourceSelect(e.target.value);
  };

  const handleFileFormat = (e: React.SetStateAction<string>) => {
    setFileFormat(e);
    if (e === 'pdfFormat') {
      reportDefinitionRequest['report_params']['report_format'] = 'pdf';
    } else if (e === 'pngFormat') {
      reportDefinitionRequest['report_params']['report_format'] = 'png';
    }
  };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

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

  const SettingsMarkdown = () => {
    const [
      checkboxIdSelectHeaderFooter,
      setCheckboxIdSelectHeaderFooter,
    ] = useState({ ['header']: false, ['footer']: false });

    const [footer, setFooter] = useState('');
    const [selectedTabFooter, setSelectedTabFooter] = React.useState<
      'write' | 'preview'
    >('write');

    const [header, setHeader] = useState('');
    const [selectedTabHeader, setSelectedTabHeader] = React.useState<
      'write' | 'preview'
    >('write');

    const handleCheckboxHeaderFooter = (optionId) => {
      const newCheckboxIdToSelectedMap = {
        ...checkboxIdSelectHeaderFooter,
        ...{
          [optionId]: !checkboxIdSelectHeaderFooter[optionId],
        },
      };
      setCheckboxIdSelectHeaderFooter(newCheckboxIdToSelectedMap);
    };

    const showFooter = checkboxIdSelectHeaderFooter.footer ? (
      <EuiFormRow label="Footer" fullWidth={true}>
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
      </EuiFormRow>
    ) : null;

    const showHeader = checkboxIdSelectHeaderFooter.header ? (
      <EuiFormRow label="Header" fullWidth={true}>
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
      </EuiFormRow>
    ) : null;

    return (
      <div>
        <EuiCheckboxGroup
          options={HEADER_FOOTER_CHECKBOX}
          idToSelectedMap={checkboxIdSelectHeaderFooter}
          onChange={handleCheckboxHeaderFooter}
          legend={{ children: 'Header and footer' }}
        />
        <EuiSpacer />
        {showHeader}
        {showFooter}
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
        <EuiSpacer size="s" />
        <SettingsMarkdown />
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
        <EuiSpacer size="s" />
        <SettingsMarkdown />
      </div>
    );
  };

  const ReportSourceSavedSearch = () => {
    return (
      <div>
        <EuiFormRow label="Select saved search">
          <EuiSelect
            id="reportSourceSavedSearchSelect"
            options={savedSearches}
            value={savedSearchSourceSelect}
            onChange={handleSavedSearchSelect}
          />
        </EuiFormRow>
        <EuiSpacer />
        <TimeRangeSelect />
        <EuiSpacer />
        <EuiFormRow label="File format">
          <EuiText>
            <p>CSV</p>
          </EuiText>
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

  const getDashboardBaseUrlCreate = () => {
    let baseUrl = window.location.href;
    if (edit) {
      return baseUrl.replace(
        `opendistro_kibana_reports#/edit/${editDefinitionId}`,
        'dashboards#/view/'
      );
    }
    return baseUrl.replace(
      'opendistro_kibana_reports#/create',
      'kibana#/dashboard/'
    );
  };

  const setReportSourceDropdownOption = (options, reportSource, url) => {
    let index = 0;
    if (reportSource === REPORT_SOURCE_TYPES.dashboard) {
      for (index = 0; index < options.dashboard.length; ++index) {
        if (url.includes(options.dashboard[index].value)) {
          setDashboardSourceSelect(options.dashboard[index].value);
        }
      }
    } else if (reportSource === REPORT_SOURCE_TYPES.visualization) {
      for (index = 0; index < options.visualizations.length; ++index) {
        if (url.includes(options.visualizations[index].value)) {
          setVisualizationSourceSelect(options.visualizations[index].value);
        }
      }
    } else if (reportSource === REPORT_SOURCE_TYPES.savedSearch) {
      for (index = 0; index < options.savedSearch.length; ++index) {
        if (url.includes(options.savedSearch[index].value)) {
          setSavedSearchSourceSelect(options.savedSearch[index].value);
        }
      }
    }
  };

  const setDefaultFileFormat = (fileFormat) => {
    let index = 0;
    for (index = 0; index < PDF_PNG_FILE_FORMAT_OPTIONS.length; ++index) {
      if (
        fileFormat.toUpperCase() === PDF_PNG_FILE_FORMAT_OPTIONS[index].label
      ) {
        setFileFormat(PDF_PNG_FILE_FORMAT_OPTIONS[index].id);
      }
    }
  };

  const setDefaultEditValues = async (response, reportSourceOptions) => {
    setReportName(response.report_name);
    setReportDescription(response.description);
    reportDefinitionRequest.report_name = response.report_name;
    reportDefinitionRequest.description = response.description;
    reportDefinitionRequest.report_params = response.report_params;
    REPORT_SOURCE_RADIOS.map((radio) => {
      if (radio.label === response.report_source) {
        setReportSourceId(radio.id);
        reportDefinitionRequest.report_source = response.report_source;
      }
    });
    setDefaultFileFormat(response['report_params']['report_format']);
    setReportSourceDropdownOption(
      reportSourceOptions,
      response['report_source'],
      response['report_params']['url']
    );
  };

  const defaultConfigurationEdit = async (httpClientProps) => {
    let editData = {};
    await httpClientProps
      .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
      .then(async (response) => {
        editData = response;
      })
      .catch((error) => {
        console.error('error in fetching report definition details:', error);
      });
    return editData;
  };

  const defaultConfigurationCreate = async (httpClientProps) => {
    let reportSourceOptions = {
      dashboard: [],
      visualizations: [],
      savedSearch: [],
    };
    await httpClientProps
      .get('../api/reporting/getReportSource/dashboard')
      .then(async (response) => {
        let dashboardOptions = getReportSettingDashboardOptions(
          response['hits']['hits']
        );
        reportSourceOptions.dashboard = dashboardOptions;
        handleDashboards(dashboardOptions);
        if (!edit) {
          setDashboardSourceSelect(dashboardOptions[0].value);
          reportDefinitionRequest['report_params']['url'] =
            getDashboardBaseUrlCreate() +
            response['hits']['hits'][0]['_id'].substring(10);
        }
      })
      .catch((error) => {
        console.log('error when fetching dashboards:', error);
      });
    reportDefinitionRequest['report_params']['report_format'] = 'pdf';
    reportDefinitionRequest['report_source'] = 'Dashboard';

    await httpClientProps
      .get('../api/reporting/getReportSource/visualization')
      .then(async (response) => {
        let visualizationOptions = getVisualizationOptions(
          response['hits']['hits']
        );
        reportSourceOptions.visualizations = visualizationOptions;
        await handleVisualizations(visualizationOptions);
        await setVisualizationSourceSelect(visualizationOptions[0].value);
      })
      .catch((error) => {
        console.log('error when fetching visualizations:', error);
      });

    await httpClientProps
      .get('../api/reporting/getReportSource/search')
      .then(async (response) => {
        let savedSearchOptions = getSavedSearchOptions(
          response['hits']['hits']
        );
        reportSourceOptions.savedSearch = savedSearchOptions;
        await handleSavedSearches(savedSearchOptions);
        await setSavedSearchSourceSelect(savedSearchOptions[0].value);
      })
      .catch((error) => {
        console.log('error when fetching saved searches:', error);
      });
    return reportSourceOptions;
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

  const getSavedSearchOptions = (data) => {
    let index;
    let options = [];
    for (index = 0; index < data.length; ++index) {
      let entry = {
        value: data[index]['_id'].substring(7),
        text: data[index]['_source']['search']['title'],
      };
      options.push(entry);
    }
    return options;
  };

  const getVisualizationBaseUrlCreate = () => {
    let baseUrl = window.location.href;
    if (edit) {
      return baseUrl.replace(
        'opendistro_kibana_reports#/edit',
        'kibana#/visualize/edit/'
      );
    }
    return baseUrl.replace(
      'opendistro_kibana_reports#/create',
      'kibana#/visualize/edit/'
    );
  };

  useEffect(() => {
    let reportSourceOptions = {};
    let editData = {};
    if (edit) {
      defaultConfigurationEdit(httpClientProps).then(async (response) => {
        editData = response;
      });
    }
    defaultConfigurationCreate(httpClientProps).then(async (response) => {
      reportSourceOptions = response;
      if (edit) {
        setDefaultEditValues(editData, reportSourceOptions);
      }
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
                <EuiTextArea
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
