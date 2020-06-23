import { uiModules } from 'ui/modules';

const module = uiModules.get('app/reporting');

//exposing the backend role from kibana.yml

module.service('reportingService', function (backendRole) {
  return {  get: () => backendRole };
});
