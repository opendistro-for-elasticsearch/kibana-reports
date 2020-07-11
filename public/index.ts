import './index.scss';

import { OpendistroKibanaReportsPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new OpendistroKibanaReportsPlugin();
}
export {
  OpendistroKibanaReportsPluginSetup,
  OpendistroKibanaReportsPluginStart,
} from './types';
