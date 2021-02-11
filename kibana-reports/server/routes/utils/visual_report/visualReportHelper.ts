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

import puppeteer, { ElementHandle, SetCookie } from 'puppeteer-core';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Logger } from '../../../../../../src/core/server';
import {
  DEFAULT_REPORT_HEADER,
  REPORT_TYPE,
  FORMAT,
  SELECTOR,
  CHROMIUM_PATH,
  SECURITY_CONSTANTS,
} from '../constants';
import { getFileName } from '../helpers';
import { CreateReportResultType } from '../types';
import { ReportParamsSchemaType, VisualReportSchemaType } from 'server/model';
import fs from 'fs';
import cheerio from 'cheerio';

export const createVisualReport = async (
  reportParams: ReportParamsSchemaType,
  queryUrl: string,
  logger: Logger,
  cookie?: SetCookie,
  timezone?: string
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
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
    ],
    executablePath: CHROMIUM_PATH,
    ignoreHTTPSErrors: true,
    env: {
      TZ: timezone || 'UTC',
    },
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
  // should add to local storage after page.goto, then access the page again - browser must have an url to register local storage item on it
  await page.evaluate(
    /* istanbul ignore next */
    (key) => {
      localStorage.setItem(key, 'false');
    },
    SECURITY_CONSTANTS.TENANT_LOCAL_STORAGE_KEY
  );
  await page.goto(queryUrl, { waitUntil: 'networkidle0' });
  logger.info(`page url ${page.url()}`);

  await page.setViewport({
    width: windowWidth,
    height: windowHeight,
  });

  let buffer: Buffer;
  // remove top nav bar
  await page.evaluate(
    /* istanbul ignore next */
    () => {
      // remove buttons
      document
        .querySelectorAll("[class^='euiButton']")
        .forEach((e) => e.remove());
      // remove top navBar
      document
        .querySelectorAll("[class^='euiHeader']")
        .forEach((e) => e.remove());
      document.body.style.paddingTop = '0px';
    }
  );
  // force wait for any resize to load after the above DOM modification
  await page.waitFor(1000);
  // crop content
  switch (reportSource) {
    case REPORT_TYPE.dashboard:
      await page.waitForSelector(SELECTOR.dashboard, {
        visible: true,
      });
      break;
    case REPORT_TYPE.visualization:
      await page.waitForSelector(SELECTOR.visualization, {
        visible: true,
      });
      break;
    default:
      throw Error(
        `report source can only be one of [Dashboard, Visualization]`
      );
  }

  const screenshot = await page.screenshot({ fullPage: true });

  const templateHtml = composeReportHtml(
    reportHeader,
    reportFooter,
    screenshot.toString('base64')
  );
  await page.setContent(templateHtml);

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

const composeReportHtml = (
  header: string,
  footer: string,
  screenshot: string
) => {
  const $ = cheerio.load(fs.readFileSync(`${__dirname}/report_template.html`), {
    decodeEntities: false,
  });

  $('.reportWrapper img').attr('src', `data:image/png;base64,${screenshot}`);
  $('#reportingHeader > div.mde-preview > div.mde-preview-content').html(
    header
  );
  if (footer === '') {
    $('#reportingFooter').attr('hidden', 'true');
  } else {
    $('#reportingFooter > div.mde-preview > div.mde-preview-content').html(
      footer
    );
  }

  return $.root().html() || '';
};
