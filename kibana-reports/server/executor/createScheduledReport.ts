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
} from '../routes/utils/constants';
import { updateReportState, saveReport } from '../routes/utils/helpers';
import { ILegacyClusterClient, Logger } from '../../../../src/core/server';
import { createSavedSearchReport } from '../routes/utils/savedSearchReportHelper';
import { ReportSchemaType } from '../model';
import { CreateReportResultType } from '../routes/utils/types';
import { createVisualReport } from '../routes/utils/visualReportHelper';
import { deliverReport } from '../routes/lib/deliverReport';

export const createScheduledReport = async (
  report: ReportSchemaType,
  esClient: ILegacyClusterClient,
  notificationClient: ILegacyClusterClient,
  logger: Logger
): Promise<CreateReportResultType> => {
  const isScheduledTask = true;
  let createReportResult: CreateReportResultType;
  let reportId;
  // create new report instance and set report state to "pending"

  const esResp = await saveReport(isScheduledTask, report, esClient);
  reportId = esResp._id;

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

    await updateReportState(
      isScheduledTask,
      reportId,
      esClient,
      REPORT_STATE.created,
      createReportResult
    );

    // deliver report
    createReportResult = await deliverReport(
      report,
      createReportResult,
      notificationClient,
      esClient,
      reportId,
      isScheduledTask
    );
  } catch (error) {
    // update report instance with "error" state
    //TODO: save error detail and display on UI

    await updateReportState(
      isScheduledTask,
      reportId,
      esClient,
      REPORT_STATE.error
    );
    throw error;
  }

  return createReportResult;
};
