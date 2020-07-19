import { schema } from '@kbn/config-schema';
import {
  IRouter,
  IKibanaResponse,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { RequestParams } from '@elastic/elasticsearch';
import { reportSchema, email, scheduleSchema, interval, cron } from '../model';

export default function (router: IRouter) {
  // Create report config
  router.post(
    {
      path: `${API_PREFIX}/reportConfig`,
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
        let report = request.body;
        const delivery = request.body.delivery;
        const trigger = request.body.trigger;
        const delivery_params = delivery.delivery_params;
        const trigger_params = trigger.trigger_params;

        reportSchema.validate(report);

        switch (delivery.channel) {
          case 'Email':
            email.validate(delivery_params);
            break;
          //TODO: Add logic for the following
          case 'Slack':
            break;
          case 'Chime':
            break;
          case 'Kibana User':
            break;
        }

        if (trigger.trigger_type === 'Schedule') {
          scheduleSchema.validate(trigger_params);

          const schedule = trigger_params.schedule;
          switch (trigger_params.schedule_type) {
            case 'Recurring':
              interval.validate(schedule);
              break;
            case 'Cron':
              cron.validate(schedule);
              break;
            case 'Now':
              //TODO:
              break;
            case 'Future Date':
              //TODO:
              break;
          }
        }
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

        const config = {
          ...request.body,
          time_created: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        };

        const params: RequestParams.Index = {
          index: 'report_config',
          body: config,
        };
        const esResp = await context.core.elasticsearch.legacy.client.callAsInternalUser(
          'index',
          params
        );

        return response.ok({
          body: esResp._id,
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to create report configuration: ${error}`
        );

        return response.custom({
          statusCode: error.statusCode || 500,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // get all config details
  router.get(
    {
      path: `${API_PREFIX}/reportConfigs`,
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
        index: 'report_config',
        size: sizeNumber,
        sort: `${sortField}:${sortDirection}`,
      };
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsInternalUser(
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
          `Fail to get report config details: ${error}`
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
      path: `${API_PREFIX}/reportConfigs/{reportConfigId}`,
      validate: {
        params: schema.object({
          reportConfigId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsInternalUser(
          'get',
          {
            index: 'report_config',
            id: request.params.reportConfigId,
          }
        );
        return response.ok({
          body: esResp,
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to get single report details: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );

  // Delete single report config by id
  router.delete(
    {
      path: `${API_PREFIX}/reportConfigs/{reportConfigId}`,
      validate: {
        params: schema.object({
          reportConfigId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      try {
        const esResp = await context.core.elasticsearch.legacy.client.callAsInternalUser(
          'delete',
          {
            index: 'report_config',
            id: request.params.reportConfigId,
          }
        );
        return response.ok();
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Fail to delete report config: ${error}`
        );
        return response.custom({
          statusCode: error.statusCode,
          body: parseEsErrorResponse(error),
        });
      }
    }
  );
}

function parseEsErrorResponse(error: any) {
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
