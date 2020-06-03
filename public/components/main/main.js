import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  EuiFieldText,
  EuiCheckbox,
  EuiComboBox,
  EuiSuperSelect,
  EuiFlexGroup,
  EuiFlexItem,
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
  EuiEmptyPrompt
} from '@elastic/eui';
import {reports_list_columns, reports_list_users, reports_list_search, reports_list_selection_value} from './reports_table'
import {scheduled_report_columns, scheduled_reports} from './scheduled_reports_table'
import { Fragment } from 'react';

var httpClientGlobal;

function fetchDownloadApi(url) {
    console.log("fetch download api")
    var data = {
      url: url
    }
     httpClientGlobal.post('../api/reporting/download', JSON.stringify(data)).then((resp) => {
      console.log(resp)
    });
}

function getDashboardList(data) {
  var hits = data.hits["hits"];
  var dashboardList = new Array(hits.length);
  for (var i = 0; i < hits.length; ++i) {
    var dashboardDict = {};
    dashboardDict["name"] = hits[i]["_source"]["dashboard"]["title"];
    dashboardDict["id"] = hits[i]["_id"];
    dashboardDict["id"] = dashboardDict["id"].replace("dashboard:", "");
    dashboardList[i] = dashboardDict;
  }
  return dashboardList;
}

const emptyMessageReports = (
  <EuiEmptyPrompt
    title={<h3>You Have No Reports</h3>}
    titleSize="xs"
    body="Create a report from a dashboard or template"
    actions={
      <EuiButton fill>Create Report</EuiButton>
    }
  />
)

const emptyMessageScheduledReports = (
  <div>
    <h3>You Have No Scheduled Reports</h3>
    <p>
      Create a new schedule to get started
    </p>
    <EuiButton fill>Create Schedule</EuiButton>
  </div>
)
const loading = false

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardList: [],
      selectedDashboard: "",
      selectedScheduleFrequency: "",
      selectedDashboardForSchedule: "",
      schedulerEmailAddress: "",
      scheduledReportFileName: [],
      pagination: this.pagination,
      renderCreateReport: false,
      selectedOptions: this.selectedOptions,
      setSelected: this.setSelected,
    };
    this.renderDashboardTable = this.renderDashboardTable.bind(this);
  }

  renderDashboardTable() {
    return this.state.dashboardList.map((dashboard, index) => {
      const { name, id } = dashboard;
      return (
        <tr key={id}>
           <EuiButton type="primary" 
           onClick={() => fetchDownloadApi("http://localhost:5601/app/kibana#/dashboard/" + id)}>{name}</EuiButton>
        </tr>
      )
    })
  }

  pagination = {
    initialPageSize: 10,
    pageSizeOptions: [8, 10, 13],
  };

  componentDidMount() {
    const { httpClient } = this.props;
    httpClientGlobal = httpClient;
    httpClient.get('../api/reporting/example').then((resp) => {
      this.setState({ time: resp.data.time });
    });
    httpClient.get('../api/reporting/get_dashboards').then((resp) => {
      this.setState({ dashboardList: getDashboardList(resp.data) })
      let dropdownDashboardList = resp.map(dashboard => {
        return {value: dashboard, display: dashboard}
      });
      this.setState({
        dropdownDashboardList: [{value: '', display: '(Select a dashboard to download)'}].concat(dropdownDashboardList)
      });
    });
  }

  render() {
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent panelPaddingSize={"l"}>
            <EuiFlexGroup justifyContent="spaceEvenly">
              <EuiFlexItem>
                <EuiTitle>
                  <h2>Reports ({reports_list_users.length})</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">
                  Delete
                </EuiButton>  
              </EuiFlexItem>  
            </EuiFlexGroup>
            <EuiHorizontalRule/>
            <EuiInMemoryTable
              items={reports_list_users}
              itemId="id"
              error={this.error}
              loading={false}
              message={emptyMessageReports}
              columns={reports_list_columns}
              search={reports_list_search}
              pagination={this.pagination}
              sorting={true}
              selection={reports_list_selection_value}
              isSelectable={true}
              />
          </EuiPageContent>
          <EuiSpacer/>
          <EuiPageContent panelPaddingSize={"l"} component="div" width="50px">
            <EuiFlexGroup justifyContent="spaceEvenly">
              <EuiFlexItem>
                <EuiTitle>
          <h2>Scheduled Reports ({scheduled_reports.length})</h2>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">
                  Delete
                </EuiButton>  
              </EuiFlexItem>  
              <EuiFlexItem component="span" grow={false}>
                <EuiButton size="m">
                  Edit
                </EuiButton>  
              </EuiFlexItem>              
              <EuiFlexItem component="span" grow={false}>
                <EuiButton 
                  fill={true}
                  onClick={() => {window.location.assign('reporting#/create')}}
                >
                  Create
                </EuiButton>
              </EuiFlexItem>          
            </EuiFlexGroup>
            <EuiHorizontalRule/>
            <EuiInMemoryTable
              items={scheduled_reports}
              itemId="id"
              error={this.error}
              loading={false}
              message={emptyMessageScheduledReports}
              columns={scheduled_report_columns}
              search={reports_list_search} // todo: change?
              pagination={this.pagination}
              sorting={true}
              selection={reports_list_selection_value} // todo: change?
              isSelectable={true}
            />
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
