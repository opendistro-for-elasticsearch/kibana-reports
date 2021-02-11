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

import {
  REPORT_TYPE,
  REPORT_STATE,
  DELIVERY_TYPE,
  SECURITY_CONSTANTS,
} from '../utils/constants';

import {
  ILegacyScopedClusterClient,
  KibanaRequest,
  Logger,
  RequestHandlerContext,
} from '../../../../../src/core/server';
import { createSavedSearchReport } from '../utils/savedSearchReportHelper';
import { ReportSchemaType } from '../../model';
import { CreateReportResultType } from '../utils/types';
import { createVisualReport } from '../utils/visual_report/visualReportHelper';
import { SetCookie } from 'puppeteer-core';
import { deliverReport } from './deliverReport';
import { updateReportState } from './updateReportState';
import { saveReport } from './saveReport';
import { SemaphoreInterface } from 'async-mutex';
import { AccessInfoType } from 'server';

export const createReport = async (
  request: KibanaRequest,
  context: RequestHandlerContext,
  report: ReportSchemaType,
  accessInfo: AccessInfoType,
  savedReportId?: string
): Promise<CreateReportResultType> => {
  const isScheduledTask = false;
  //@ts-ignore
  const logger: Logger = context.reporting_plugin.logger;
  //@ts-ignore
  const semaphore: SemaphoreInterface = context.reporting_plugin.semaphore;
  // @ts-ignore
  const notificationClient: ILegacyScopedClusterClient = context.reporting_plugin.notificationClient.asScoped(
    request
  );
  // @ts-ignore
  const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
    request
  );
  const esClient = context.core.elasticsearch.legacy.client;
  // @ts-ignore
  const timezone = request.query.timezone;
  const {
    basePath,
    serverInfo: { protocol, port, hostname },
  } = accessInfo;

  let createReportResult: CreateReportResultType;
  let reportId;

  const {
    report_definition: {
      report_params: reportParams,
      delivery: { delivery_type: deliveryType },
    },
  } = report;
  const { report_source: reportSource } = reportParams;

  try {
    // create new report instance and set report state to "pending"
    if (savedReportId) {
      reportId = savedReportId;
    } else {
      const esResp = await saveReport(report, esReportsClient);
      reportId = esResp.reportInstance.id;
    }
    // generate report
    if (reportSource === REPORT_TYPE.savedSearch) {
      createReportResult = await createSavedSearchReport(
        report,
        esClient,
        isScheduledTask
      );
    } else {
      // report source can only be one of [saved search, visualization, dashboard]
      // compose url
      const relativeUrl = report.query_url.startsWith(basePath)
        ? report.query_url
        : `${basePath}${report.query_url}`;
      const completeQueryUrl = `${protocol}://${hostname}:${port}${relativeUrl}`;
      // Check if security is enabled. TODO: is there a better way to check?
      let cookieObject: SetCookie | undefined;
      if (request.headers.cookie) {
        const cookies = request.headers.cookie.split(';');
        cookies.map((item: string) => {
          const cookie = item.trim().split('=');
          if (cookie[0] === SECURITY_CONSTANTS.AUTH_COOKIE_NAME) {
            cookieObject = {
              name: cookie[0],
              value: cookie[1],
              url: completeQueryUrl,
              path: basePath,
            };
          }
        });
      }
      const [value, release] = await semaphore.acquire();
      try {
        createReportResult = await createVisualReport(
          reportParams,
          completeQueryUrl,
          logger,
          cookieObject,
          timezone
        );
      } finally {
        release();
      }
    }
    // update report state to "created"
    // TODO: temporarily remove the following
    // if (!savedReportId) {
    //   await updateReportState(reportId, esReportsClient, REPORT_STATE.created);
    // }

    // deliver report
    if (!savedReportId && deliveryType == DELIVERY_TYPE.channel) {
      await deliverReport(
        report,
        notificationClient,
        esReportsClient,
        reportId,
        logger
      );
    }
  } catch (error) {
    // update report instance with "error" state
    // TODO: save error detail and display on UI
    // TODO: temporarily disable the following, will add back
    // if (!savedReportId) {
    //   await updateReportState(reportId, esReportsClient, REPORT_STATE.error);
    // }
    throw error;
  }

  return createReportResult;
};
