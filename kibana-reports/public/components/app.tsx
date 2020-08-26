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
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiPageContentHeaderSection,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { CreateReport } from './report_definitions/create/create_report_definition';
import { Main } from './main/main';
import { ReportDetails } from './main/report_details/report_details';
import { ReportDefinitionDetails } from './main/report_definition_details/report_definition_details';
import { EditReportDefinition } from './report_definitions/edit/edit_report_definition';

interface OpendistroKibanaReportsAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const OpendistroKibanaReportsApp = ({
  basename,
  notifications,
  http,
  navigation,
}: OpendistroKibanaReportsAppDeps) => {
  // Render the application DOM.
  return (
    <Router basename={'/' + basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth="2000px">
            <EuiPageBody>
              <EuiPageContent>
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
                        />
                      )}
                    />
                    <Route
                      path="/edit"
                      render={(props) => (
                        <EditReportDefinition
                          title="Edit Report Definition"
                          httpClient={http}
                          {...props}
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
                        />
                      )}
                    />
                  </Switch>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
