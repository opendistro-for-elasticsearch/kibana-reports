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
  ILegacyClusterClient,
} from '../../../src/core/server';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import esReportsPlugin from './backend/opendistro-es-reports-plugin';
import notificationPlugin from './backend/opendistro-notification-plugin';
import {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
import registerRoutes from './routes';
import { pollAndExecuteJob } from './executor/executor';
import { POLL_INTERVAL } from './utils/constants';

export interface ReportsPluginRequestContext {
  logger: Logger;
  esClient: ILegacyClusterClient;
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
    // Deprecated API. Switch to the new elasticsearch client as soon as https://github.com/elastic/kibana/issues/35508 done.
    const esReportsClient: ILegacyClusterClient = core.elasticsearch.legacy.createClient(
      'es_reports',
      {
        plugins: [esReportsPlugin],
      }
    );

    const notificationClient: ILegacyClusterClient = core.elasticsearch.legacy.createClient(
      'notification',
      {
        plugins: [notificationPlugin],
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
          notificationClient,
          esReportsClient,
        };
      }
    );

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('opendistro_kibana_reports: Started');

    const esReportsClient: ILegacyClusterClient = core.elasticsearch.legacy.createClient(
      'es_reports',
      {
        plugins: [esReportsPlugin],
      }
    );

    const notificationClient: ILegacyClusterClient = core.elasticsearch.legacy.createClient(
      'notification',
      {
        plugins: [notificationPlugin],
      }
    );
    const esClient: ILegacyClusterClient = core.elasticsearch.legacy.client;
    /*
    setIntervalAsync provides the same familiar interface as built-in setInterval for asynchronous functions,
    while preventing multiple executions from overlapping in time.
    Polling at at a 5 min fixed interval
    
    TODO: need further optimization polling with a mix approach of
    random delay and dynamic delay based on the amount of jobs. 
    */
    // setIntervalAsync(
    //   pollAndExecuteJob,
    //   POLL_INTERVAL,
    //   esReportsClient,
    //   notificationClient,
    //   esClient,
    //   this.logger
    // );
    return {};
  }

  public stop() {}
}
