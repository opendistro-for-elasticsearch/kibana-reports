import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
    EuiFieldText,
    EuiSuperSelect,
    EuiPageSideBar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButton,
    EuiPage,
    EuiPageHeader,
    EuiTitle,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageContentHeaderSection,
    EuiInMemoryTable,
    EuiHorizontalRule,
    EuiSpacer,
    EuiSearchBar,
    EuiLink,
    EuiHealth,
    EuiText,
    EuiEmptyPrompt,
    EuiRadioGroup,
  } from '@elastic/eui';
  import { htmlIdGenerator } from '@elastic/eui/lib/services';

  const idPrefix = htmlIdGenerator()();

  const ReportSettingsRadio = () => {
    const radios = [
        {
          id: `${idPrefix}0`,
          label: 'Dashboard',
        },
        {
          id: `${idPrefix}1`,
          label: 'Visualization',
        },
        {
          id: `${idPrefix}2`,
          label: 'Saved Search',
        },
      ];
    
      const [radioIdSelected, setRadioIdSelected] = useState(`${idPrefix}1`);
    
      const onChangeSettingsRadio = optionId => {
        setRadioIdSelected(optionId);
      };
    
      return (
          <EuiRadioGroup
            options={radios}
            idSelected={radioIdSelected}
            onChange={id => onChangeSettingsRadio(id)}
            name="report settings radio group"
            legend={{
              children: <span>This is a legend for a radio group</span>,
            }}
          />
      );
  };

  const DeliveryChannelRadio = () => {
    const radios = [
        {
          id: `${idPrefix}3`,
          label: 'None (report will be available in Reports List page)',
        },
        {
          id: `${idPrefix}4`,
          label: 'Email',
        },
        {
          id: `${idPrefix}5`,
          label: 'Chime',
        },
        {
          id: `${idPrefix}6`,
          label: 'Other (webhook)'
        }
      ];
    
      const [radioIdSelected, setRadioIdSelected] = useState(`${idPrefix}3`);
    
      const onChangeDeliveryChannel = optionId => {
        setRadioIdSelected(optionId);
      };
    
      return (
          <EuiRadioGroup
            options={radios}
            idSelected={radioIdSelected}
            onChange={id => onChangeDeliveryChannel(id)}
            name="delivery channel radio group"
            legend={{
              children: <span>This is a legend for a radio group</span>,
            }}
          />
      );
  };

  const ScheduleRadio = () => {
    const radios = [
        {
          id: `${idPrefix}7`,
          label: 'Dashboard',
        },
        {
          id: `${idPrefix}8`,
          label: 'Visualization',
        },
        {
          id: `${idPrefix}9`,
          label: 'Saved Search',
        },
      ];
    
      const [radioIdSelected, setRadioIdSelected] = useState(`${idPrefix}7`);
    
      const onChangeSettingsRadio = optionId => {
        setRadioIdSelected(optionId);
      };
    
      return (
          <EuiRadioGroup
            options={radios}
            idSelected={radioIdSelected}
            onChange={id => onChangeSettingsRadio(id)}
            name="schedule radio group"
            legend={{
              children: <span>This is a legend for a radio group</span>,
            }}
          />
      );
  };


  export class CreateReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportSettingsRadioIdSelected: '',
            reportSettingsSetRadioIdSelected: `${idPrefix}1`,
            reportSettingsDashboard: '',
        };
    }

    onChangeReportSettingsRadio = (e) => {
        // this.setState({
        //     reportSettingsRadioIdSelected: e
        // });
    }
    onChangeReportSettingsDashboard = (e) => {
        this.setState({
            reportSettingsDashboard: e.target.value
        });
    }

    radios = [
        {
          id: `${idPrefix}0`,
          label: 'None (report will be available in Reports List page)',
        },
        {
          id: `${idPrefix}1`,
          label: 'Email',
        },
        {
          id: `${idPrefix}2`,
          label: 'Chime',
        },
        {
          id: `${idPrefix}3`,
          label: 'Other (webhook)'
        }
    ];

    componentDidMount() {
        const { httpClient } = this.props;
    }

    render() {
        const { httpClient } = this.props;
        return (
           <EuiPage>
               <EuiPageBody>
                  <EuiTitle>
                    <h1>Create Report</h1>
                  </EuiTitle>
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
                            <b>Source</b> <br/>
                            <ReportSettingsRadio/> <br/>
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
                            <EuiFlexGroup gutterSize="l" component="div">
                                <EuiFlexItem grow={1}>
                                    <EuiFieldText
                                        placeholder="Start typing to display suggestions"
                                        value={this.state.reportSettingsDashboard}
                                        onChange={this.onChangeReportSettingsDashboard}
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiButton size="m" fill>Browse</EuiButton>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                    <EuiSpacer/>
                    <EuiPageContent panelPaddingSize={"l"}>
                        <EuiPageHeader>
                            <EuiTitle>
                                <h2>Delivery</h2>
                            </EuiTitle>
                        </EuiPageHeader>
                        <EuiHorizontalRule/>
                        <EuiPageContentBody>
                            <b>Channel</b><br/>
                            <br/>
                            Define delivery notification channel <br/>
                            <br/>
                            <DeliveryChannelRadio/>
                            <br/>
                            <b>Recipients</b><br/>
                            <br/>

                        </EuiPageContentBody>
                    </EuiPageContent>
                    <EuiSpacer/>
                    <EuiPageContent panelPaddingSize={"l"}>
                        <EuiPageHeader>
                            <EuiTitle>
                                <h2>Schedule</h2>
                            </EuiTitle>
                        </EuiPageHeader>
                        <EuiHorizontalRule/>
                        <EuiPageContentBody>
                            <b>Request Time</b> <br/>
                            <br/>
                            Define delivery schedule and frequency <br/>
                            <br/>
                            <ScheduleRadio/>
                        </EuiPageContentBody>
                    </EuiPageContent>
               </EuiPageBody>
           </EuiPage>
        );
    }
  }