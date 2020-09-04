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

import { IClusterClient, Logger } from '../../../../src/core/server';
import { createReport } from '../routes/utils/reportHelper';
import { POLLER_INTERVAL } from './constants';
import {
  ReportDefinitionSchemaType,
  ReportSchemaType,
  dataReportSchemaType,
  visualReportSchemaType,
} from '../model';
import moment from 'moment';

async function pollAndExecuteJob(
  schedulerClient: IClusterClient,
  esClient: IClusterClient,
  logger: Logger
) {
  logger.info(
    `start polling at time: ${new Date().toISOString()} with fixed interval: ${POLLER_INTERVAL} milliseconds`
  );
  try {
    const getJobRes = await schedulerClient.callAsInternalUser(
      'reports_scheduler.getJob'
    );

    // job retrieved, otherwise will be undefined because 204 No-content is returned
    if (getJobRes) {
      const reportDefinitionId = getJobRes._source.report_definition_id;
      const triggeredTime = getJobRes._source.triggered_time;
      const jobId = getJobRes._id;
      logger.info(
        `scheduled job sent from scheduler with report definition id: ${reportDefinitionId}`
      );

      await executeScheduledJob(
        reportDefinitionId,
        triggeredTime,
        esClient,
        logger
      );

      // updateJobStatus, release/delete lock of the job
      const updateJobStatusRes = await schedulerClient.callAsInternalUser(
        'reports_scheduler.updateJobStatus',
        {
          jobId: jobId,
        }
      );
      logger.info(`done executing job. ${updateJobStatusRes}`);
    } else {
      // 204 no content is returned, 204 doesn't have response body
      logger.info('no available job in queue');
    }
  } catch (error) {
    // TODO: need better error handling
    logger.error(`${error.statusCode} ${error.message}`);
  }
}

async function executeScheduledJob(
  reportDefinitionId: string,
  triggeredTime: number,
  client: IClusterClient,
  logger: Logger
) {
  // retrieve report definition
  const esResp = await client.callAsInternalUser('get', {
    index: 'report_definition',
    id: reportDefinitionId,
  });
  const reportDefinition = esResp._source.report_definition;

  // calculate query url and create report object based on report definition and trigger_time
  const reportMetaData = createReportMetaData(reportDefinition, triggeredTime);

  // create report and return report data
  const reportData = await createReport(reportMetaData, client);
  // TODO: Delivery: pass report data and (maybe original reportDefinition as well) to notification module

  logger.info(`new report created: ${reportData.fileName}`);
}

function createReportMetaData(
  reportDefinition: ReportDefinitionSchemaType,
  triggeredTime: number
): ReportSchemaType {
  // TODO: need better handle
  const coreParams: dataReportSchemaType | visualReportSchemaType =
    reportDefinition.report_params.core_params;
  const { value, unit } = parseDuration(coreParams.time_duration);
  //@ts-ignore
  const duration = moment.duration(value, unit);
  const refUrl = coreParams.ref_url;
  const timeTo = moment(triggeredTime);
  const timeFrom = moment(timeTo).subtract(duration);
  console.log(timeFrom);

  const queryUrl = `${refUrl}?_g=(time:(from:'${timeFrom.toISOString()}',to:'${timeTo.toISOString()}'))`;
  const report: ReportSchemaType = {
    query_url: queryUrl,
    time_from: timeFrom.valueOf(),
    time_to: triggeredTime,
    report_definition: {
      ...reportDefinition,
    },
  };
  return report;
}

function parseDuration(timeDuration: string) {
  const value = parseInt(timeDuration.slice(0, 1));
  const unit = timeDuration.slice(1, 2);
  return { value, unit };
}

export { pollAndExecuteJob };
