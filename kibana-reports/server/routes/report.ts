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
import { createReport } from './utils/reportHelper';
import { reportSchema } from '../model';
import { errorResponse } from './utils/helpers';
import { CONFIG_INDEX_NAME } from './utils/constants';

export default function (router: IRouter) {
  // generate report
  router.post(
    {
      path: `${API_PREFIX}/generateReport`,
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
      let report = request.body;
      try {
        report = reportSchema.validate(report);
      } catch (error) {
        return response.badRequest({ body: error });
      }

      try {
        const reportData = await createReport(
          report,
          context.core.elasticsearch.legacy.client
        );

        return response.ok({
          body: {
            data: reportData.dataUrl,
            filename: reportData.fileName,
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to create report: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );

  // generate report from id
  router.post(
    {
      path: `${API_PREFIX}/generateReport/{reportId}`,
      validate: {
        params: schema.object({
          reportId: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      // get report
      try {
        const savedReportId = request.params.reportId;
        const esResp = await context.core.elasticsearch.legacy.client.callAsCurrentUser(
          'get',
          {
            index: CONFIG_INDEX_NAME.report,
            id: request.params.reportId,
          }
        );
        const report = esResp._source;
        const reportData = await createReport(
          report,
          context.core.elasticsearch.legacy.client,
          savedReportId
        );

        return response.ok({
          body: {
            data: reportData.dataUrl,
            filename: reportData.fileName,
          },
        });
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to generate report by id: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );

  // get all reports details
  router.get(
    {
      path: `${API_PREFIX}/reports`,
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
        size: string;
        sortField: string;
        sortDirection: string;
      };
      const sizeNumber = parseInt(size, 10);
      const params: RequestParams.Search = {
        index: CONFIG_INDEX_NAME.report,
        size: sizeNumber,
        sort: `${sortField}:${sortDirection}`,
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
          `Failed to get reports details: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );

  // get single report details by id
  router.get(
    {
      path: `${API_PREFIX}/reports/{reportId}`,
      validate: {
        params: schema.object({
          reportId: schema.string(),
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
            index: CONFIG_INDEX_NAME.report,
            id: request.params.reportId,
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

  // Delete single report by id
  router.delete(
    {
      path: `${API_PREFIX}/reports/{reportId}`,
      validate: {
        params: schema.object({
          reportId: schema.string(),
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
          'delete',
          {
            index: CONFIG_INDEX_NAME.report,
            id: request.params.reportId,
          }
        );
        return response.ok();
      } catch (error) {
        //@ts-ignore
        context.reporting_plugin.logger.error(
          `Failed to delete report: ${error}`
        );
        return errorResponse(response, error);
      }
    }
  );
}
