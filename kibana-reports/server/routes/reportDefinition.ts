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
  ILegacyScopedClusterClient,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { reportDefinitionSchema } from '../model';
import { errorResponse } from './utils/helpers';
import { createReportDefinition } from './lib/createReportDefinition';
import {
  backendToUiReportDefinition,
  backendToUiReportDefinitionsList,
} from './utils/converters/backendToUi';
import { updateReportDefinition } from './lib/updateReportDefinition';
import { DEFAULT_MAX_SIZE } from './utils/constants';

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
      //@ts-ignore
      const logger = context.reporting_plugin.logger;
      // input validation
      try {
        reportDefinition.report_params.core_params.origin =
          request.headers.origin;
        reportDefinition = reportDefinitionSchema.validate(reportDefinition);
      } catch (error) {
        logger.error(
          `Failed input validation for create report definition ${error}`
        );
        return response.badRequest({ body: error });
      }

      // save metadata
      try {
        const res = await createReportDefinition(
          request,
          context,
          reportDefinition
        );

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
      //@ts-ignore
      const logger = context.reporting_plugin.logger;
      // input validation
      try {
        reportDefinition.report_params.core_params.origin =
          request.headers.origin;
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
          request,
          context,
          reportDefinition
        );

        return response.ok({
          body: {
            state: 'Report definition updated',
            scheduler_response: esResp,
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
          fromIndex: schema.maybe(schema.number()),
          maxItems: schema.maybe(schema.number()),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      const { fromIndex, maxItems } = request.query as {
        fromIndex: number;
        maxItems: number;
      };

      try {
        // @ts-ignore
        const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
          request
        );

        const esResp = await esReportsClient.callAsCurrentUser(
          'es_reports.getReportDefinitions',
          {
            fromIndex: fromIndex,
            maxItems: maxItems || DEFAULT_MAX_SIZE,
          }
        );

        const reportDefinitionsList = backendToUiReportDefinitionsList(
          esResp.reportDefinitionDetailsList
        );
        return response.ok({
          body: {
            data: reportDefinitionsList,
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

  // get report definition detail by id
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
        // @ts-ignore
        const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
          request
        );

        const esResp = await esReportsClient.callAsCurrentUser(
          'es_reports.getReportDefinitionById',
          {
            reportDefinitionId: request.params.reportDefinitionId,
          }
        );

        const reportDefinition = backendToUiReportDefinition(
          esResp.reportDefinitionDetails
        );

        return response.ok({
          body: { report_definition: reportDefinition },
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

  // Delete report definition by id
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
        // @ts-ignore
        const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
          request
        );

        const esResp = await esReportsClient.callAsCurrentUser(
          'es_reports.deleteReportDefinitionById',
          {
            reportDefinitionId: request.params.reportDefinitionId,
          }
        );

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
