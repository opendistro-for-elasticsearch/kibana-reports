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

import { ILegacyClusterClient, Logger } from '../../../../src/core/server';
import { createReport } from '../routes/utils/reportHelper';
import { POLL_INTERVAL } from './constants';
import {
  ReportSchemaType,
  dataReportSchemaType,
  visualReportSchemaType,
} from '../model';
import moment from 'moment';
import { CONFIG_INDEX_NAME } from '../routes/utils/constants';

async function pollAndExecuteJob(
  schedulerClient: ILegacyClusterClient,
  esClient: ILegacyClusterClient,
  logger: Logger
) {
  logger.info(
    `start polling at time: ${new Date().toISOString()} with fixed interval: ${POLL_INTERVAL} milliseconds`
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
  client: ILegacyClusterClient,
  logger: Logger
) {
  // retrieve report definition
  const esResp = await client.callAsInternalUser('get', {
    index: CONFIG_INDEX_NAME.reportDefinition,
    id: reportDefinitionId,
  });
  const reportDefinition = esResp._source.report_definition;
  // compose query url and create report object based on report definition and triggered_time
  const reportMetaData = createReportMetaData(reportDefinition, triggeredTime);
  // create report and return report data
  const reportData = await createReport(reportMetaData, client);
  // TODO: Delivery: pass report data and (maybe original reportDefinition as well) to notification module

  logger.info(`new report created: ${reportData.fileName}`);
}

function createReportMetaData(
  reportDefinition: any,
  triggeredTime: number
): ReportSchemaType {
  const coreParams: dataReportSchemaType | visualReportSchemaType =
    reportDefinition.report_params.core_params;
  const duration = moment.duration(coreParams.time_duration);
  const base_url = coreParams.base_url;
  const timeTo = moment(triggeredTime);
  const timeFrom = moment(timeTo).subtract(duration);
  const queryUrl = `${base_url}?_g=(time:(from:'${timeFrom.toISOString()}',to:'${timeTo.toISOString()}'))`;
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

export { pollAndExecuteJob };
