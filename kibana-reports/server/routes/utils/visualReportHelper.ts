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

import puppeteer, { ElementHandle, SetCookie } from 'puppeteer';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Logger } from '../../../../../src/core/server';
import {
  DEFAULT_REPORT_HEADER,
  REPORT_TYPE,
  FORMAT,
  SELECTOR,
} from './constants';
import { getFileName } from './helpers';
import { CreateReportResultType } from './types';
import { ReportParamsSchemaType, VisualReportSchemaType } from 'server/model';

export const createVisualReport = async (
  reportParams: ReportParamsSchemaType,
  queryUrl: string,
  logger: Logger,
  cookie?: SetCookie
): Promise<CreateReportResultType> => {
  const {
    core_params,
    report_name: reportName,
    report_source: reportSource,
  } = reportParams;
  const coreParams = core_params as VisualReportSchemaType;
  const {
    header,
    footer,
    window_height: windowHeight,
    window_width: windowWidth,
    report_format: reportFormat,
  } = coreParams;

  // TODO: polish default header, maybe add a logo, depends on UX design
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  const reportHeader = header
    ? DOMPurify.sanitize(header)
    : DEFAULT_REPORT_HEADER;
  const reportFooter = footer ? DOMPurify.sanitize(footer) : '';

  // set up puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    /**
     * TODO: temp fix to disable sandbox when launching chromium on Linux instance
     * https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
     */
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(60000); // use 60s timeout instead of default 30s
  if (cookie) {
    logger.info('domain enables security, use session cookie to access');
    await page.setCookie(cookie);
  }
  logger.info(`original queryUrl ${queryUrl}`);
  await page.goto(queryUrl, { waitUntil: 'networkidle0' });
  logger.info(`page url ${page.url()}`);

  await page.setViewport({
    width: windowWidth,
    height: windowHeight,
  });

  let buffer: Buffer;
  let element: ElementHandle<Element>;
  // remove top nav bar
  await page.evaluate(
    /* istanbul ignore next */
    (selector) => {
      document.querySelector(selector)?.remove();
    },
    SELECTOR.topNavBar
  );
  // crop content
  switch (reportSource) {
    case REPORT_TYPE.dashboard:
      element = await page.waitForSelector(SELECTOR.dashboard);
      break;
    case REPORT_TYPE.visualization:
      element = await page.waitForSelector(SELECTOR.visualization);
      break;
    default:
      throw Error(
        `report source can only be one of [Dashboard, Visualization]`
      );
  }

  const screenshot = await element.screenshot({ fullPage: false });

  /**
   * Sets the content of the page to have the header be above the trimmed screenshot
   * and the footer be below it
   */
  // TODO: make all html templates into files, such as reporting context menu button, and embedded html of email body
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: "Inter UI", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-kerning: normal;
          }
        </style>
      </head>
      <body>
        <div>
        ${reportHeader}
          <img src="data:image/png;base64,${screenshot.toString('base64')}">
        ${reportFooter}
        </div>
      </body>
    </html>
    `);

  // create pdf or png accordingly
  if (reportFormat === FORMAT.pdf) {
    const scrollHeight = await page.evaluate(
      /* istanbul ignore next */
      () => document.documentElement.scrollHeight
    );

    buffer = await page.pdf({
      margin: undefined,
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
  const fileName = `${getFileName(reportName, curTime)}.${reportFormat}`;
  await browser.close();

  return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
};
