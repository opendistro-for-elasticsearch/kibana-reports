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
  LOCAL_HOST,
  SECURITY_AUTH_COOKIE_NAME,
  DELIVERY_TYPE,
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
import { SetCookie } from 'puppeteer';
import { deliverReport } from './deliverReport';
import { updateReportState } from './updateReportState';
import { saveReport } from './saveReport';

export const createReport = async (
  request: KibanaRequest,
  context: RequestHandlerContext,
  report: ReportSchemaType,
  savedReportId?: string
): Promise<CreateReportResultType> => {
  const isScheduledTask = false;
  //@ts-ignore
  const logger: Logger = context.reporting_plugin.logger;
  // @ts-ignore
  const notificationClient: ILegacyScopedClusterClient = context.reporting_plugin.notificationClient.asScoped(
    request
  );
  // @ts-ignore
  const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
    request
  );
  const esClient = context.core.elasticsearch.legacy.client;

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
      const completeQueryUrl = `${LOCAL_HOST}${report.query_url}`;
      // Check if security is enabled. TODO: is there a better way to check?
      let cookieObject: SetCookie | undefined;
      if (request.headers.cookie) {
        const cookies = request.headers.cookie.split(';');
        cookies.map((item: string) => {
          const cookie = item.trim().split('=');
          if (cookie[0] === SECURITY_AUTH_COOKIE_NAME) {
            cookieObject = {
              name: cookie[0],
              value: cookie[1],
              url: completeQueryUrl,
            };
          }
        });
      }

      createReportResult = await createVisualReport(
        reportParams,
        completeQueryUrl,
        logger,
        cookieObject
      );
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
