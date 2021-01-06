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

export const parseInContextUrl = (url: string, parameter: string) => {
  const info = url.split('?');
  if (parameter === 'id') {
    return info[1].substring(info[1].indexOf(':') + 1, info[1].length);
  } else if (parameter === 'timeFrom') {
    return info[2].substring(info[2].indexOf('=') + 1, info[2].length);
  } else if (parameter === 'timeTo') {
    return info[3].substring(info[3].indexOf('=') + 1, info[3].length);
  }
  return 'error: invalid parameter';
};

export const getDashboardBaseUrlCreate = (
  edit: boolean,
  editDefinitionId: string,
  fromInContext: boolean
) => {
  let baseUrl;
  if (!fromInContext) {
    baseUrl = location.pathname + location.hash;
  } else {
    baseUrl = '/app/dashboards#/view/';
  }
  if (edit) {
    return baseUrl.replace(
      `opendistro_kibana_reports#/edit/${editDefinitionId}`,
      'dashboards#/view/'
    );
  } else if (fromInContext) {
    return baseUrl;
  }
  return baseUrl.replace(
    'opendistro_kibana_reports#/create',
    'dashboards#/view/'
  );
};

export const getVisualizationBaseUrlCreate = (
  edit: boolean,
  editDefinitionId: string,
  fromInContext: boolean
) => {
  let baseUrl;
  if (!fromInContext) {
    baseUrl = location.pathname + location.hash;
  } else {
    baseUrl = '/app/visualize#/edit/';
  }
  if (edit) {
    return baseUrl.replace(
      `opendistro_kibana_reports#/edit/${editDefinitionId}`,
      'visualize#/edit/'
    );
  } else if (fromInContext) {
    return baseUrl;
  }
  return baseUrl.replace(
    'opendistro_kibana_reports#/create',
    'visualize#/edit/'
  );
};

export const getSavedSearchBaseUrlCreate = (
  edit: boolean,
  editDefinitionId: string,
  fromInContext: boolean
) => {
  let baseUrl;
  if (!fromInContext) {
    baseUrl = location.pathname + location.hash;
  } else {
    baseUrl = '/app/discover#/view/';
  }
  if (edit) {
    return baseUrl.replace(
      `opendistro_kibana_reports#/edit/${editDefinitionId}`,
      'discover#/view/'
    );
  } else if (fromInContext) {
    return baseUrl;
  }
  return baseUrl.replace(
    'opendistro_kibana_reports#/create',
    'discover#/view/'
  );
};

export const getDashboardOptions = (data) => {
  let index;
  let dashboard_options = [];
  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: data[index]['_id'].substring(10),
      label: data[index]['_source']['dashboard']['title'],
    };
    dashboard_options.push(entry);
  }
  return dashboard_options;
};

export const getVisualizationOptions = (data: string | any[]) => {
  let index;
  let options = [];
  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: data[index]['_id'].substring(14),
      label: data[index]['_source']['visualization']['title'],
    };
    options.push(entry);
  }
  return options;
};

export const getSavedSearchOptions = (data: string | any[]) => {
  let index;
  let options = [];
  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: data[index]['_id'].substring(7),
      label: data[index]['_source']['search']['title'],
    };
    options.push(entry);
  }
  return options;
};

export const handleDataToVisualReportSourceChange = (
  reportDefinitionRequest
) => {
  delete reportDefinitionRequest.report_params.core_params.saved_search_id;
  delete reportDefinitionRequest.report_params.core_params.limit;
  delete reportDefinitionRequest.report_params.core_params.excel;
  reportDefinitionRequest.report_params.core_params.report_format = 'pdf';
};
