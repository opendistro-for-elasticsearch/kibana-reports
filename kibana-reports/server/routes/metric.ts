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
  IKibanaResponse,
  IRouter,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';
import { errorResponse } from './utils/helpers';
import { getMetrics } from './utils/metricHelper';

export default function (router: IRouter) {
  router.get(
    {
      path: `${API_PREFIX}/stats`,
      validate: false,
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      //@ts-ignore
      const logger: Logger = context.reporting_plugin.logger;
      try {
        const metrics = getMetrics();
        return response.ok({
          body: metrics,
        });
      } catch (error) {
        logger.error(`failed during query reporting stats: ${error}`);
        return errorResponse(response, error);
      }
    }
  );
}
