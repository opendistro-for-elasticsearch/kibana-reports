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

import { ReportSchemaType } from '../../model';
import { BACKEND_REPORT_STATE } from '../../model/backendModel';
import {
  ILegacyClusterClient,
  ILegacyScopedClusterClient,
} from '../../../../../src/core/server';
import { uiToBackendReportDefinition } from '../utils/converters/uiToBackend';
import { callCluster } from '../utils/helpers';

export const saveReport = async (
  isScheduledTask: boolean,
  report: ReportSchemaType,
  esReportsClient: ILegacyClusterClient | ILegacyScopedClusterClient
) => {
  const timePending = Date.now();
  const {
    time_from: timeFrom,
    time_to: timeTo,
    query_url: queryUrl,
    report_definition: reportDefinition,
  } = report;

  const reqBody = {
    beginTimeMs: timeFrom,
    endTimeMs: timeTo,
    reportDefinitionDetails: {
      id: uuidv1(),
      lastUpdatedTimeMs: timePending,
      createdTimeMs: timePending,
      reportDefinition: {
        ...uiToBackendReportDefinition(reportDefinition),
        trigger: {
          triggerType: 'Download', // TODO: this is a corner case for in-context menu button download only
        },
      },
    },
    status: BACKEND_REPORT_STATE.executing, // download from in-context menu should always pass executing state to backend
    inContextDownloadUrlPath: queryUrl,
  };

  const esResp = await callCluster(
    esReportsClient,
    'es_reports.createReport',
    {
      body: reqBody,
    },
    isScheduledTask
  );

  return esResp;
};
