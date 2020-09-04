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

import React, { useEffect, useState } from 'react';
import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiPage,
  EuiTitle,
  EuiPageBody,
  EuiSpacer,
} from '@elastic/eui';
import { ReportSettings } from '../report_settings';
import { ReportDelivery } from '../delivery';
import { ReportTrigger } from '../report_trigger';

export function EditReportDefinition(props) {
  const reportDefinitionId = props['match']['params']['reportDefinitionId'];
  let editReportDefinitionRequest = {
    report_name: '',
    report_source: '',
    report_type: '',
    description: '',
    report_params: {
      url: '',
      report_format: '',
    },
    delivery: {},
    trigger: {},
  };

  const editReportDefinition = async (metadata) => {
    const { httpClient } = props;
    httpClient
      .put(`../api/reporting/reportDefinitions/${reportDefinitionId}`, {
        body: JSON.stringify(metadata),
        params: reportDefinitionId.toString(),
      })
      .then(async (response) => {
        window.location.assign(`opendistro_kibana_reports#/`);
      })
      .catch((error) => {
        console.error('error in updating report definition:', error);
      });
  };

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle>
          <h1>Edit report definition</h1>
        </EuiTitle>
        <EuiSpacer />
        <ReportSettings
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
        />
        <EuiSpacer />
        <ReportTrigger
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
        />
        <EuiSpacer />
        <ReportDelivery
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
        />
        <EuiSpacer />
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              onClick={() => {
                window.location.assign('opendistro_kibana_reports#/');
              }}
            >
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              onClick={() => editReportDefinition(editReportDefinitionRequest)}
            >
              Save Changes
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageBody>
    </EuiPage>
  );
}
