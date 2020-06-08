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
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiPageContentHeaderSection,
} from '@elastic/eui';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Main } from './main';
import { CreateReport } from '../create_report/create_report';

export class RouterHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { httpClient } = this.props;
    return (
      <Router basename={'/reporting'}>
        <EuiPage>
          <EuiPageBody>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiPageContentHeaderSection></EuiPageContentHeaderSection>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <Switch>
                    <Route
                      path="/report_details/:id"
                      render={(props) => (
                        <ReportDetails title="Report Details" httpClient={httpClient} {...props} />
                      )}
                    />
                    <Route
                      path="/create"
                      render={(props) => (
                        <CreateReport title="Create Report" httpClient={httpClient} {...props} />
                      )}
                    />
                    <Route
                      path="/"
                      render={(props) => (
                        <Main title="Reporting Homepage" httpClient={httpClient} {...props} />
                      )}
                    />
                  </Switch>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
      </Router>
    );
  }
}








