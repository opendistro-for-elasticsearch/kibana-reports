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
        {/* <b>Source</b> <br/> */}
        {/* <ReportSettingsRadio/> <br/> */}
        {/* <EuiRadioGroup
            options={this.radios}
            idSelected={this.state.reportSettingsSetRadioIdSelected}
            onChange={this.onChangeReportSettingsRadio}
            name="radio group"
            legend={{
            children: <span>This is a legend for a radio group</span>,
            }}
        /> */}
        <b>Dashboard</b> <br/>
        <br/>
        <EuiFlexGroup justifyContent="spaceEvenly" gutterSize={"s"}>
          <EuiFlexItem grow={4}>
            <EuiFieldText
              placeholder="Start typing to display suggestions"
              value={reportSettingsDashboard}
              onChange={onChangeReportSettingsDashboard}
            />
            {/* <this.ReportSettingsDashboardSelect/> */}
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