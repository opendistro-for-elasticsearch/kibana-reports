import React from 'react';
import ReactDOM from 'react-dom';
import {
    EuiFieldText,
    EuiSuperSelect,
    EuiPageSideBar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButton,
    EuiPage,
    EuiPageHeader,
    EuiTitle,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentHeader,
    EuiPageContentBody,
    EuiPageContentHeaderSection,
    EuiInMemoryTable,
    EuiHorizontalRule,
    EuiSpacer,
    EuiSearchBar,
    EuiLink,
    EuiHealth,
    EuiText,
    EuiEmptyPrompt
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
        )
    }
}








