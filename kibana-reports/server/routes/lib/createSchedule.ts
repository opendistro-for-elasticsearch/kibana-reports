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

import { ReportDefinitionSchemaType } from 'server/model';
import {
  KibanaRequest,
  RequestHandlerContext,
} from '../../../../../src/core/server';
import { TRIGGER_TYPE } from '../utils/constants';

export const createSchedule = async (
  request: KibanaRequest,
  reportDefinitionId: string,
  context: RequestHandlerContext
) => {
  const reportDefinition: ReportDefinitionSchemaType = request.body;
  const trigger = reportDefinition.trigger;
  const triggerType = trigger.trigger_type;
  const triggerParams = trigger.trigger_params;

  // @ts-ignore
  const schedulerClient: ILegacyScopedClusterClient = context.reporting_plugin.schedulerClient.asScoped(
    request
  );

  if (triggerType === TRIGGER_TYPE.schedule) {
    const schedule = triggerParams.schedule;

    // compose the request body
    const scheduledJob = {
      schedule: schedule,
      name: `${reportDefinition.report_params.report_name}_schedule`,
      enabled: triggerParams.enabled,
      report_definition_id: reportDefinitionId,
      enabled_time: triggerParams.enabled_time,
    };
    // send to reports-scheduler to create a scheduled job
    const res = await schedulerClient.callAsCurrentUser(
      'reports_scheduler.createSchedule',
      {
        jobId: reportDefinitionId,
        body: scheduledJob,
      }
    );

    return res;
  } else if (triggerType == TRIGGER_TYPE.onDemand) {
    /*
     * TODO: return nothing for on Demand report, because currently on-demand report is handled by client side,
     * by hitting the create report http endpoint with data to get a report downloaded. Server side only saves
     * that on-demand report definition into the index. Need further discussion on what behavior we want
     * await createReport(reportDefinition, esClient);
     */
    return;
  }
  // else if (triggerType == TRIGGER_TYPE.alerting) {
  //TODO: add alert-based scheduling logic [enhancement feature]
};
