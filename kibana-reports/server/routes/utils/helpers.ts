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
import { RequestParams } from '@elastic/elasticsearch';
import {
  CONFIG_INDEX_NAME,
  REPORT_DEFINITION_STATUS,
  REPORT_STATE,
  TRIGGER_TYPE,
} from './constants';
import { CreateReportResultType } from './types';
import { ReportDefinitionSchemaType, ReportSchemaType } from 'server/model';

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
    esResp = await client.callAsInternalUser(endpoint, params);
  } else {
    esResp = await client.callAsCurrentUser(endpoint, params);
  }
  return esResp;
};

export const saveReport = async (
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

// The only thing can be updated of a report instance is its "state"
export const updateReportState = async (
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

export const saveReportDefinition = async (
  reportDefinition: ReportDefinitionSchemaType,
  esClient: ILegacyScopedClusterClient
) => {
  const toSave = {
    report_definition: {
      ...reportDefinition,
      time_created: Date.now(),
      last_updated: Date.now(),
      status: REPORT_DEFINITION_STATUS.active,
    },
  };

  const params: RequestParams.Index = {
    index: CONFIG_INDEX_NAME.reportDefinition,
    body: toSave,
  };

  const esResp = await esClient.callAsCurrentUser('index', params);

  return esResp;
};

export const updateReportDefinition = async (
  reportDefinitionId: string,
  reportDefinition: ReportDefinitionSchemaType,
  esClient: ILegacyScopedClusterClient
) => {
  let newStatus = REPORT_DEFINITION_STATUS.active;
  /**
   * "enabled = false" means de-scheduling a job.
   * TODO: also need to remove any job in queue and release lock, consider do that
   * within the createSchedule API exposed from reports-scheduler
   */
  if (reportDefinition.trigger.trigger_type == TRIGGER_TYPE.schedule) {
    const enabled = reportDefinition.trigger.trigger_params.enabled;
    newStatus = enabled
      ? REPORT_DEFINITION_STATUS.active
      : REPORT_DEFINITION_STATUS.disabled;
  }

  const toUpdate = {
    report_definition: {
      ...reportDefinition,
      last_updated: Date.now(),
      status: newStatus,
    },
  };

  const params: RequestParams.Index = {
    id: reportDefinitionId,
    index: CONFIG_INDEX_NAME.reportDefinition,
    body: toUpdate,
  };
  const esResp = await esClient.callAsCurrentUser('index', params);

  return esResp;
};
