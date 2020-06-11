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