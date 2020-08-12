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

import { get } from 'lodash';
import 'babel-polyfill';

export const extractFilename = (filename: string) => {
  return filename.substring(0, filename.length - 4);
};

export const extractFileFormat = (filename: string) => {
  const fileFormat = filename;
  return fileFormat.substring(filename.length - 3, filename.length);
};

export const getFileFormatPrefix = (fileFormat: string) => {
  var fileFormatPrefix = 'data:' + fileFormat + ';base64,';
  return fileFormatPrefix;
};

export const addReportsTableContent = (data) => {
  let index;
  let reportsTableItems = [];
  for (index = 0; index < data.length; ++index) {
    let reportsTableEntry = {
      id: get(data, [index, '_id']),
      reportName: get(data, [index, '_source', 'report_name']),
      type: get(data, [index, '_source', 'report_type']),
      sender: 'N/A',
      recipients: 'N/A',
      reportSource: get(data, [index, '_source', 'report_source']),
      lastUpdated: get(data, [index, '_source', 'time_created']),
      state: get(data, [index, '_source', 'state']),
      url: get(data, [index, '_source', 'report_params', 'url']),
    };
    reportsTableItems.push(reportsTableEntry);
  }
  return reportsTableItems;
};

export const addReportDefinitionsTableContent = (data: any) => {
  let index;
  let reportDefinitionsTableItems = [];
  for (index = 0; index < data.length; ++index) {
    let reportDefinitionsTableEntry = {
      id: get(data, [index, '_id']),
      reportName: get(data, [index, '_source', 'report_name']),
      type: get(data, [index, '_source', 'report_type']),
      owner: 'davidcui', // Todo: replace
      source: get(data, [index, '_source', 'report_source']),
      lastUpdated: get(data, [index, '_source', 'time_created']),
      details: get(data, [
        index,
        '_source',
        'trigger',
        'trigger_params',
        'schedule_type',
      ]),
      status: get(data, [index, '_source', 'status']),
    };
    reportDefinitionsTableItems.push(reportDefinitionsTableEntry);
  }
  return reportDefinitionsTableItems;
};

export const getReportSettingDashboardOptions = (data) => {
  let index;
  let dashboardOptions = [];
  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: get(data, [index, '_id']).substring(10),
      text: get(data, [index, '_source', 'dashboard', 'title']),
    };
    dashboardOptions.push(entry);
  }
  return dashboardOptions;
};

export const removeDuplicatePdfFileFormat = (filename) => {
  return filename.substring(0, filename.length - 4);
};

export const readStreamToFile = async (
  stream: string,
  fileFormat: string,
  fileName: string
) => {
  let link = document.createElement('a');
  let fileFormatPrefix = getFileFormatPrefix(fileFormat);
  let url = fileFormatPrefix + stream;
  if (typeof link.download !== 'string') {
    window.open(url, '_blank');
    return;
  }
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateReport = async (metadata, httpClient) => {
  await httpClient
    .post('../api/reporting/generateReport', {
      body: JSON.stringify(metadata),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (response) => {
      const fileFormat = extractFileFormat(response['filename']);
      const fileName = response['filename'];
      await readStreamToFile(await response['data'], fileFormat, fileName);
      return response;
    })
    .catch((error) => {
      console.log('error on generating report:', error);
    });
};
