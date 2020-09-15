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

import puppeteer from 'puppeteer';
import { v1 as uuidv1 } from 'uuid';
import {
  FORMAT,
  REPORT_TYPE,
  REPORT_STATE,
  CONFIG_INDEX_NAME,
} from './constants';
import { RequestParams } from '@elastic/elasticsearch';
import {
  IClusterClient,
  IScopedClusterClient,
} from '../../../../../src/core/server';
import { ReportSchemaType } from '../../model';

export const createVisualReport = async (
  reportParams: any,
  queryUrl: string
): Promise<{ timeCreated: number; dataUrl: string; fileName: string }> => {
  const coreParams = reportParams.core_params;
  // parse params
  const reportSource = reportParams.report_source;
  const reportName = reportParams.report_name;
  const windowWidth = coreParams.window_width;
  const windowHeight = coreParams.window_height;
  const reportFormat = coreParams.report_format;

  // TODO: replace placeholders with actual schema data fields
  const header = 'Test report header sample text';
  const footer = 'Test report footer sample text';
  // set up puppeteer
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(queryUrl, { waitUntil: 'networkidle0' });
  await page.setViewport({
    width: windowWidth,
    height: windowHeight,
  });

  let buffer;
  let element;
  // crop content
  if (reportSource === REPORT_TYPE.dashboard) {
    await page.waitForSelector('#dashboardViewport');
    element = await page.$('#dashboardViewport');
  } else if (reportSource === REPORT_TYPE.visualization) {
    await page.waitForSelector('.visChart');
    element = await page.$('.visChart');
  }

  const screenshot = await element.screenshot({ fullPage: false });

  /**
   * Sets the content of the page to have the header be above the trimmed screenshot
   * and the footer be below it
   */
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <div>
      <h1>${header}</h1>
        <img src="data:image/png;base64,${screenshot.toString('base64')}">
      <h1>${footer}</h1>
      </div>
    </html>
    `);

  // create pdf or png accordingly
  if (reportFormat === FORMAT.pdf) {
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    );

    buffer = await page.pdf({
      margin: 'none',
      width: windowWidth,
      height: scrollHeight + 'px',
      printBackground: true,
      pageRanges: '1',
    });
  } else if (reportFormat === FORMAT.png) {
    buffer = await page.screenshot({
      fullPage: true,
    });
  }

  const curTime = new Date();
  const timeCreated = curTime.valueOf();
  const fileName = getFileName(reportName, curTime) + '.' + reportFormat;
  await browser.close();

  return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
};

export const createReport = async (
  report: ReportSchemaType,
  client: IClusterClient | IScopedClusterClient,
  savedReportId?: string
): Promise<{ timeCreated: number; dataUrl: string; fileName: string }> => {
  let createReportResult: {
    timeCreated: number;
    dataUrl: string;
    fileName: string;
  };

  // create new report instance or update saved report instance with "pending" state
  const timePending = Date.now();
  const saveParams: RequestParams.Index = {
    index: CONFIG_INDEX_NAME.report,
    id: savedReportId,
    body: {
      ...report,
      state: REPORT_STATE.pending,
      time_created: timePending,
    },
  };

  const esResp = await callCluster(client, 'index', saveParams);
  const reportId = esResp._id;

  const reportDefinition = report.report_definition;
  const reportParams = reportDefinition.report_params;
  const reportSource = reportParams.report_source;
  try {
    if (reportSource === REPORT_TYPE.savedSearch) {
      // TODO: Add createDataReport(report)
      console.log('placeholder for createDataReport');
    } else if (
      reportSource === REPORT_TYPE.dashboard ||
      reportSource === REPORT_TYPE.visualization
    ) {
      const queryUrl = report.query_url;
      createReportResult = await createVisualReport(reportParams, queryUrl);
    }
  } catch (error) {
    // update report instance with "error" state
    const timeError = Date.now();
    const updateParams: RequestParams.Update = {
      id: reportId,
      index: CONFIG_INDEX_NAME.report,
      body: {
        doc: {
          state: REPORT_STATE.error,
          time_created: timeError,
        },
      },
    };

    await callCluster(client, 'update', updateParams);

    throw error;
  }

  // update report document with state "created" and time_created
  const updateParams: RequestParams.Update = {
    id: reportId,
    index: CONFIG_INDEX_NAME.report,
    body: {
      doc: {
        time_created: createReportResult.timeCreated,
        state: REPORT_STATE.created,
      },
    },
  };

  await callCluster(client, 'update', updateParams);

  return createReportResult;
};

function getFileName(itemName: string, timeCreated: Date): string {
  return `${itemName}_${timeCreated.toISOString()}_${uuidv1()}`;
}

const callCluster = async (
  client: IClusterClient | IScopedClusterClient,
  endpoint: string,
  params: any
) => {
  let esResp;
  if ('callAsCurrentUser' in client) {
    esResp = await client.callAsCurrentUser(endpoint, params);
  } else {
    esResp = await client.callAsInternalUser(endpoint, params);
  }
  return esResp;
};
