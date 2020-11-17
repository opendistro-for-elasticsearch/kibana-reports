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
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiHorizontalRule,
  EuiText,
  EuiSpacer,
  EuiRadioGroup,
  EuiSelect,
  EuiTextArea,
  EuiCheckboxGroup,
} from '@elastic/eui';
import {
  REPORT_SOURCE_RADIOS,
  PDF_PNG_FILE_FORMAT_OPTIONS,
  HEADER_FOOTER_CHECKBOX,
  REPORT_SOURCE_TYPES,
} from './report_settings_constants';
import Showdown from 'showdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import {
  reportDefinitionParams,
  timeRangeParams,
} from '../create/create_report_definition';
import {
  parseInContextUrl,
  getSavedSearchBaseUrlCreate,
  getVisualizationBaseUrlCreate,
  getSavedSearchOptions,
  getVisualizationOptions,
  getDashboardBaseUrlCreate,
  getDashboardOptions,
  handleDataToVisualReportSourceChange,
} from './report_settings_helpers';
import { TimeRangeSelect } from './time_range';
import { converter } from '../utils';
import { ReportDefinitionSchemaType } from 'server/model';

type ReportSettingProps = {
  edit: boolean;
  editDefinitionId: string;
  reportDefinitionRequest: reportDefinitionParams;
  httpClientProps: any;
  timeRange: timeRangeParams;
  showSettingsReportNameError: boolean;
  settingsReportNameErrorMessage: string;
  showTimeRangeError: boolean;
};

export function ReportSettings(props: ReportSettingProps) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
    timeRange,
    showSettingsReportNameError,
    settingsReportNameErrorMessage,
    showTimeRangeError,
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

  const [fileFormat, setFileFormat] = useState('pdf');

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
    reportDefinitionRequest.report_params.report_name = e.target.value.toString();
  };

  const handleReportDescription = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setReportDescription(e.target.value);
    reportDefinitionRequest.report_params.description = e.target.value.toString();
  };

  const handleReportSource = (e: React.SetStateAction<string>) => {
    setReportSourceId(e);
    let fromInContext = false;
    if (window.location.href.includes('?')) {
      fromInContext = true;
    }
    if (e === 'dashboardReportSource') {
      reportDefinitionRequest.report_params.report_source = 'Dashboard';
      reportDefinitionRequest.report_params.core_params.base_url =
        getDashboardBaseUrlCreate(edit, editDefinitionId, fromInContext) +
        dashboards[0].value;

      // set params to visual report params after switch from saved search
      handleDataToVisualReportSourceChange(reportDefinitionRequest);
      setFileFormat('pdf');
    } else if (e === 'visualizationReportSource') {
      reportDefinitionRequest.report_params.report_source = 'Visualization';
      reportDefinitionRequest.report_params.core_params.base_url =
        getVisualizationBaseUrlCreate(edit, editDefinitionId, fromInContext) +
        visualizations[0].value;

      // set params to visual report params after switch from saved search
      handleDataToVisualReportSourceChange(reportDefinitionRequest);

      setFileFormat('pdf');
    } else if (e === 'savedSearchReportSource') {
      reportDefinitionRequest.report_params.report_source = 'Saved search';
      reportDefinitionRequest.report_params.core_params.base_url =
        getSavedSearchBaseUrlCreate(edit, editDefinitionId, fromInContext) +
        savedSearches[0].value;
      reportDefinitionRequest.report_params.core_params.saved_search_id =
        savedSearches[0].value;
      reportDefinitionRequest.report_params.core_params.report_format = 'csv';
      reportDefinitionRequest.report_params.core_params.limit = 10000;
      reportDefinitionRequest.report_params.core_params.excel = true;
    }
  };

  const handleDashboardSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDashboardSourceSelect(e.target.value);
    let fromInContext = false;
    if (window.location.href.includes('?')) {
      fromInContext = true;
    }
    reportDefinitionRequest.report_params.core_params.base_url =
      getDashboardBaseUrlCreate(edit, editDefinitionId, fromInContext) +
      e.target.value;
  };

  const handleVisualizationSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setVisualizationSourceSelect(e.target.value);
    let fromInContext = false;
    if (window.location.href.includes('?')) {
      fromInContext = true;
    }
    reportDefinitionRequest.report_params.core_params.base_url =
      getVisualizationBaseUrlCreate(edit, editDefinitionId, fromInContext) +
      e.target.value;
  };

  const handleSavedSearchSelect = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSavedSearchSourceSelect(e.target.value);
    reportDefinitionRequest.report_params.core_params.saved_search_id =
      e.target.value;

    let fromInContext = false;
    if (window.location.href.includes('?')) {
      fromInContext = true;
    }
    reportDefinitionRequest.report_params.core_params.base_url =
      getSavedSearchBaseUrlCreate(edit, editDefinitionId, fromInContext) +
      e.target.value;
  };

  const handleFileFormat = (e: React.SetStateAction<string>) => {
    setFileFormat(e);
    reportDefinitionRequest.report_params.core_params.report_format = e.toString();
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

    const handleHeader = (e) => {
      setHeader(e);
      reportDefinitionRequest.report_params.core_params.header = e;
    };

    const handleFooter = (e) => {
      setFooter(e);
      reportDefinitionRequest.report_params.core_params.footer = e;
    };

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
          onChange={handleFooter}
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
          onChange={handleHeader}
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

    useEffect(() => {
      let unmounted = false;
      if (edit) {
        httpClientProps
          .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
          .then(async (response: {}) => {
            const reportDefinition: ReportDefinitionSchemaType =
              response.report_definition;
            const {
              report_params: {
                core_params: { header, footer },
              },
            } = reportDefinition;
            // set header/footer default
            if (header) {
              checkboxIdSelectHeaderFooter.header = true;
              if (!unmounted) {
                setHeader(converter.makeMarkdown(header));
              }
            }
            if (footer) {
              checkboxIdSelectHeaderFooter.footer = true;
              if (!unmounted) {
                setFooter(converter.makeMarkdown(footer));
              }
            }
          })
          .catch((error: any) => {
            console.error(
              'error in fetching report definition details:',
              error
            );
          });
      } else {
        // keeps header/footer from re-rendering empty when other fields in Report Settings are changed
        checkboxIdSelectHeaderFooter.header =
          'header' in reportDefinitionRequest.report_params.core_params;
        checkboxIdSelectHeaderFooter.footer =
          'footer' in reportDefinitionRequest.report_params.core_params;
        if (checkboxIdSelectHeaderFooter.header) {
          setHeader(reportDefinitionRequest.report_params.core_params.header);
        }
        if (checkboxIdSelectHeaderFooter.footer) {
          setFooter(reportDefinitionRequest.report_params.core_params.footer);
        }
      }
      return () => {
        unmounted = true;
      };
    }, []);

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
      </div>
    );
  };

  const VisualReportFormatAndMarkdown = () => {
    return (
      <div>
        <PDFandPNGFileFormats />
        <EuiSpacer />
      </div>
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

  const setInContextDefaultConfiguration = () => {
    const url = window.location.href;
    const id = parseInContextUrl(url, 'id');
    if (url.includes('dashboard')) {
      setReportSourceId('dashboardReportSource');
      reportDefinitionRequest.report_params.report_source =
        REPORT_SOURCE_RADIOS[0].label;
      setDashboardSourceSelect(id);
      reportDefinitionRequest.report_params.core_params.base_url =
        getDashboardBaseUrlCreate(edit, id, true) + id;
    } else if (url.includes('visualize')) {
      setReportSourceId('visualizationReportSource');
      reportDefinitionRequest.report_params.report_source =
        REPORT_SOURCE_RADIOS[1].label;
      setVisualizationSourceSelect(id);
      reportDefinitionRequest.report_params.core_params.base_url =
        getVisualizationBaseUrlCreate(edit, editDefinitionId, true) + id;
    } else if (url.includes('discover')) {
      setReportSourceId('savedSearchReportSource');
      reportDefinitionRequest.report_params.core_params.report_format = 'csv';
      reportDefinitionRequest.report_params.core_params.saved_search_id = id;
      reportDefinitionRequest.report_params.report_source =
        REPORT_SOURCE_RADIOS[2].label;
      setSavedSearchSourceSelect(id);
      reportDefinitionRequest.report_params.core_params.base_url =
        getSavedSearchBaseUrlCreate(edit, editDefinitionId, true) + id;
    }
  };

  const setDefaultEditValues = async (response, reportSourceOptions) => {
    setReportName(response.report_definition.report_params.report_name);
    setReportDescription(response.report_definition.report_params.description);
    reportDefinitionRequest.report_params.report_name =
      response.report_definition.report_params.report_name;
    reportDefinitionRequest.report_params.description =
      response.report_definition.report_params.description;
    reportDefinitionRequest.report_params =
      response.report_definition.report_params;
    const reportSource = response.report_definition.report_params.report_source;
    REPORT_SOURCE_RADIOS.map((radio) => {
      if (radio.label === reportSource) {
        setReportSourceId(radio.id);
        reportDefinitionRequest.report_params.report_source = reportSource;
      }
    });
    setDefaultFileFormat(
      response.report_definition.report_params.core_params.report_format
    );
    setReportSourceDropdownOption(
      reportSourceOptions,
      reportSource,
      response.report_definition.report_params.core_params.base_url
    );
  };

  const defaultConfigurationEdit = async (httpClientProps) => {
    let editData = {};
    await httpClientProps
      .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
      .then(async (response: {}) => {
        editData = response;
      })
      .catch((error: any) => {
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
    reportDefinitionRequest.report_params.core_params.report_format = fileFormat;
    await httpClientProps
      .get('../api/reporting/getReportSource/dashboard')
      .then(async (response) => {
        let dashboardOptions = getDashboardOptions(response['hits']['hits']);
        reportSourceOptions.dashboard = dashboardOptions;
        handleDashboards(dashboardOptions);
        if (!edit) {
          setDashboardSourceSelect(dashboardOptions[0].value);
          reportDefinitionRequest.report_params.report_source = 'Dashboard';
          reportDefinitionRequest['report_params']['core_params']['base_url'] =
            getDashboardBaseUrlCreate(edit, editDefinitionId, false) +
            response['hits']['hits'][0]['_id'].substring(10);
        }
      })
      .catch((error) => {
        console.log('error when fetching dashboards:', error);
      });

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
      // if coming from in-context menu
      if (window.location.href.indexOf('?') > -1) {
        setInContextDefaultConfiguration();
      }
      if (edit) {
        setDefaultEditValues(editData, reportSourceOptions);
      }
    });
  }, []);

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

  const displayVisualReportsFormatAndMarkdown =
    reportSourceId != 'savedSearchReportSource' ? (
      <div>
        <VisualReportFormatAndMarkdown />
        <SettingsMarkdown />
      </div>
    ) : (
      <div>
        <EuiFormRow label="File format">
          <EuiText>
            <p>CSV</p>
          </EuiText>
        </EuiFormRow>
      </div>
    );

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
              helpText="Valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen) and (space)."
              isInvalid={showSettingsReportNameError}
              error={settingsReportNameErrorMessage}
              id={'reportSettingsName'}
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
            <EuiFormRow
              label="Description (optional)"
              id={'reportSettingsDescription'}
            >
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
        <TimeRangeSelect
          timeRange={timeRange}
          reportDefinitionRequest={reportDefinitionRequest}
          edit={edit}
          id={editDefinitionId}
          httpClientProps={httpClientProps}
          showTimeRangeError={showTimeRangeError}
        />
        <EuiSpacer />
        {displayVisualReportsFormatAndMarkdown}
        <EuiSpacer />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
