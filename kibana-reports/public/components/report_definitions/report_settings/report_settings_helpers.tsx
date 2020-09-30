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
  editDefinitionId: string
) => {
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

export const getVisualizationBaseUrlCreate = (edit: boolean) => {
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

export const getSavedSearchBaseUrlCreate = (edit: boolean) => {
  let baseUrl = window.location.href;
  if (edit) {
    return baseUrl.replace(
      'opendistro_kibana_reports#/edit',
      'kibana#/discover/'
    );
  }
  return baseUrl.replace(
    'opendistro_kibana_reports#/create',
    'kibana#/discover/'
  );
};

export const getDashboardOptions = (data) => {
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

export const getVisualizationOptions = (data: string | any[]) => {
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

export const getSavedSearchOptions = (data: string | any[]) => {
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
