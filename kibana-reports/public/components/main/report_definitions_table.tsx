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
  EuiLink,
  EuiInMemoryTable,
  EuiButton,
  EuiEmptyPrompt,
  EuiText,
  EuiIcon,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { humanReadableDate } from './main_utils';

const emptyMessageReportDefinitions = (
  <EuiEmptyPrompt
    title={<h3>{i18n.translate('odfe.reports.reportDefinitionsTable.emptyMessageReports.noReportDefinitions', { defaultMessage: 'No report definitions to display' })}</h3>}
    titleSize="xs"
    body={
      <div>
        <EuiText>{i18n.translate('odfe.reports.reportDefinitionsTable.emptyMessageReports.createANewDefinition', { defaultMessage: 'Create a new report definition to get started' })}</EuiText>
        <EuiText>
          {i18n.translate('odfe.reports.reportDefinitionsTable.emptyMessageReports.toLearnMore', { defaultMessage: 'To learn more, see' })}{' '}
          <EuiLink
            href="https://opendistro.github.io/for-elasticsearch-docs/docs/kibana/reporting/"
            target="_blank"
          >
            {i18n.translate('odfe.reports.reportDefinitionsTable.emptyMessageReports.getStarted', { defaultMessage: 'Get started with Kibana reporting' })}<EuiIcon type="popout" />
          </EuiLink>
        </EuiText>
      </div>
    }
    actions={
      <div>
        <EuiButton
          onClick={() => {
            window.location.assign('opendistro_kibana_reports#/create');
          }}
        >
          {i18n.translate('odfe.reports.reportDefinitionsTable.emptyMessageReports.createReportDefinition', { defaultMessage: 'Create report definition' })}
        </EuiButton>
      </div>
    }
  />
);

const reportDefinitionsSearch = {
  box: {
    incremental: true,
  },
  filters: [],
};

export function ReportDefinitions(props) {
  const { pagination, reportDefinitionsTableContent } = props;

  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('des');

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const getDefinitionTableItemId = (name) => {
    let index;
    for (
      index = 0;
      index < props.reportDefinitionsTableContent.length;
      ++index
    ) {
      if (name === reportDefinitionsTableContent[index].reportName) {
        return reportDefinitionsTableContent[index].id;
      }
    }
  };

  const navigateToDefinitionDetails = (name: any) => {
    let id = getDefinitionTableItemId(name);
    window.location.assign(
      `opendistro_kibana_reports#/report_definition_details/${id}`
    );
  };

  const reportDefinitionsColumns = [
    {
      field: 'reportName',
      name: i18n.translate('odfe.reports.reportDefinitionsTable.columns.name', { defaultMessage: 'Name' }),
      render: (name) => (
        <EuiLink
          onClick={() => navigateToDefinitionDetails(name)}
          id={'reportDefinitionDetailsLink'}
        >
          {name}
        </EuiLink>
      ),
    },
    {
      field: 'source',
      name: i18n.translate('odfe.reports.reportDefinitionsTable.columns.source', { defaultMessage: 'Source' }),
      render: (value, item) => (
        <EuiLink href={item.baseUrl} target="_blank">
          {value}
        </EuiLink>
      ),
    },
    {
      field: 'type',
      name: i18n.translate('odfe.reports.reportDefinitionsTable.columns.type', { defaultMessage: 'Type' }),
      sortable: true,
      truncateText: false,
    },
    {
      field: 'details',
      name: i18n.translate('odfe.reports.reportDefinitionsTable.columns.scheduleDetails', { defaultMessage: 'Schedule details' }),
      sortable: false,
      truncateText: true,
    },
    {
      field: 'lastUpdated',
      name: i18n.translate('odfe.reports.reportDefinitionsTable.columns.lastUpdated', { defaultMessage: 'Last Updated' }),
      render: (date) => {
        let readable = humanReadableDate(date);
        return <EuiText size="s">{readable}</EuiText>;
      },
    },
    {
      field: 'status',
      name: i18n.translate('odfe.reports.reportDefinitionsTable.columns.status', { defaultMessage: 'Status' }),
      sortable: true,
      truncateText: false,
    },
  ];

  const displayMessage =
    reportDefinitionsTableContent.length === 0
      ? emptyMessageReportDefinitions
      : i18n.translate('odfe.reports.reportDefinitionsTable.emptyMessageReports.noDefinitionsFound', { defaultMessage: '0 report definitions match the search criteria. Search again.' });

  return (
    <div>
      <EuiInMemoryTable
        items={reportDefinitionsTableContent}
        itemId="id"
        loading={false}
        message={displayMessage}
        columns={reportDefinitionsColumns}
        search={reportDefinitionsSearch}
        pagination={pagination}
        sorting={sorting}
        isSelectable={true}
        tableLayout={'auto'}
      />
    </div>
  );
}
