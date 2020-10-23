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
} from '../utils/constants';
import { updateReportState, saveReport } from '../utils/helpers';
import {
  ILegacyScopedClusterClient,
  KibanaRequest,
  Logger,
  RequestHandlerContext,
} from '../../../../../src/core/server';
import { createSavedSearchReport } from '../utils/savedSearchReportHelper';
import { ReportSchemaType } from '../../model';
import { CreateReportResultType } from '../utils/types';
import { createVisualReport } from '../utils/visualReportHelper';
import { SetCookie } from 'puppeteer';
import { deliverReport } from './deliverReport';

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
  const esClient = context.core.elasticsearch.legacy.client;

  let createReportResult: CreateReportResultType;
  let reportId;
  // create new report instance and set report state to "pending"
  if (savedReportId) {
    reportId = savedReportId;
  } else {
    const esResp = await saveReport(isScheduledTask, report, esClient);
    reportId = esResp._id;
  }

  const reportDefinition = report.report_definition;
  const reportParams = reportDefinition.report_params;
  const reportSource = reportParams.report_source;

  // compose url
  const queryUrl = `${LOCAL_HOST}${report.query_url}`;
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
      let cookieObject: SetCookie | undefined;
      if (request.headers.cookie) {
        const cookies = request.headers.cookie.split(';');
        cookies.map((item: string) => {
          const cookie = item.trim().split('=');
          if (cookie[0] === SECURITY_AUTH_COOKIE_NAME) {
            cookieObject = {
              name: cookie[0],
              value: cookie[1],
              url: queryUrl,
            };
          }
        });
      }

      createReportResult = await createVisualReport(
        reportParams,
        queryUrl,
        logger,
        cookieObject
      );
    }
    // update report state to "created"
    if (!savedReportId) {
      await updateReportState(
        isScheduledTask,
        reportId,
        esClient,
        REPORT_STATE.created,
        createReportResult
      );
    }

    // deliver report
    if (!savedReportId) {
      createReportResult = await deliverReport(
        report,
        createReportResult,
        notificationClient,
        esClient,
        reportId,
        isScheduledTask,
        logger
      );
    }
  } catch (error) {
    // update report instance with "error" state
    //TODO: save error detail and display on UI
    if (!savedReportId) {
      await updateReportState(
        isScheduledTask,
        reportId,
        esClient,
        REPORT_STATE.error
      );
    }
    throw error;
  }

  return createReportResult;
};
