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

import React, { Fragment, useEffect, useState } from 'react';
import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiPage,
  EuiTitle,
  EuiPageBody,
  EuiSpacer,
  EuiGlobalToastList,
} from '@elastic/eui';
import { ReportSettings } from '../report_settings';
import { ReportDelivery } from '../delivery';
import { ReportTrigger } from '../report_trigger';

export const TIMEZONE_OPTIONS = [
  { value: -4, text: 'EDT -04:00' },
  { value: -5, text: 'CDT -05:00' },
  { value: -6, text: 'MDT -06:00' },
  { value: -7, text: 'MST/PDT -07:00' },
  { value: -8, text: 'AKDT -08:00' },
  { value: -10, text: 'HST -10:00' },
];

export function CreateReport(props) {
  const [
    reportSettingsDashboardOptions,
    setReportSettingsDashboardOptions,
  ] = useState([]);

  const handleReportSettingsDashboardOptions = (e) => {
    setReportSettingsDashboardOptions(e);
  };

  let createReportDefinitionRequest = {
    report_name: '',
    report_source: '',
    report_type: '',
    description: '',
    report_params: {
      url: ``,
      report_format: '',
      window_width: 1560,
      window_height: 2560,
    },
    delivery: {},
    trigger: {},
  };

  const createNewReportDefinition = async (metadata) => {
    fetch('../api/reporting/reportDefinition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'reporting',
      },
      body: JSON.stringify(metadata),
    })
      .then(async (resp) => {
        window.location.assign(`opendistro_kibana_reports#/`);
      })
      .catch((error) => {
        console.log('error in creating report definition:', error);
      });
  };

  const getReportSettingDashboardOptions = (data) => {
    let index;
    let dashboard_options = [];
    for (index = 0; index < data.length; ++index) {
      let entry = {
        value: data[index]['_id'].substring(10),
        text: data[index]['_source']['dashboard']['title'],
      };
      dashboard_options.push(entry);
    }
    return dashboard_options;
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get('../api/reporting/getDashboards')
      .then((response) => {
        handleReportSettingsDashboardOptions(
          getReportSettingDashboardOptions(response['hits']['hits'])
        );
        createReportDefinitionRequest['report_params']['url'] =
          'http://localhost:5601/app/dashboards#/view/' +
          response['hits']['hits'][0]['_id'].substring(10);
      })
      .catch((error) => {
        console.log('error when fetching dashboards:', error);
      });
  }, []);

  return (
    <EuiPage>
      <EuiPageBody>
        <EuiTitle>
          <h1>Create report definition</h1>
        </EuiTitle>
        <EuiSpacer />
        <ReportSettings
          createReportDefinitionRequest={createReportDefinitionRequest}
          dashboardOptions={reportSettingsDashboardOptions}
        />
        <EuiSpacer />
        <ReportTrigger
          createReportDefinitionRequest={createReportDefinitionRequest}
        />
        <EuiSpacer />
        <ReportDelivery
          createReportDefinitionRequest={createReportDefinitionRequest}
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
              fill={true}
              onClick={() =>
                createNewReportDefinition(createReportDefinitionRequest)
              }
            >
              Create
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageBody>
    </EuiPage>
  );
}
