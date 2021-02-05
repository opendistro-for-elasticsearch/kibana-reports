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

import { OpendistroKibanaReportsPlugin } from './plugin';
import { schema, TypeOf } from '@kbn/config-schema';
import {
  PluginInitializerContext,
  PluginConfigDescriptor,
  HttpServerInfo,
} from '../../../src/core/server';

export const configSchema = schema.object({
  access: schema.object({
    port: schema.number({ defaultValue: 5601 }),
    basePath: schema.string({ defaultValue: '' }),
  }),
});

export type KibanaReportsPluginConfigType = TypeOf<typeof configSchema>;

export const config: PluginConfigDescriptor<KibanaReportsPluginConfigType> = {
  exposeToBrowser: {
    access: true,
  },
  schema: configSchema,
};

export type AccessInfoType = {
  basePath: string;
  serverInfo: HttpServerInfo;
};

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new OpendistroKibanaReportsPlugin(initializerContext);
}

export {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
