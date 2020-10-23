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

import { schema } from '@kbn/config-schema';
import {
  IRouter,
  IKibanaResponse,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { RequestParams } from '@elastic/elasticsearch';
import { reportDefinitionSchema, ReportDefinitionSchemaType } from '../model';
import {
  errorResponse,
  saveReportDefinition,
  updateReportDefinition,
} from './utils/helpers';
import {
  TRIGGER_TYPE,
  CONFIG_INDEX_NAME,
  DEFAULT_MAX_SIZE,
} from './utils/constants';
import { createSchedule } from './lib/createSchedule';

export default function (router: IRouter) {
  // Create report Definition
  router.post(
    {
      path: `${API_PREFIX}/reportDefinition`,
      validate: {
        body: schema.any(),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      let reportDefinition = request.body;
      const esClient = context.core.elasticsearch.legacy.client;
      //@ts-ignore
      const logger = context.reporting_plugin.logger;
      // input validation
      try {
        reportDefinition = reportDefinitionSchema.validate(reportDefinition);
      } catch (error) {
        logger.error(
          `Failed input validation for create report definition ${error}`
        );
        return response.badRequest({ body: error });
      }

      // save metadata
      // TODO: consider create uuid manually and save report after it's scheduled with reports-scheduler
      try {
        // save report definition to ES
        const esResp = await saveReportDefinition(reportDefinition, esClient);
        // create scheduled job by reports-scheduler
        const reportDefinitionId = esResp._id;
        const res = await createSchedule(request, reportDefinitionId, context);

        return response.ok({
          body: {
            state: 'Report definition created',
            scheduler_response: res,
          },
        });
      } catch (error) {
        logger.error(`Failed to create report definition: ${error}`);
        return errorResponse(response, error);
      }
    }
  );

  // Update report definition by id
  router.put(
    {
      path: `${API_PREFIX}/reportDefinitions/{reportDefinitionId}`,
      validate: {
        body: schema.any(),
        params: schema.object({
          reportDefinitionId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      let reportDefinition = request.body;
      const savedReportDefinitionId = request.params.reportDefinitionId;
      const esClient = context.core.elasticsearch.legacy.client;
      //@ts-ignore
      const logger = context.reporting_plugin.logger;
      // input validation
      try {
        reportDefinition = reportDefinitionSchema.validate(reportDefinition);
      } catch (error) {
        logger.error(
          `Failed input validation for update report definition ${error}`
        );
        return response.badRequest({ body: error });
      }
      // Update report definition metadata
      try {
        const esResp = await updateReportDefinition(
          savedReportDefinitionId,
          reportDefinition,
          esClient
        );
        // update scheduled job by calling reports-scheduler
        const reportDefinitionId = esResp._id;
        const res = await createSchedule(request, reportDefinitionId, context);

        return response.ok({
          body: {
            state: 'Report definition updated',
            scheduler_response: res,
          },
        });
      } catch (error) {
        logger.error(`Failed to update report definition: ${error}`);
        return errorResponse(response, error);
      }
    }
  );

  // get all report definitions details
  router.get(
    {
      path: `${API_PREFIX}/reportDefinitions`,
      validate: {
        query: schema.object({
          size: schema.maybe(schema.string()),
          sortField: schema.maybe(schema.string()),
          sortDirection: schema.maybe(schema.string()),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      const { size, sortField, sortDirection } = request.query as {
        size: string;
        sortField: string;
        sortDirection: string;
      };
      const params: RequestParams.Search = {
        index: CONFIG_INDEX_NAME.reportDefinition,
        size: size ? parseInt(size, 10) : DEFAULT_MAX_SIZE,
        sort:
          sortField && sortDirection
            ? `${sortField}:${sortDirection}`
            : undefined,
      };
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'search',
          params
        );
        return response.ok({
          body: {
            total: esResp.hits.total.value,
            data: esResp.hits.hits,
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to get report definition details: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );

  // get single report definition detail by id
  router.get(
    {
      path: `${API_PREFIX}/reportDefinitions/{reportDefinitionId}`,
      validate: {
        params: schema.object({
          reportDefinitionId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'get',
          {
            index: CONFIG_INDEX_NAME.reportDefinition,
            id: request.params.reportDefinitionId,
          }
        );
        return response.ok({
          body: esResp._source,
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to get single report details: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );

  // Delete single report definition by id
  router.delete(
    {
      path: `${API_PREFIX}/reportDefinitions/{reportDefinitionId}`,
      validate: {
        params: schema.object({
          reportDefinitionId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      // @ts-ignore
      const schedulerClient = context.reporting_plugin.schedulerClient.asScoped(
        request
      );
      const reportDefinitionId = request.params.reportDefinitionId;

      try {
        // retrieve report definition
        const getReportDefinitionResp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'get',
          {
            index: CONFIG_INDEX_NAME.reportDefinition,
            id: reportDefinitionId,
          }
        );
        const reportDefinition: ReportDefinitionSchemaType =
          getReportDefinitionResp._source.report_definition;
        const triggerType = reportDefinition.trigger.trigger_type;
        let esResp;

        // delete job from report definition index
        esResp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'delete',
          {
            index: CONFIG_INDEX_NAME.reportDefinition,
            id: reportDefinitionId,
          }
        );
        if (triggerType === TRIGGER_TYPE.schedule) {
          // send to reports-scheduler to delete a scheduled job
          esResp = await schedulerClient.callAsCurrentUser(
            'reports_scheduler.deleteSchedule',
            {
              // the scheduled job is using the same id as its report definition
              jobId: reportDefinitionId,
            }
          );
          /* 
          TODO: also remove any job in queue and release lock, consider do that
          within the deleteSchedule API exposed by reports-scheduler
          */
        }

        return response.ok({
          body: {
            state: 'Report definition deleted',
            es_response: esResp,
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to delete report definition: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );
}
