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

import React from 'react';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
} from '@elastic/eui';
import CSS from 'csstype';
import {
  CoreStart,
  CoreSystem,
  ChromeBreadcrumb,
  IUiSettingsClient,
} from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { CreateReport } from './report_definitions/create/create_report_definition';
import { Main } from './main/main';
import { ReportDetails } from './main/report_details/report_details';
import { ReportDefinitionDetails } from './main/report_definition_details/report_definition_details';
import { EditReportDefinition } from './report_definitions/edit/edit_report_definition';

export interface CoreInterface {
  http: CoreStart['http'];
  uiSettings: IUiSettingsClient;
  setBreadcrumbs: (newBreadcrumbs: ChromeBreadcrumb[]) => void;
}

interface OpendistroKibanaReportsAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  chrome: CoreStart['chrome'];
}

const styles: CSS.Properties = {
  float: 'left',
  width: '100%',
  maxWidth: '1600px',
};

export const OpendistroKibanaReportsApp = ({
  basename,
  notifications,
  http,
  navigation,
  chrome,
}: OpendistroKibanaReportsAppDeps) => {
  // Render the application DOM.
  return (
    <Router basename={'/' + basename}>
      <I18nProvider>
        <div style={styles}>
          <EuiPage>
            <EuiPageBody>
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection></EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                <Switch>
                  <Route
                    path="/report_details/:reportId"
                    render={(props) => (
                      <ReportDetails
                        title="Report Details"
                        httpClient={http}
                        {...props}
                        setBreadcrumbs={chrome.setBreadcrumbs}
                      />
                    )}
                  />
                  <Route
                    path="/report_definition_details/:reportDefinitionId"
                    render={(props) => (
                      <ReportDefinitionDetails
                        title="Report Definition Details"
                        httpClient={http}
                        {...props}
                        setBreadcrumbs={chrome.setBreadcrumbs}
                      />
                    )}
                  />
                  <Route
                    path="/create"
                    render={(props) => (
                      <CreateReport
                        title="Create Report"
                        httpClient={http}
                        {...props}
                        setBreadcrumbs={chrome.setBreadcrumbs}
                      />
                    )}
                  />
                  <Route
                    path="/edit/:reportDefinitionId"
                    render={(props) => (
                      <EditReportDefinition
                        title="Edit Report Definition"
                        httpClient={http}
                        {...props}
                        setBreadcrumbs={chrome.setBreadcrumbs}
                      />
                    )}
                  />
                  <Route
                    path="/"
                    render={(props) => (
                      <Main
                        title="Reporting Homepage"
                        httpClient={http}
                        {...props}
                        setBreadcrumbs={chrome.setBreadcrumbs}
                      />
                    )}
                  />
                </Switch>
              </EuiPageContentBody>
            </EuiPageBody>
          </EuiPage>
        </div>
      </I18nProvider>
    </Router>
  );
};
