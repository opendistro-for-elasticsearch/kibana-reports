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
  FORMAT,
  REPORT_TYPE,
  REPORT_STATE,
  LOCAL_HOST,
  DELIVERY_TYPE,
  EMAIL_FORMAT,
} from './constants';
import { callCluster, updateToES, saveToES } from './helpers';
import {
  ILegacyClusterClient,
  ILegacyScopedClusterClient,
  Logger,
} from '../../../../../src/core/server';
import { createSavedSearchReport } from './savedSearchReportHelper';
import { ReportSchemaType } from '../../model';
import { CreateReportResultType } from './types';
import { createVisualReport } from './visualReportHelper';

export const createReport = async (
  isScheduledTask: boolean,
  report: ReportSchemaType,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  logger: Logger,
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
      createReportResult = await createVisualReport(
        reportParams,
        queryUrl,
        logger
      );
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

      const res = await callCluster(
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
