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
import {
  reportSchema,
  emailSchema,
  scheduleSchema,
  intervalSchema,
  cronSchema,
} from '../model';
import { parseEsErrorResponse } from './utils/helpers';
import {
  REPORT_DEF_STATUS,
  SCHEDULE_TYPE,
  DELIVERY_CHANNEL,
} from './utils/constants';

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
      // input validation
      try {
        validateReportDefinition(request.body);
      } catch (error) {
        return response.badRequest({ body: error });
      }

      // Store metadata
      try {
        /**
         * TODO: temporary, need to change after we figure out the correct date modeling
         * https://github.com/elastic/kibana/blob/master/src/core/MIGRATION.md#use-scoped-services
         * from the migration plan of kibana new platform, the usage says to get access to Elasticsearch data by
         * await context.core.elasticsearch.adminClient.callAsInternalUser('ping');
         * However, that doesn't work for now
         */

        const definition = {
          ...request.body,
          time_created: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          status: REPORT_DEF_STATUS.active,
        };

        const params: RequestParams.Index = {
          index: 'report_definition',
          body: definition,
        };

        const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'index',
          params
        );

        const reportDefinitionId = esResp._id;

        // Handle the trigger
        const reportDefinition = request.body;
        const scheduledJob = handleTrigger(
          reportDefinition,
          reportDefinitionId
        );
        // @ts-ignore
        const client = context.reporting_plugin.schedulerClient.asScoped(
          request
        );
        // create schedule in reports-scheduler
        const res = await client.callAsInternalUser(
          'reports_scheduler.createSchedule',
          {
            jobId: reportDefinitionId,
            body: scheduledJob,
          }
        );

        return response.ok({
          body: res,
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to create report definition: ${error}`
        );

        return response.custom({
          statusCode: error.statusCode || 500,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // Update definition by id
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
      // input validation
      try {
        const reportDefinition = request.body;
        validateReportDefinition(reportDefinition);
      } catch (error) {
        return response.badRequest({ body: error });
      }

      // Update metadata
      try {
        /**
         * TODO: temporary, need to change after we figure out the correct date modeling
         * https://github.com/elastic/kibana/blob/master/src/core/MIGRATION.md#use-scoped-services
         * from the migration plan of kibana new platform, the usage says to get access to Elasticsearch data by
         * await context.core.elasticsearch.adminClient.callAsInternalUser('ping');
         * However, that doesn't work for now
         */

        const updatedDefinition = {
          ...request.body,
          last_updated: new Date().toISOString(),
        };

        const params: RequestParams.Index = {
          index: 'report_definition',
          id: request.params.reportDefinitionId,
          body: {
            doc: updatedDefinition,
          },
        };
        const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'update',
          params
        );

        return response.ok({
          body: esResp._id,
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to update report definition: ${error}`
        );

        return response.custom({
          statusCode: error.statusCode || 500,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // get all report definitions details
  router.get(
    {
      path: `${API_PREFIX}/reportDefinitions`,
      validate: {
        query: schema.object({
          size: schema.string({ defaultValue: '100' }),
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
        size?: string;
        sortField: string;
        sortDirection: string;
      };
      const sizeNumber = parseInt(size, 10);
      const params: RequestParams.Search = {
        index: 'report_definition',
        size: sizeNumber,
        sort: `${sortField}:${sortDirection}`,
      };
      try {
        const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
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
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // get single report details by id
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
        const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'get',
          {
            index: 'report_definition',
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
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
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
      try {
        const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
          'delete',
          {
            index: 'report_definition',
            id: request.params.reportDefinitionId,
          }
        );
        return response.ok();
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to delete report definition: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );
}

function validateReportDefinition(reportDefinition: any) {
  reportSchema.validate(reportDefinition);
  const delivery = reportDefinition.delivery;
  const trigger = reportDefinition.trigger;
  const deliveryParams = delivery.delivery_params;
  const triggerParams = trigger.trigger_params;

  switch (delivery.channel) {
    case DELIVERY_CHANNEL.email:
      emailSchema.validate(deliveryParams);
      break;
    //TODO: Add logic for the following
    case DELIVERY_CHANNEL.slack:
      break;
    case DELIVERY_CHANNEL.chime:
      break;
    case DELIVERY_CHANNEL.kibana:
      break;
  }

  // TODO: add alert
  if (trigger.trigger_type === 'Schedule') {
    scheduleSchema.validate(triggerParams);

    const schedule = triggerParams.schedule;
    switch (triggerParams.schedule_type) {
      case SCHEDULE_TYPE.recurring:
        intervalSchema.validate(schedule);
        break;
      case SCHEDULE_TYPE.cron:
        cronSchema.validate(schedule);
        break;
      case SCHEDULE_TYPE.now:
        //TODO:
        break;
      case SCHEDULE_TYPE.future:
        //TODO:
        break;
    }
  }
}

function handleTrigger(reportDefinition: any, reportDefinitionId: string) {
  const trigger = reportDefinition.trigger;
  const triggerType = trigger.trigger_type;
  const triggerParams = trigger.trigger_params;

  if (triggerType === 'Schedule') {
    const schedule = triggerParams.schedule;

    // compose the request body
    const scheduledJob = {
      schedule: schedule,
      name: reportDefinition.report_name + '_schedule',
      enabled: true,
      report_definition_id: reportDefinitionId,
      enabled_time: triggerParams.enabled_time,
    };

    return scheduledJob;

    // send to reports-scheduler to create a scheduled job
  } else if (triggerType == 'Alerting') {
    //TODO:
  }
}
