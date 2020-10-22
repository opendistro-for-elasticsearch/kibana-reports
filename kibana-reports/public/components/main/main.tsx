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

import React, { Fragment, useState, useEffect } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiTitle,
  // @ts-ignore
  EuiHorizontalRule,
  EuiSpacer,
  EuiPanel,
  EuiGlobalToastList,
} from '@elastic/eui';
import { ReportsTable } from './reports_table';
import { ReportDefinitions } from './report_definitions_table';
import {
  addReportsTableContent,
  addReportDefinitionsTableContent,
} from './main_utils';
import CSS from 'csstype';

const reportCountStyles: CSS.Properties = {
  color: 'gray',
  display: 'inline',
};

export function Main(props) {
  const [reportsTableContent, setReportsTableContent] = useState([]);
  const [
    reportDefinitionsTableContent,
    setReportDefinitionsTableContent,
  ] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addReportsTableContentErrorToastHandler = () => {
    const errorToast = {
      title: 'Error generating reports table content',
      color: 'danger',
      iconType: 'alert',
      id: 'reportsTableErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleReportsTableContentErrorToast = () => {
    addReportsTableContentErrorToastHandler();
  };

  const addReportDefinitionsTableErrorToastHandler = () => {
    const errorToast = {
      title: 'Error generating report definitions table content',
      color: 'danger',
      iconType: 'alert',
      id: 'reportDefinitionsTableErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleReportDefinitionsTableErrorToast = () => {
    addReportDefinitionsTableErrorToastHandler();
  };

  const addErrorOnDemandDownloadToastHandler = () => {
    const errorToast = {
      title: 'Error downloading report',
      color: 'danger',
      iconType: 'alert',
      id: 'onDemandDownloadErrorToast',
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleOnDemandDownloadErrorToast = () => {
    addErrorOnDemandDownloadToastHandler();
  };

  const addSuccessOnDemandDownloadToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: <p>Report successfully downloaded!</p>,
      id: 'onDemandDownloadSuccessToast',
    };
    setToasts(toasts.concat(successToast));
  };

  const handleOnDemandDownloadSuccessToast = () => {
    addSuccessOnDemandDownloadToastHandler();
  };

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const pagination = {
    initialPageSize: 10,
    pageSizeOptions: [8, 10, 13],
  };

  useEffect(() => {
    props.setBreadcrumbs([
      {
        text: 'Reporting',
        href: '#',
      },
    ]);
    refreshReportsTable();
    refreshReportsDefinitionsTable();

    // refresh might not fetch the latest changes when coming from CreateReport page
    // workaround to wait 1 second and refresh again
    setTimeout(() => {
      refreshReportsTable();
      refreshReportsDefinitionsTable();
    }, 1000);
  }, []);

  const refreshReportsTable = async () => {
    const { httpClient } = props;
    await httpClient
      .get('../api/reporting/reports')
      .then((response) => {
        setReportsTableContent(addReportsTableContent(response.data));
      })
      .catch((error) => {
        console.log('error when fetching all reports: ', error);
        handleReportsTableContentErrorToast();
      });
  };

  const refreshReportsDefinitionsTable = async () => {
    const { httpClient } = props;
    await httpClient
      .get('../api/reporting/reportDefinitions')
      .then((response) => {
        setReportDefinitionsTableContent(
          addReportDefinitionsTableContent(response.data)
        );
      })
      .catch((error) => {
        console.log('error when fetching all report definitions: ', error);
        handleReportDefinitionsTableErrorToast();
      });
  };

  const getReportsRowProps = (item: any) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: (e: any) => {
        if (!$(e.target).is('button')) {
          window.location.assign(
            `opendistro_kibana_reports#/report_details/${item.id}${props.history.location.search}`
          );
        }
      },
    };
  };

  const getReportDefinitionsRowProps = (item: any) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: (e: any) => {
        if (!$(e.target).is('button')) {
          window.location.assign(
            `opendistro_kibana_reports#/report_definition_details/${item.id}${props.history.location.search}`
          );
        }
      },
    };
  };

  return (
    <div>
      <EuiPanel paddingSize={'l'}>
        <EuiFlexGroup justifyContent="spaceEvenly">
          <EuiFlexItem>
            <EuiTitle>
              <h2>
                Reports{' '}
                <p style={reportCountStyles}> ({reportsTableContent.length})</p>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem component="span" grow={false}>
            <EuiButton size="m" onClick={refreshReportsTable}>
              Refresh
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule />
        <ReportsTable
          getRowProps={getReportsRowProps}
          pagination={pagination}
          reportsTableItems={reportsTableContent}
          httpClient={props['httpClient']}
          handleSuccessToast={handleOnDemandDownloadSuccessToast}
          handleErrorToast={handleOnDemandDownloadErrorToast}
        />
      </EuiPanel>
      <EuiSpacer />
      <EuiPanel paddingSize={'l'}>
        <EuiFlexGroup justifyContent="spaceEvenly">
          <EuiFlexItem>
            <EuiTitle>
              <h2>
                Report definitions
                <p style={reportCountStyles}>
                  {' '}
                  ({reportDefinitionsTableContent.length})
                </p>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={refreshReportsDefinitionsTable}>
              Refresh
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem component="span" grow={false}>
            <EuiButton
              fill={true}
              onClick={() => {
                window.location.assign('opendistro_kibana_reports#/create');
              }}
            >
              Create
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule />
        <ReportDefinitions
          pagination={pagination}
          getRowProps={getReportDefinitionsRowProps}
          reportDefinitionsTableContent={reportDefinitionsTableContent}
        />
      </EuiPanel>
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
    </div>
  );
}
