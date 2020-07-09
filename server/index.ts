import {
  PluginInitializerContext,
  PluginConfigDescriptor,
} from '../../../src/core/server';
import { OpendistroKibanaReportsPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new OpendistroKibanaReportsPlugin(initializerContext);
}

export {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
