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
import Joi from '@hapi/joi';
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
          source: Joi.string()
            .valid('dashboard', 'visualization', 'saved search')
            .required(),
          reportFormat: Joi.string().valid('png', 'pdf').required(),
          windowWidth: Joi.number().positive().integer(),
          windowLength: Joi.number().positive().integer(),
        }),
      },
      timeout: {
        socket: 30000,
      },
    },
  });

  server.route({
    path: NODE_API.GET_REPORTS,
    method: REQUEST.GET,
    handler: generateReportService.getReports,
    options: {
      // input validation
      validate: {
        query: Joi.object({
          size: Joi.string(),
          sortField: Joi.string(),
          sortDirection: Joi.string(),
        }),
      },
    },
  });

  server.route({
    path: NODE_API.GET_REPORT_BY_ID,
    method: REQUEST.GET,
    handler: generateReportService.getReport,
    options: {
      // input validation
      validate: {
        params: Joi.object({
          reportId: Joi.string().required(),
        }),
      },
    },
  });
}
