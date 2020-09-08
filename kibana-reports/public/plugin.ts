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

import { i18n } from '@kbn/i18n';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  Plugin,
} from '../../../src/core/public';
import {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME } from '../common';

export class OpendistroKibanaReportsPlugin
  implements
    Plugin<
      OpendistroKibanaReportsPluginSetup,
      OpendistroKibanaReportsPluginStart
    > {
  public setup(core: CoreSetup): OpendistroKibanaReportsPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'opendistro_kibana_reports',
      title: 'Reporting',
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(
          coreStart,
          depsStart as AppPluginStartDependencies,
          params
        );
      },
    });

    // Return methods that should be available to other plugins
    return {};
  }

  public start(core: CoreStart): OpendistroKibanaReportsPluginStart {
    return {};
  }

  public stop() {}
}
