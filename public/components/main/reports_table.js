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
    filters: [
      // {
      //   type: 'is',
      //   field: 'online',
      //   name: 'Online',
      //   negatedName: 'Offline',
      // },
      // {
      //   type: 'field_value_selection',
      //   field: 'nationality',
      //   name: 'Nationality',
      //   multiSelect: false,
      //   options: options,
      // },
    ],
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

    returnColumns() {
        console.log("in return columns")
        // return this.columns;
        console.log(this.columns)
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
          // dataType: 'boolean',
          // render: online => {
          //   const color = online ? 'success' : 'danger';
          //   const label = online ? 'Online' : 'Offline';
          //   return <EuiHealth color={color}>{label}</EuiHealth>;
          // },
          // sortable: true,
        },
      ];
    
      search = {
        toolsLeft: this.renderToolsLeft,
        toolsRight: this.renderToolsRight,
        box: {
          incremental: true,
        },
        filters: [
          // {
          //   type: 'is',
          //   field: 'online',
          //   name: 'Online',
          //   negatedName: 'Offline',
          // },
          // {
          //   type: 'field_value_selection',
          //   field: 'nationality',
          //   name: 'Nationality',
          //   multiSelect: false,
          //   options: options,
          // },
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