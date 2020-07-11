import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface OpendistroKibanaReportsPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpendistroKibanaReportsPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
