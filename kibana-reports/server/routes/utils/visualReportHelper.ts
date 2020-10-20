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
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Logger } from '../../../../../src/core/server';
import {
  DEFAULT_REPORT_HEADER,
  DEFAULT_REPORT_FOOTER,
  REPORT_TYPE,
  FORMAT,
} from './constants';
import { getFileName } from './helpers';
import { CreateReportResultType } from './types';

export const createVisualReport = async (
  reportParams: any,
  queryUrl: string,
  logger: Logger
): Promise<CreateReportResultType> => {
  const coreParams = reportParams.core_params;
  // parse params
  const reportSource = reportParams.report_source;
  const reportName = reportParams.report_name;
  const windowWidth = coreParams.window_width;
  const windowHeight = coreParams.window_height;
  const reportFormat = coreParams.report_format;

  // TODO: polish default header, maybe add a logo, depends on UX design
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  const header = coreParams.header
    ? DOMPurify.sanitize(coreParams.header)
    : DEFAULT_REPORT_HEADER;
  const footer = coreParams.footer
    ? DOMPurify.sanitize(coreParams.footer)
    : DEFAULT_REPORT_FOOTER;

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
  logger.info(`original queryUrl ${queryUrl}`);
  await page.goto(queryUrl, { waitUntil: 'networkidle0' });
  logger.info(`page url ${page.url()}`);
  logger.info(`page url includes login? ${page.url().includes('login')}`);

  /**
   * TODO: This is a workaround to simulate a login to security enabled domain.
   * Need better handle.
   */
  if (page.url().includes('login')) {
    logger.info(
      'domain enables security, redirecting to login page, start simulating login'
    );
    await page.type('[placeholder=Username]', 'admin', { delay: 30 });
    await page.type('[placeholder=Password]', 'admin', { delay: 30 });
    await page.click("[type='submit']");
    await page.waitForNavigation();
    logger.info(
      `Done logging in, currently at page: ${page.url()} \nGo to queryUrl again`
    );
    await page.goto(queryUrl, { waitUntil: 'networkidle0' });
    logger.info(`wait for network idle, the current page url: ${page.url()}`);
  }

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
  // TODO: need to convert header from markdown to html, either do it on server side, or on client side.
  // Email body conversion is done from client side
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <div>
      ${header}
        <img src="data:image/png;base64,${screenshot.toString('base64')}">
      ${footer}
      </div>
    </html>
    `);

  // create pdf or png accordingly
  if (reportFormat === FORMAT.pdf) {
    const scrollHeight = await page.evaluate(
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
