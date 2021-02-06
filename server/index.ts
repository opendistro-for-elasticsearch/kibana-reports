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
import { schema, TypeOf } from '@kbn/config-schema';
import { PluginInitializerContext, PluginConfigDescriptor } from '../../../src/core/server';
import { OpendistroKibanaReportsPlugin } from './plugin';

/*
### Configure plugin
Kibana provides ConfigService if a plugin developer may want to support adjustable runtime behavior for their plugins. Access to Kibana config in New platform has been subject to significant refactoring.
In order to have access to a config, plugin *should*:
- Declare plugin specific "configPath" (will fallback to plugin "id" if not specified) in `kibana.json` file.
- Export schema validation for config from plugin's main file. Schema is mandatory. If a plugin reads from the config without schema declaration, ConfigService will
*/

export const config: PluginConfigDescriptor = {
  schema: schema.object({
    proxy_enabled: schema.boolean({ defaultValue: false }),
    proxy_port: schema.number({ defaultValue: 8080 }),
    proxy_host: schema.string({ defaultValue: "127.0.0.1" }),
    proxy_protocol: schema.string({ defaultValue: "http" }),
    proxy_basePath: schema.string({ defaultValue: "/kbn_report" }),
    security_auth_cookie_name: schema.string({ defaultValue: "security_authentication" }),
  }),
};

export type ElastAlertKibanaPluginConfigType = TypeOf<typeof config.schema>;



//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new OpendistroKibanaReportsPlugin(initializerContext);
}

export {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
