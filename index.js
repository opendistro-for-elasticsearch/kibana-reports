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

import { resolve } from 'path';
import { existsSync } from 'fs';

import { GenerateReportService } from './server/services';
import { generateReport } from './server/routes';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'opendistro-kibana-reports',
    uiExports: {
      app: {
        title: 'Reporting',
        description: 'Kibana Reports',
        main: 'plugins/opendistro-kibana-reports/app',
      },
      hacks: [],
      styleSheetPaths: [
        resolve(__dirname, 'public/app.scss'),
        resolve(__dirname, 'public/app.css'),
      ].find((p) => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      //TODO: Create clusters (SQL and scheduler plugin in the future)

      const initializerContext = {
        logger: {
          get() {
            return {
              info: (log) => console.log(log),
              error: (log) => console.error(log),
              warn: (log) => console.warn(log),
            };
          },
        },
      };

      //Initialize services
      const esDriver = server.plugins.elasticsearch;
      const generateReportService = new GenerateReportService(
        initializerContext,
        esDriver
      );
      const services = { generateReportService };

      // Add server routes
      generateReport(server, services);
    },
  });
}
