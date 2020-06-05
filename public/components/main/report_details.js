import React, { useState } from 'react';

import {
    EuiButtonEmpty,
    EuiComboBox,
    EuiDatePicker,
    EuiFieldText,
    EuiSelect,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiButton,
    EuiPage,
    EuiPageHeader,
    EuiTitle,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiInMemoryTable,
    EuiHorizontalRule,
    EuiSpacer,
    EuiSuggest,
    EuiTextArea,
    EuiEmptyPrompt,
    EuiRadioGroup,
  } from '@elastic/eui';

  export class ReportDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      const { httpClient } = this.props;
    }

    render() {
      return (
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageHeader>
                <EuiTitle>
                  <h2>Report Details</h2>
                </EuiTitle>
              </EuiPageHeader>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      )
    }
  }