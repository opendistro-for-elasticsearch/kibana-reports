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

import 'babel-polyfill';
import { HttpFetchOptions, HttpSetup } from '../../../../../src/core/public';

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
      timeCreated: report.time_created,
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
      owner: `\u2014`, // Todo: replace
      source: reportParams.report_source,
      baseUrl: reportParams.core_params.base_url,
      lastUpdated: reportDefinition.last_updated,
      details:
        trigger.trigger_type === 'On demand'
          ? `\u2014`
          : triggerParams.schedule_type, // e.g. recurring, cron based
      status: reportDefinition.status,
    };
    reportDefinitionsTableItems.push(reportDefinitionsTableEntry);
  }
  return reportDefinitionsTableItems;
};

export const removeDuplicatePdfFileFormat = (filename) => {
  return filename.substring(0, filename.length - 4);
};

export const readDataReportToFile = async (
  stream: string,
  fileFormat: string,
  fileName: string
) => {
  const blob = new Blob([stream]);
  const url = URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const readStreamToFile = async (
  stream: string,
  fileFormat: string,
  fileName: string
) => {
  let link = document.createElement('a');
  if (fileName.includes('csv')) {
    readDataReportToFile(stream, fileFormat, fileName);
    return;
  }
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

export const generateReportFromDefinitionId = async (
  reportDefinitionId,
  httpClient: HttpSetup
) => {
  let status = false;
  let permissionsError = false;
  await httpClient
    .post(`../api/reporting/generateReport/${reportDefinitionId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      query: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    })
    .then(async (response: any) => {
      // for emailing a report, this API response doesn't have response body
      if (response) {
        const fileFormat = extractFileFormat(response['filename']);
        const fileName = response['filename'];
        await readStreamToFile(await response['data'], fileFormat, fileName);
      }
      status = true;
    })
    .catch((error) => {
      console.log('error on generating report:', error);
      if (error.body.statusCode === 403) {
        permissionsError = true;
      }
      status = false;
    });
  return {
    status: status,
    permissionsError: permissionsError,
  };
};

export const generateReportById = async (
  reportId,
  httpClient: HttpSetup,
  handleSuccessToast,
  handleErrorToast,
  handlePermissionsMissingToast
) => {
  await httpClient
    .get(`../api/reporting/generateReport/${reportId}`, {
      query: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    })
    .then(async (response) => {
      //TODO: duplicate code, extract to be a function that can reuse. e.g. handleResponse(response)
      const fileFormat = extractFileFormat(response['filename']);
      const fileName = response['filename'];
      await readStreamToFile(await response['data'], fileFormat, fileName);
      handleSuccessToast();
      return response;
    })
    .catch((error) => {
      console.log('error on generating report by id:', error);
      if (error.body.statusCode === 403) {
        handlePermissionsMissingToast();
      } else if (error.body.statusCode === 503) {
        handleErrorToast('Server busy, please try again later.')
      } else {
        handleErrorToast();
      }
    });
};
