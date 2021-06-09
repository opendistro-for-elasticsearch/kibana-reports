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

import puppeteer, { SetCookie, Headers } from 'puppeteer-core';
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

export const createVisualReport = async (
  reportParams: ReportParamsSchemaType,
  queryUrl: string,
  logger: Logger,
  cookie?: SetCookie,
  additionalheaders?: Headers,
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
      '--font-render-hinting=none',
    ],
    executablePath: CHROMIUM_PATH,
    ignoreHTTPSErrors: true,
    env: {
      TZ: timezone || 'UTC',
    },
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(100000); // use 100s timeout instead of default 30s
  if (cookie) {
    logger.info('domain enables security, use session cookie to access');
    await page.setCookie(cookie);
  }
  if (additionalheaders) {
    logger.info('domain passed proxy auth headers, passing to backend');
    await page.setExtraHTTPHeaders(additionalheaders);
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
  // remove unwanted elements
  await page.evaluate(
    /* istanbul ignore next */
    (reportSource, REPORT_TYPE) => {
      // remove buttons
      document
        .querySelectorAll("[class^='euiButton']")
        .forEach((e) => e.remove());
      // remove top navBar
      document
        .querySelectorAll("[class^='euiHeader']")
        .forEach((e) => e.remove());
      // remove visualization editor
      if (reportSource === REPORT_TYPE.visualization) {
        document
          .querySelector('[data-test-subj="splitPanelResizer"]')
          ?.remove();
        document.querySelector('.visEditor__collapsibleSidebar')?.remove();
      }
      document.body.style.paddingTop = '0px';
    },
    reportSource,
    REPORT_TYPE
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

  // wait for dynamic page content to render
  await waitForDynamicContent(page);

  await addReportStyle(page);
  await addReportHeader(page, reportHeader);
  await addReportFooter(page, reportFooter);

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

const addReportStyle = async (page: puppeteer.Page) => {
  const css = fs.readFileSync(`${__dirname}/style.css`).toString();

  await page.evaluate(
    /* istanbul ignore next */
    (style: string) => {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = style;
      document.getElementsByTagName('head')[0].appendChild(styleElement);
    },
    css
  );
};

const addReportHeader = async (page: puppeteer.Page, header: string) => {
  const headerHtml = fs
    .readFileSync(`${__dirname}/header_template.html`)
    .toString()
    .replace('<!--CONTENT-->', header);

  await page.evaluate(
    /* istanbul ignore next */
    (headerHtml: string) => {
      const content = document.body.firstChild;
      const headerContainer = document.createElement('div');
      headerContainer.className = 'reportWrapper';
      headerContainer.innerHTML = headerHtml;
      content?.parentNode?.insertBefore(headerContainer, content);
    },
    headerHtml
  );
};

const addReportFooter = async (page: puppeteer.Page, footer: string) => {
  const headerHtml = fs
    .readFileSync(`${__dirname}/footer_template.html`)
    .toString()
    .replace('<!--CONTENT-->', footer);

  await page.evaluate(
    /* istanbul ignore next */
    (headerHtml: string) => {
      const content = document.body.firstChild;
      const headerContainer = document.createElement('div');
      headerContainer.className = 'reportWrapper';
      headerContainer.innerHTML = headerHtml;
      content?.parentNode?.insertBefore(headerContainer, null);
    },
    headerHtml
  );
};

// add waitForDynamicContent function
const waitForDynamicContent = async (
  page,
  timeout = 30000,
  interval = 1000,
  checks = 5
) => {
  const maxChecks = timeout / interval;
  let passedChecks = 0;
  let previousLength = 0;

  let i = 0;
  while (i++ <= maxChecks) {
    let pageContent = await page.content();
    let currentLength = pageContent.length;

    previousLength === 0 || previousLength != currentLength
      ? (passedChecks = 0)
      : passedChecks++;
    if (passedChecks >= checks) {
      break;
    }

    previousLength = currentLength;
    await page.waitFor(interval);
  }
};
