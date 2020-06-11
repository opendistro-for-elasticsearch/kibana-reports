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
  EuiButton,
  EuiPage,
  EuiLink
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';

export const reports_list_columns = [
    {
      field: 'reportName',
      name: 'Name',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'created',
      name: 'Created',
      truncateText: true,
    },
    {
      field: 'reportSource',
      name: 'Source',
      render: username => (
        <EuiLink href={`https://github.com/${username}`} target="_blank">
          {username}
        </EuiLink>
      ),
    },
    {
      field: 'reportPDF',
      name: 'File',
      truncateText: true,
    },
];

export const reports_list_users = [
    {
        id: 1,
        reportName: 'Daily Sales Report, April 21',
        created: 'April 21, 2020 @ 17:00:00',
        reportSource: 'dashboard/daily_saves',
        reportPDF: 'daily_sales_report_2020-04-21_17-e29f99ec3ce8.pdf'
    },
    {
        id: 2,
        reportName: 'Daily Sales Report, April 22',
        created: 'April 22, 2020 @ 17:00:00',
        reportSource: 'dashboard/daily_saves',
        reportPDF: 'daily_sales_report_2020-04-22_17-0012395b51ed.pdf'
    },
    {
        id: 3,
        reportName: 'Daily Sales Report, April 23',
        created: 'April 23, 2020 @ 17:00:00',
        reportSource: 'dashboard/daily_saves',
        reportPDF: 'daily_sales_report_2020-04-23_17-44cf47ed1283jd.pdf'
    },
]

export const reports_list_search = {
    toolsLeft: renderToolsLeft,
    toolsRight: renderToolsRight,
    box: {
      incremental: true,
    },
    filters: [],
};

const renderToolsRight = () => {
    return [
      <EuiButton
        key="loadUsers"
        onClick={() => {
          loadUsers();
        }}
        isDisabled={loading}>
        Load Users
      </EuiButton>,
      <EuiButton
        key="loadUsersError"
        onClick={() => {
          loadUsersWithError();
        }}
        isDisabled={loading}>
        Load Users (Error)
      </EuiButton>,
    ];
};

const renderToolsLeft = () => {
    if (selection.length === 0) {
      return;
    }

    const onClick = () => {
      store.deleteUsers(...selection.map(user => user.id));
      setSelection([]);
    };

    return (
      <EuiButton color="danger" iconType="trash" onClick={onClick}>
        Delete {selection.length} Users
      </EuiButton>
    );
};

export const reports_list_selection_value = {
    selectable: user => user.online,
    selectableMessage: selectable =>
        !selectable ? 'User is currently offline' : undefined,
    onSelectionChange: selection => setSelection(selection),
};

export default class ReportsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columns = columns;
    }

      columns = [
        {
          field: 'reportName',
          name: 'Report Name',
          sortable: true,
          truncateText: true,
        },
        {
          field: 'created',
          name: 'Created',
          truncateText: true,
        },
        {
          field: 'reportSource',
          name: 'Source',
          render: username => (
            <EuiLink href={`https://github.com/${username}`} target="_blank">
              {username}
            </EuiLink>
          ),
        },
        {
          field: 'reportPDF',
          name: 'File',
          truncateText: true,
        },
      ];
    
      search = {
        toolsLeft: this.renderToolsLeft,
        toolsRight: this.renderToolsRight,
        box: {
          incremental: true,
        },
        filters: [
        ],
      };
    
      renderToolsLeft = () => {
        if (selection.length === 0) {
          return;
        }
    
        const onClick = () => {
          store.deleteUsers(...selection.map(user => user.id));
          setSelection([]);
        };
    
        return (
          <EuiButton color="danger" iconType="trash" onClick={onClick}>
            Delete {selection.length} Users
          </EuiButton>
        );
      };
    
      renderToolsRight = () => {
        return [
          <EuiButton
            key="loadUsers"
            onClick={() => {
              loadUsers();
            }}
            isDisabled={loading}>
            Load Users
          </EuiButton>,
          <EuiButton
            key="loadUsersError"
            onClick={() => {
              loadUsersWithError();
            }}
            isDisabled={loading}>
            Load Users (Error)
          </EuiButton>,
        ];
      };
    
      pagination = {
        initialPageSize: 10,
        pageSizeOptions: [8, 10, 13],
      };
    
      selectionValue = {
        selectable: user => user.online,
        selectableMessage: selectable =>
          !selectable ? 'User is currently offline' : undefined,
        onSelectionChange: selection => setSelection(selection),
      };

    componentDidMount() {
        const { httpClient } = this.props;
    }

    render() {
        const { title } = this.props;
        return (
            <EuiPage>
                Template page
            </EuiPage>
        );
    }
}