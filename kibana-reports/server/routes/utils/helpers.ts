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

import { KibanaResponseFactory } from '../../../../../src/core/server';
import { v1 as uuidv1 } from 'uuid';
import {
  ILegacyClusterClient,
  ILegacyScopedClusterClient,
} from '../../../../../src/core/server';
import { REPORT_STATE } from './constants';
import { ReportSchemaType } from 'server/model';
import { BACKEND_REPORT_STATE } from '../../model/backendModel';
import {
  getBackendReportState,
  uiToBackendReportDefinition,
} from './converters/uiToBackend';

export function parseEsErrorResponse(error: any) {
  if (error.response) {
    try {
      const esErrorResponse = JSON.parse(error.response);
      return esErrorResponse.reason || error.response;
    } catch (parsingError) {
      return error.response;
    }
  }
  return error.message;
}

export function errorResponse(response: KibanaResponseFactory, error: any) {
  return response.custom({
    statusCode: error.statusCode || 500,
    body: parseEsErrorResponse(error),
  });
}

/**
 * Generate report file name based on name and timestamp.
 * @param itemName      report item name
 * @param timeCreated   timestamp when this is being created
 */
export function getFileName(itemName: string, timeCreated: Date): string {
  return `${itemName}_${timeCreated.toISOString()}_${uuidv1()}`;
}

/**
 * Call ES cluster function.
 * @param client    ES client
 * @param endpoint  ES API method
 * @param params    ES API parameters
 */
export const callCluster = async (
  client: ILegacyClusterClient | ILegacyScopedClusterClient,
  endpoint: string,
  params: any,
  isScheduledTask: boolean
) => {
  let esResp;
  if (isScheduledTask) {
    esResp = await (client as ILegacyClusterClient).callAsInternalUser(
      endpoint,
      params
    );
  } else {
    esResp = await (client as ILegacyScopedClusterClient).callAsCurrentUser(
      endpoint,
      params
    );
  }
  return esResp;
};

export const saveReport = async (
  isScheduledTask: boolean,
  report: ReportSchemaType,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient
) => {
  const reqBody = buildReqBody(report);

  const esResp = await callCluster(
    esClient,
    'es_reports.createReport',
    {
      body: reqBody,
    },
    isScheduledTask
  );

  return esResp;
};

export const buildReqBody = (report: ReportSchemaType): any => {
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
  return reqBody;
};

// The only thing can be updated of a report instance is its "state"
export const updateReportState = async (
  isScheduledTask: boolean,
  reportId: string,
  esReportsClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  state: REPORT_STATE
) => {
  //Build request body
  const reqBody = {
    reportInstanceId: reportId,
    status: getBackendReportState(state),
  };

  const esResp = await callCluster(
    esReportsClient,
    'es_reports.updateReportInstanceStatus',
    {
      reportId: reportId,
      body: reqBody,
    },
    isScheduledTask
  );

  return esResp;
};
