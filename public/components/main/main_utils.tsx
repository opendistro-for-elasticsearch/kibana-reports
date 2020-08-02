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

export const extractFilename = (filename: string) => {
  return filename.substring(0, filename.length - 4);
};

export const extractFileFormat = (filename: string) => {
  return filename.substring(filename.length - 3, filename.length);
};

export const getFileFormatPrefix = (fileFormat: string) => {
  var fileFormatPrefix = 'data:' + fileFormat + ';base64,';
  return fileFormatPrefix;
};

export const addReportsTableContent = (data) => {
  let index;
  let reports_table_items = [];
  for (index = 0; index < data.length; ++index) {
    let reports_table_entry = {
      id: data[index]['_id'],
      reportName: data[index]['_source']['report_name'],
      type: data[index]['_source']['report_type'],
      sender: 'N/A',
      recipients: 'N/A',
      reportSource: data[index]['_source']['report_source'],
      lastUpdated: data[index]['_source']['time_created'],
      state: data[index]['_source']['state'],
      url: data[index]['_source']['report_params']['url'],
    };
    reports_table_items.push(reports_table_entry);
  }
  return reports_table_items;
};

export const addReportDefinitionsTableContent = (data: any) => {
  let index;
  let reports_definitions_table_items = [];
  for (index = 0; index < data.length; ++index) {
    let reports_definition_table_entry = {
      id: data[index]['_id'],
      reportName: data[index]['_source']['report_name'],
      type: data[index]['_source']['report_type'],
      owner: 'davidcui',
      source: data[index]['_source']['report_source'],
      lastUpdated: data[index]['_source']['time_created'],
      details:
        data[index]['_source']['trigger']['trigger_params']['schedule_type'],
      status: data[index]['_source']['status'],
    };
    reports_definitions_table_items.push(reports_definition_table_entry);
  }
  return reports_definitions_table_items;
};

export const getReportSettingDashboardOptions = (data) => {
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

export const removeDuplicatePdfFileFormat = (filename) => {
  return filename.substring(0, filename.length - 4);
};
