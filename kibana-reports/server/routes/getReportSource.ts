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

import {
  IRouter,
  IKibanaResponse,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { parseEsErrorResponse } from './utils/helpers';
import { RequestParams } from '@elastic/elasticsearch';
import { schema } from '@kbn/config-schema';
import { DEFAULT_MAX_SIZE } from './utils/constants';

export default function (router: IRouter) {
  router.get(
    {
      path: `${API_PREFIX}/getReportSource/{reportSourceType}`,
      validate: {
        params: schema.object({
          reportSourceType: schema.string(),
        }),
      },
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      if (request.params.reportSourceType === 'dashboard') {
        try {
          const params: RequestParams.Search = {
            index: '.kibana',
            q: 'type:dashboard',
          };
          const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
            'search',
            params
          );
          return response.ok({
            body: esResp,
          });
        } catch (error) {
          //@ts-ignore
          context.reporting_plugin.logger.error(
            `Failed to get reports details: ${error}`
          );
          return response.custom({
            statusCode: error.statusCode,
            body: parseEsErrorResponse(error),
          });
        }
      } else if (request.params.reportSourceType === 'visualization') {
        const params: RequestParams.Search = {
          index: '.kibana',
          q: 'type:visualization',
          size: DEFAULT_MAX_SIZE,
        };
        try {
          const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
            'search',
            params
          );
          return response.ok({
            body: esResp,
          });
        } catch (error) {
          //@ts-ignore
          context.reporting_plugin.logger.error(
            `Failed to get visualizations: ${error}`
          );
          return response.custom({
            statusCode: error.statusCode,
            body: parseEsErrorResponse(error),
          });
        }
      } else if (request.params.reportSourceType === 'search') {
        const params: RequestParams.Search = {
          index: '.kibana',
          q: 'type:search',
          size: DEFAULT_MAX_SIZE,
        };
        try {
          const esResp = await context.core.elasticsearch.adminClient.callAsInternalUser(
            'search',
            params
          );
          return response.ok({
            body: esResp,
          });
        } catch (error) {
          //@ts-ignore
          context.reporting_plugin.logger.error(
            `Failed to get saved searches: ${error}`
          );
          return response.custom({
            statusCode: error.statusCode,
            body: parseEsErrorResponse(error),
          });
        }
      }
    }
  );
}
