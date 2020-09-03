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
import { FORMAT, REPORT_TYPE, REPORT_STATE } from './constants';
import { RequestParams } from '@elastic/elasticsearch';
import {
  IClusterClient,
  IScopedClusterClient,
} from '../../../../../src/core/server';

export const createVisualReport = async (
  reportParams: any
): Promise<{ timeCreated: string; dataUrl: string; fileName: string }> => {
  const coreParams = reportParams.core_params;
  // parse params
  const reportSource = reportParams.report_source;
  const name = reportParams.report_name;
  const url = coreParams.url;
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
  await page.goto(url, { waitUntil: 'networkidle0' });
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

  const timeCreated = new Date().toISOString();
  const fileName = getFileName(name, timeCreated) + '.' + reportFormat;

  //TODO: Add header and footer, phase 2

  await browser.close();
  return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
};

export const createReport = async (
  reportDefinition: any,
  client: IClusterClient | IScopedClusterClient
): Promise<{ timeCreated: string; dataUrl: string; fileName: string }> => {
  let createReportResult: {
    timeCreated: string;
    dataUrl: string;
    fileName: string;
  };

  //TODO: create new report instance with pending status
  const reportParams = reportDefinition.report_params;
  const reportSource = reportParams.report_source;

  if (reportSource === REPORT_TYPE.savedSearch) {
    // TODO: Add createDataReport(report)
    console.log('placeholder for createDataReport');
  } else if (
    reportSource === REPORT_TYPE.dashboard ||
    reportSource === REPORT_TYPE.visualization
  ) {
    createReportResult = await createVisualReport(reportParams);
  }

  // save report instance with created state
  // TODO: save report instance with error state
  const toSave = {
    report: {
      time_created: createReportResult.timeCreated,
      state: REPORT_STATE.created,
      report_definition: {
        ...reportDefinition,
      },
    },
  };

  const params: RequestParams.Index = {
    index: 'report',
    body: toSave,
  };

  //@ts-ignore
  await client.callAsInternalUser('index', params);

  return createReportResult;
};

function getFileName(itemName: string, timeCreated: string): string {
  return `${itemName}_${timeCreated}_${uuidv1()}`;
}
