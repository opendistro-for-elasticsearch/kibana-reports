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
  FORMAT,
  REPORT_DEFINITION_STATUS,
  REPORT_STATE,
  REPORT_TYPE,
  TRIGGER_TYPE,
} from './constants';
import { CreateReportResultType } from './types';
import { ReportDefinitionSchemaType, ReportSchemaType } from 'server/model';
import {
  BACKEND_REPORT_FORMAT,
  BACKEND_REPORT_SOURCE,
  BACKEND_REPORT_STATE,
  REPORT_FORMAT_DICT,
  REPORT_SOURCE_DICT,
  REPORT_STATE_DICT,
} from '../../model/backendModel';

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
    report_params: {
      report_name: reportName,
      description,
      report_source: reportSource,
      core_params: {
        time_duration: timeDuration,
        report_format: reportFormat,
        saved_search_id: savedSearchId,
      },
    },
  } = report.report_definition;

  const reqBody = {
    beginTimeMs: report.time_from,
    endTimeMs: report.time_to,
    reportDefinitionDetails: {
      id: uuidv1(),
      lastUpdatedTimeMs: timePending,
      createdTimeMs: timePending,
      reportDefinition: {
        name: reportName,
        isEnabled: true,
        source: {
          description: description,
          type: getBackendReportSource(reportSource),
          id: savedSearchId || 'fakeDashboardAndVisualizationIdForNow', //TODO:
        },
        format: {
          duration: timeDuration,
          fileFormat: getBackendReportFormat(reportFormat),
        },
        trigger: {
          triggerType: 'Download', // TODO:
        },
      },
    },
    status: getBackendReportState(REPORT_STATE.pending), // download from in-context menu should always pass executing state to backend
    inContextDownloadUrlPath: report.query_url,
  };
  return reqBody;
};

const getBackendReportFormat = (
  reportFormat: FORMAT
): BACKEND_REPORT_FORMAT => {
  return REPORT_FORMAT_DICT[reportFormat];
};

export const getBackendReportState = (
  reportState: REPORT_STATE
): BACKEND_REPORT_STATE => {
  return REPORT_STATE_DICT[reportState];
};

export const getBackendReportSource = (
  reportSource: REPORT_TYPE
): BACKEND_REPORT_SOURCE => {
  return REPORT_SOURCE_DICT[reportSource];
};

// The only thing can be updated of a report instance is its "state"
export const updateReportState = async (
  isScheduledTask: boolean,
  reportId: string,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  state: REPORT_STATE,
  createReportResult?: CreateReportResultType
) => {
  // const timeStamp = createReportResult
  //   ? createReportResult.timeCreated
  //   : Date.now();
  // // update report document with state "created" or "error"
  // const updateParams: RequestParams.Update = {
  //   id: reportId,
  //   index: CONFIG_INDEX_NAME.report,
  //   body: {
  //     doc: {
  //       state: state,
  //       last_updated: timeStamp,
  //       time_created: timeStamp,
  //     },
  //   },
  // };

  //Build request body
  const reqBody = {
    reportInstanceId: reportId,
    status: getBackendReportState(state),
  };

  const esResp = await callCluster(
    esClient,
    'es_reports.updateReportInstanceStatus',
    {
      reportId: reportId,
      body: reqBody,
    },
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
