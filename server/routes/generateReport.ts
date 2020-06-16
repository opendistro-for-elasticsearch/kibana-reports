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

import { Server } from 'hapi';
import * as Joi from '@hapi/joi';
import { NodeServices } from '../models/interfaces';
import { NODE_API, REQUEST } from '../utils/constants';

export default function (server: Server, services: NodeServices) {
  const { generateReportService } = services;

  server.route({
    path: NODE_API.GENERATE_REPORT,
    method: REQUEST.POST,
    handler: generateReportService.report,
    options: {
      // input validation
      validate: {
        payload: Joi.object({
          url: Joi.string().uri().required(),
          itemName: Joi.string().required(),
          reportFormat: Joi.string().valid('png', 'pdf').required(),
          windowWidth: Joi.number().positive().integer(),
          windowLength: Joi.number().positive().integer(),
        }),
      },
    },
  });
}
