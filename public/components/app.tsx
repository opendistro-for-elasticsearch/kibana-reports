/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
import { CreateReport } from './create_report/create_report';
import { Main } from './main/main';
import { ReportDetails } from './main/report_details/report_details';

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
    <Router basename={basename}>
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
