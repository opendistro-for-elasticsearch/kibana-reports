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
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
  IClusterClient,
} from '../../../src/core/server';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import reportsSchedulerPlugin from './backend/opendistro-reports-scheduler-plugin';
import {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
import registerRoutes from './routes';
import { pollAndExecuteJob } from './utils/executor';
import { POLLER_INTERVAL } from './utils/constants';

export interface ReportsPluginRequestContext {
  logger: Logger;
  esClient: IClusterClient;
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

    // TODO: create Elasticsearch client that aware of reports-scheduler API endpoints
    // Deprecated API. Switch to the new elasticsearch client as soon as https://github.com/elastic/kibana/issues/35508 done.
    const schedulerClient: IClusterClient = core.elasticsearch.createClient(
      'reports_scheduler',
      {
        plugins: [reportsSchedulerPlugin],
      }
    );

    // Register server side APIs
    registerRoutes(router);

    // put logger into route handler context, so that we don't need to pass through parameters
    core.http.registerRouteHandlerContext(
      //@ts-ignore
      'reporting_plugin',
      (context, request) => {
        return {
          logger: this.logger,
          schedulerClient,
        };
      }
    );

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('opendistro_kibana_reports: Started');

    const schedulerClient = core.elasticsearch.legacy.createClient(
      'reports_scheduler',
      {
        plugins: [reportsSchedulerPlugin],
      }
    );
    const esClient = core.elasticsearch.legacy.client;
    // setIntervalAsync provides the same familiar interface as built-in setInterval for asynchronous functions,
    // while preventing multiple executions from overlapping in time.
    // Polling at at a 1 min fixed interval
    // TODO: need further optimization polling with a mix approach of
    // random delay and dynamic delay based on jobs amount
    setIntervalAsync(
      pollAndExecuteJob,
      POLLER_INTERVAL,
      schedulerClient,
      esClient,
      this.logger
    );
    return {};
  }

  public stop() {}
}
