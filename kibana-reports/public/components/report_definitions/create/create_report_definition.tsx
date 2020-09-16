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
  EuiGlobalToastList,
  EuiButton,
  EuiPage,
  EuiTitle,
  EuiPageBody,
  EuiSpacer,
} from '@elastic/eui';
import { ReportSettings } from '../report_settings';
import { ReportDelivery } from '../delivery';
import { ReportTrigger } from '../report_trigger';
import { generateReport } from '../../main/main_utils';

export const TIMEZONE_OPTIONS = [
  { value: -4, text: 'EDT -04:00' },
  { value: -5, text: 'CDT -05:00' },
  { value: -6, text: 'MDT -06:00' },
  { value: -7, text: 'MST/PDT -07:00' },
  { value: -8, text: 'AKDT -08:00' },
  { value: -10, text: 'HST -10:00' },
];

export let defaultUrl;

export function CreateReport(props) {
  let createReportDefinitionRequest = {
    report_name: '',
    report_source: '',
    report_type: '',
    description: '',
    report_params: {
      url: ``,
      report_format: '',
    },
    delivery: {},
    trigger: {},
  };

  const [toasts, setToasts] = useState([]);

  const addErrorToastHandler = () => {
    const errorToast = {
      title: 'Error creating report definition',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorToast = () => {
    addErrorToastHandler();
  }

  const addSuccessToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: <p>Report definition successfully created!</p>
    }
    setToasts(toasts.concat(successToast));
  }

  const handleSuccessToast = () => {
    addSuccessToastHandler();
  }

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const createNewReportDefinition = async (metadata) => {
    const { httpClient } = props;
    httpClient
      .post('../api/reporting/reportDefinition', {
        body: JSON.stringify(metadata),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async (resp) => {
        if (
          metadata['trigger']['trigger_params']['schedule_type'] === 'Now' ||
          metadata['trigger']['trigger_type'] === 'On demand'
        ) {
          let onDemandDownloadMetadata = {
            report_name: metadata['report_name'],
            report_source: metadata['report_source'],
            report_type: metadata['report_type'],
            description: metadata['description'],
            report_params: {
              url: metadata['report_params']['url'],
              window_width: 1440,
              window_height: 2560,
              report_format: metadata['report_params']['report_format'],
            },
          };
          generateReport(onDemandDownloadMetadata, httpClient);
        }
        await handleSuccessToast();
        window.location.assign(`opendistro_kibana_reports#/`);
      })
      .catch((error) => {
        console.log('error in creating report definition:', error);
        handleErrorToast();
      });
  };

  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Reporting',
        href: '#',
      },
      {
        text: 'Create report definition',
        href: '#/create',
      },
    ]);
  }, []);

  return (
    <div>
      <EuiPageBody>
        <EuiTitle>
          <h1>Create report definition</h1>
        </EuiTitle>
        <EuiSpacer />
        <ReportSettings
          edit={false}
          reportDefinitionRequest={createReportDefinitionRequest}
          httpClientProps={props['httpClient']}
        />
        <EuiSpacer />
        <ReportTrigger
          edit={false}
          reportDefinitionRequest={createReportDefinitionRequest}
        />
        <EuiSpacer />
        <ReportDelivery
          edit={false}
          reportDefinitionRequest={createReportDefinitionRequest}
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
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </EuiPageBody>
    </div>
  );
}
