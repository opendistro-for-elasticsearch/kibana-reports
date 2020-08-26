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
import { logger } from 'elastic-apm-node';

async function pollAndExecuteJob(
  schedulerClient: IClusterClient,
  esClient: IClusterClient,
  logger: Logger
) {
  logger.info('call at time: ' + new Date().toISOString());
  try {
    const getJobRes = await schedulerClient.callAsInternalUser(
      'reports_scheduler.getJob'
    );

    // job retrieved, otherwise will be undefined because 204 No-content is returned
    if (getJobRes) {
      const reportDefId = getJobRes._source.report_definition_id;
      const jobId = getJobRes._id;
      logger.info('report definition id sent from scheduler: ' + reportDefId);

      await executeScheduledJob(reportDefId, esClient);

      // updateJobStatus, release/delete lock of the job
      const updateJobStatusRes = await schedulerClient.callAsInternalUser(
        'reports_scheduler.updateJobStatus',
        {
          jobId: jobId,
        }
      );
      logger.info(updateJobStatusRes);
    } else {
      logger.info('no available job in queue');
    }
  } catch (error) {
    // TODO: need better error handling
    logger.error(`${error.statusCode} ${error.message}`);
  }
}

async function executeScheduledJob(defId: string, client: IClusterClient) {
  // retrieve report definition
  const res = await client.callAsInternalUser('get', {
    index: 'report_definition',
    id: defId,
  });
  const reportDefinition = res._source;

  // create report and return report data
  const reportData = await createReport(reportDefinition, client);
  // TODO: Deliver report: pass report data and (maybe original reportDefinition as well) to notification module

  logger.info('new report created: ' + reportData.fileName);
}

export { pollAndExecuteJob };
