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
import { schema } from '@kbn/config-schema';


import { i18n } from '@kbn/i18n';

import reportRoute from './server/routes/report';
import dashboardRoute from './server/routes/dashboard';
import schedulerRoute from './server/routes/scheduler';

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
      hacks: [
      ],
      styleSheetPaths: [resolve(__dirname, 'public/app.scss'), resolve(__dirname, 'public/app.css')].find(p => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars

      // Add server routes and initialize the plugin here
      reportRoute(server);
      dashboardRoute(server);
      schedulerRoute(server);
    }
  });
}
