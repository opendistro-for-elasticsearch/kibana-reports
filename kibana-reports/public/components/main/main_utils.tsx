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

export const fileFormatsUpper = {
  csv: 'CSV',
  pdf: 'PDF',
  png: 'PNG',
};

export const humanReadableDate = (date) => {
  let readableDate = new Date(date);
  return (
    readableDate.toDateString() + ' @ ' + readableDate.toLocaleTimeString()
  );
};

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
  let reportsTableItems = [];
  for (let index = 0; index < data.length; ++index) {
    let item = data[index];
    let report = item._source;
    let reportDefinition = report.report_definition;
    let reportParams = reportDefinition.report_params;
    let trigger = reportDefinition.trigger;

    let reportsTableEntry = {
      id: item._id,
      reportName: reportParams.report_name,
      type: trigger.trigger_type,
      sender: `\u2014`,
      kibanaRecipients: `\u2014`,
      emailRecipients: `\u2014`,
      reportSource: reportParams.report_source,
      //TODO: wrong name
      lastUpdated: report.time_created,
      state: report.state,
      url: report.query_url,
      format: reportParams.core_params.report_format,
    };
    reportsTableItems.push(reportsTableEntry);
  }
  return reportsTableItems;
};

export const addReportDefinitionsTableContent = (data: any) => {
  let reportDefinitionsTableItems = [];
  for (let index = 0; index < data.length; ++index) {
    let item = data[index];
    let reportDefinition = item._source.report_definition;
    let reportParams = reportDefinition.report_params;
    let trigger = reportDefinition.trigger;
    let triggerParams = trigger.trigger_params;

    let reportDefinitionsTableEntry = {
      id: item._id,
      reportName: reportParams.report_name,
      type: trigger.trigger_type,
      owner: 'davidcui', // Todo: replace
      source: reportParams.report_source,
      baseUrl: reportParams.core_params.base_url,
      lastUpdated: reportDefinition.last_updated,
      details: triggerParams ? triggerParams.schedule_type : `\u2014`, // e.g. recurring, cron based
      status: reportDefinition.status,
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

export const generateReportById = async (reportId, httpClient) => {
  await httpClient
    .post(`../api/reporting/generateReport/${reportId}`)
    .then(async (response) => {
      //TODO: duplicate code, extract to be a function that can reuse. e.g. handleResponse(response)
      const fileFormat = extractFileFormat(response['filename']);
      const fileName = response['filename'];
      await readStreamToFile(await response['data'], fileFormat, fileName);
      return response;
    })
    .catch((error) => {
      console.log('error on generating report by id:', error);
    });
};
