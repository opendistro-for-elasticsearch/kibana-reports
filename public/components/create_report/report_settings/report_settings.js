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
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiHorizontalRule,
} from '@elastic/eui';

const ReportSettings = (props) => {
  
  const { reportSettingsDashboard, onChangeReportSettingsDashboard} = props;

  return(
    <EuiPageContent panelPaddingSize={"l"}>
      <EuiPageHeader>
        <EuiTitle>
            <h2>Report Settings</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule/>
      <EuiPageContentBody>
        <b>Name</b> <br/>
        Specify a descriptive report name <br/>
        <br/>
        <EuiFieldText
          placeholder="Report Name"
        />
        <br/>
        <b>Dashboard</b> <br/>
        <br/>
        <EuiFlexGroup justifyContent="spaceEvenly" gutterSize={"s"}>
          <EuiFlexItem grow={4}>
            <EuiFieldText
              placeholder="Start typing to display suggestions"
              value={reportSettingsDashboard}
              onChange={onChangeReportSettingsDashboard}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton fill>Browse</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

export { ReportSettings };