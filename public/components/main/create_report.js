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

  export class CreateReport extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { httpClient } = this.props;
    }

    render() {
        return (
           <EuiPage>
               <EuiPageBody>
                <EuiPageContent>
                    <EuiTitle>
                        Report Settings
                    </EuiTitle>
                </EuiPageContent>
               </EuiPageBody>
           </EuiPage>
        )
    }
  }