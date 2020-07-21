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
 * permissions and limitations./routes/downloadhe License.
 */

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
import registerRoutes from './routes';

export interface ReportsPluginRequestContext {
  logger: Logger;
}
//@ts-ignore
declare module 'kibana/server' {
  interface RequestHandlerContext {
    reports_plugin: ReportsPluginRequestContext;
  }
}

export class OpendistroKibanaReportsPlugin
  implements
    Plugin<
      OpendistroKibanaReportsPluginSetup,
      OpendistroKibanaReportsPluginStart
    > {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('opendistro_kibana_reports: Setup');
    const router = core.http.createRouter();

    // TODO: create Elasticsearch client that aware of reporting-scheduler API endpoints
    // const esDriver: IClusterClient = core.elasticsearch.legacy.createClient("reporting-scheduler", {
    //   plugins: [reportingSchedulerPlugin],
    // });

    // Register server side APIs
    registerRoutes(router);

    // put logger into route handler context, so that we don't need to pass through parameters
    core.http.registerRouteHandlerContext(
      //@ts-ignore
      'reporting_plugin',
      (context, request) => {
        return {
          logger: this.logger,
        };
      }
    );

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('opendistro_kibana_reports: Started');
    return {};
  }

  public stop() {}
}
