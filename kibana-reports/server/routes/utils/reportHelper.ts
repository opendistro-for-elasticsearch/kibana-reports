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
import {
  FORMAT,
  REPORT_TYPE,
  REPORT_STATE,
  CONFIG_INDEX_NAME,
  LOCAL_HOST,
  DELIVERY_TYPE,
  EMAIL_FORMAT,
} from './constants';
import { RequestParams } from '@elastic/elasticsearch';
import { getFileName, callCluster } from './helpers';
import {
  ILegacyClusterClient,
  ILegacyScopedClusterClient,
} from '../../../../../src/core/server';
import { createSavedSearchReport } from './savedSearchReportHelper';
import { ReportSchemaType } from '../../model';
import { CreateReportResultType } from './types';

export const createVisualReport = async (
  reportParams: any,
  queryUrl: string
): Promise<CreateReportResultType> => {
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
    /**
     * TODO: temp fix to disable sandbox when launching chromium on Linux instance
     * https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
     */
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
  const fileName = `${getFileName(reportName, curTime)}.${reportFormat}`;
  await browser.close();

  return { timeCreated, dataUrl: buffer.toString('base64'), fileName };
};

export const createReport = async (
  isScheduledTask: boolean,
  report: ReportSchemaType,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  notificationClient?: ILegacyClusterClient | ILegacyScopedClusterClient,
  savedReportId?: string
): Promise<CreateReportResultType> => {
  let createReportResult: CreateReportResultType;
  let reportId;
  // create new report instance and set report state to "pending"
  if (savedReportId) {
    reportId = savedReportId;
  } else {
    const esResp = await saveToES(isScheduledTask, report, esClient);
    reportId = esResp._id;
  }

  const reportDefinition = report.report_definition;
  const reportParams = reportDefinition.report_params;
  const reportSource = reportParams.report_source;

  try {
    // generate report
    if (reportSource === REPORT_TYPE.savedSearch) {
      createReportResult = await createSavedSearchReport(
        report,
        esClient,
        isScheduledTask
      );
    } else {
      // report source can only be one of [saved search, visualization, dashboard]
      const { origin } = new URL(report.query_url);
      const queryUrl = report.query_url.replace(origin, LOCAL_HOST);
      createReportResult = await createVisualReport(reportParams, queryUrl);
    }

    if (!savedReportId) {
      await updateToES(
        isScheduledTask,
        reportId,
        esClient,
        REPORT_STATE.created,
        createReportResult
      );
    }

    // deliver report
    if (notificationClient) {
      createReportResult = await deliverReport(
        report,
        createReportResult,
        notificationClient,
        esClient,
        reportId,
        isScheduledTask
      );
    }
  } catch (error) {
    // update report instance with "error" state
    //TODO: save error detail and display on UI
    if (!savedReportId) {
      await updateToES(isScheduledTask, reportId, esClient, REPORT_STATE.error);
    }
    throw error;
  }

  return createReportResult;
};

export const saveToES = async (
  isScheduledTask: boolean,
  report: ReportSchemaType,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient
) => {
  const timePending = Date.now();
  const saveParams: RequestParams.Index = {
    index: CONFIG_INDEX_NAME.report,
    body: {
      ...report,
      state: REPORT_STATE.pending,
      last_updated: timePending,
      time_created: timePending,
    },
  };
  const esResp = await callCluster(
    esClient,
    'index',
    saveParams,
    isScheduledTask
  );

  return esResp;
};

export const updateToES = async (
  isScheduledTask: boolean,
  reportId: string,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  state: string,
  createReportResult?: CreateReportResultType
) => {
  const timeStamp = createReportResult
    ? createReportResult.timeCreated
    : Date.now();
  // update report document with state "created" or "error"
  const updateParams: RequestParams.Update = {
    id: reportId,
    index: CONFIG_INDEX_NAME.report,
    body: {
      doc: {
        state: state,
        last_updated: timeStamp,
        time_created: timeStamp,
      },
    },
  };
  const esResp = await callCluster(
    esClient,
    'update',
    updateParams,
    isScheduledTask
  );

  return esResp;
};

export const deliverReport = async (
  report: ReportSchemaType,
  reportData: CreateReportResultType,
  notificationClient: ILegacyScopedClusterClient | ILegacyClusterClient,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  reportId: string,
  isScheduledTask: boolean
) => {
  // check delivery type
  const delivery = report.report_definition.delivery;

  let deliveryType;
  let deliveryParams;
  if (delivery) {
    deliveryType = delivery.delivery_type;
    deliveryParams = delivery.delivery_params;
  } else {
    return reportData;
  }

  if (deliveryType === DELIVERY_TYPE.channel) {
    // deliver through one of [Slack, Chime, Email]
    //@ts-ignore
    const { email_format: emailFormat, ...rest } = deliveryParams;
    // compose request body
    if (emailFormat === EMAIL_FORMAT.attachment) {
      const reportFormat =
        report.report_definition.report_params.core_params.report_format;
      const attachment = {
        fileName: reportData.fileName,
        fileEncoding: reportFormat === FORMAT.csv ? 'text' : 'base64',
        //TODO: figure out when this data field is actually needed
        // fileContentType: 'application/pdf',
        fileData: reportData.dataUrl,
      };
      const deliveryBody = {
        ...rest,
        refTag: reportId,
        attachment,
      };

      await callCluster(
        notificationClient,
        'notification.send',
        {
          body: deliveryBody,
        },
        isScheduledTask
      );
      //TODO: need better error handling or logging
    }
  } else {
    //TODO: No attachment, use embedded html (not implemented yet)
    // empty kibana recipients array
    //TODO: tmp solution
    // @ts-ignore
    if (!deliveryParams.kibana_recipients.length) {
      return reportData;
    }
  }
  // update report document with state "shared" and time_created
  await updateToES(
    isScheduledTask,
    reportId,
    esClient,
    REPORT_STATE.shared,
    reportData
  );

  return reportData;
};
