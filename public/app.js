import React from 'react';
import { uiModules } from 'ui/modules';
import chrome from 'ui/chrome';
import { render, unmountComponentAtNode } from 'react-dom';

import { Main } from './components/main';

import './Services/vars';

const app = uiModules.get('apps/reporting');

app.config($locationProvider => {
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false,
    rewriteLinks: false,
  });
});
app.config(stateManagementConfigProvider => stateManagementConfigProvider.disable());

function RootController($scope, $element, $http, reportingService ) {
  const domNode = $element[0];

  // render react to DOM
  render(<Main title="Reporting" httpClient={$http} reportingService={reportingService} />, domNode);

  // unmount react on controller destroy
  $scope.$on('$destroy', () => {
    unmountComponentAtNode(domNode);
  });
}

chrome.setRootController('reporting', RootController);
