import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpendistroKibanaReportsPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpendistroKibanaReportsPluginStart {}
export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
