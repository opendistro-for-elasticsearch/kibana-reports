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
  EuiGlobalToastList,
} from '@elastic/eui';
import { ReportSettings } from '../report_settings';
import { ReportDelivery } from '../delivery';
import { ReportTrigger } from '../report_trigger';
import { ReportDefinitionSchemaType } from 'server/model';

export function EditReportDefinition(props) {
  const [toasts, setToasts] = useState([]);

  const addErrorUpdatingReportDefinitionToast = () => {
    const errorToast = {
      title: 'Error updating report definition',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorUpdatingReportDefinitionToast = () => {
    addErrorUpdatingReportDefinitionToast();
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const reportDefinitionId = props['match']['params']['reportDefinitionId'];
  let curReportDefinition: ReportDefinitionSchemaType;
  let editReportDefinitionRequest = {
    report_params: {
      report_name: '',
      report_source: '',
      description: '',
      core_params: {
        base_url: '',
        report_format: '',
        time_duration: '',
      },
    },
    delivery: {
      delivery_type: '',
      delivery_params: {},
    },
    trigger: {
      trigger_type: '',
    },
    time_created: 0,
    last_updated: 0,
    status: '',
  };

  let timeRange = {
    timeFrom: new Date(),
    timeTo: new Date(),
  };

  const callUpdateAPI = async (metadata) => {
    const { httpClient } = props;

    httpClient
      .put(`../api/reporting/reportDefinitions/${reportDefinitionId}`, {
        body: JSON.stringify(metadata),
        params: reportDefinitionId.toString(),
      })
      .then(async () => {
        window.location.assign(`opendistro_kibana_reports#/`);
      })
      .catch((error) => {
        console.error('error in updating report definition:', error);
        handleErrorUpdatingReportDefinitionToast();
      });
  };

  const editReportDefinition = async (metadata) => {
    const { httpClient } = props;
    /*
      we check if this edit update the trigger type from Schedule to On demand. 
      If so, need to first delete the curReportDefinition along with the scheduled job first, by calling the delete
      report definition API
    */
    const {
      trigger: { trigger_type: triggerType },
    } = curReportDefinition;
    if (
      triggerType !== 'On demand ' &&
      metadata.trigger.trigger_type === 'On demand'
    ) {
      httpClient
        .delete(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
        .then(async () => {
          await callUpdateAPI(metadata);
        })
        .catch((error) => {
          console.log('error when deleting report definition:', error);
        });
    } else {
      await callUpdateAPI(metadata);
    }
  };

  useEffect(() => {
    const { httpClient } = props;
    httpClient
      .get(`../api/reporting/reportDefinitions/${reportDefinitionId}`)
      .then((response) => {
        curReportDefinition = response.report_definition;
        const {
          time_created: timeCreated,
          status,
          last_updated: lastUpdated,
          report_params: { report_name: reportName },
        } = curReportDefinition;
        // configure non-editable fields
        editReportDefinitionRequest.time_created = timeCreated;
        editReportDefinitionRequest.last_updated = lastUpdated;
        editReportDefinitionRequest.status = status;

        props.setBreadcrumbs([
          {
            text: 'Reporting',
            href: '#',
          },
          {
            text: `Report definition details: ${reportName}`,
            href: `#/report_definition_details/${reportDefinitionId}`,
          },
          {
            text: `Edit report definition: ${reportName}`,
          },
        ]);
      })
      .catch((error) => {
        console.error(
          'error when loading edit report definition page: ',
          error
        );
      });
  }, []);

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
          timeRange={timeRange}
        />
        <EuiSpacer />
        <ReportTrigger
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
          timeRange={timeRange}
        />
        <EuiSpacer />
        <ReportDelivery
          edit={true}
          editDefinitionId={reportDefinitionId}
          reportDefinitionRequest={editReportDefinitionRequest}
          httpClientProps={props['httpClient']}
          timeRange={timeRange}
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
        <EuiGlobalToastList
          toasts={toasts}
          dismissToast={removeToast}
          toastLifeTimeMs={6000}
        />
      </EuiPageBody>
    </EuiPage>
  );
}
