
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
  EuiPage,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiButton,
  EuiSpacer,
  EuiComboBox,
  EuiSuperDatePicker,
  EuiLoadingContent

} from '@elastic/eui';
import chrome from 'ui/chrome';

import { CsvItem } from '../CsvItem';
import { Error } from '../Error';
import { FormattedMessage } from '@kbn/i18n/react';
import { toastNotifications } from 'ui/notify';
import dateMath from '@elastic/datemath';

import config from '../../../server/utils/constants';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      isPaused: true,
      hideCsvItem: true,
      hideLoader: true,
      isDisabled: true,
      isClearable: true,
      buttonIsLoading: false,
      refreshButtonIsLoading: false,
      refreshButtonIsDisabled: false,
      prevState: '',
      value: '',
      query: '',
      selected: '',
      recentlyUsedRanges: [],
      refreshInterval: 5,
      isLoading: false,
      start: 'now-30m',
      end: date.toString(),
      items: [],
      recentCsv: [],
      pageIndex: 0,
      pageSize: 5,
      showPerPageOptions: true,
      savedObjects: [],
      options: [],
      selectedOptions: [],
      clickCount: 1,
      authorization: false,
    };
  }

  onTimeChange = ({ start, end }) => {
    this.setState(prevState => {
      const recentlyUsedRanges = prevState.recentlyUsedRanges.filter(recentlyUsedRange => {
        const isDuplicate = recentlyUsedRange.start === start && recentlyUsedRange.end === end;
        return !isDuplicate;
      });
      recentlyUsedRanges.unshift({ start, end });
      return {
        start,
        end,
        recentlyUsedRanges:
          recentlyUsedRanges.length > 10 ? recentlyUsedRanges.slice(0, 9) : recentlyUsedRanges,
        isLoading: true,
      };
    }, this.startLoading);
  };

  onRefresh = ({ start, end, refreshInterval }) => {
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    }).then(() => {
      console.log(start, end, refreshInterval);
    });
  };

  startLoading = () => {
    setTimeout(this.stopLoading, 1000);
  };

  stopLoading = () => {
    this.setState({ isLoading: false });
  };

  onRefreshChange = ({ isPaused, refreshInterval }) => {
    this.setState({
      isPaused,
      refreshInterval,
    });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
      query: e.target.value,
    });
  };

  onSelectChange = selectedOptions => {
    if (selectedOptions.length === 0) {
      this.setState({
        isDisabled: true,
      });
    }
    this.setState({
      selectedOptions: selectedOptions,
      isDisabled: false,
    });
  };

  //setting up the index and the mappings during the first loading of the plugin
  setup = () => {
    const { httpClient } = this.props;
    httpClient
      .get(chrome.addBasePath('/api/reporting/setup'))
      .then(res => {
        if (res.data.ok) {
          this.getRecentCsv();
        } else {
          if (res.data.resp === 'Authorization Exception') {
            this.setState({
              authorization: true,
            });
            toastNotifications.addDanger(res.data.resp);
          } else {
            toastNotifications.addDanger('An Error Occurred While setting up the plugin');
          }
        }
      })
      .catch(error => {
        toastNotifications.addDanger('An Error Occurred While setting up the plugin');
        throw error;
      });
  };

  // get the latest 10 reports by the user.
  getRecentCsv = () => {
    const { httpClient } = this.props;
    return httpClient
      .get(chrome.addBasePath('/api/reporting/reportingList'))
      .then(res => {
        this.setState({  recentCsv: res.data.resp });
        if (this.state.recentCsv.length !== 0) {
          this.setState({ hideCsvItem: false });
        }
        return { ok: true, resp: res.data };
      })
      .catch(error => {
        if (error) {
          toastNotifications.addDanger('An Error Occurred While fetching the recent generated csv');
          return { ok: false, resp: error.message };
        }
      });
  };

  //get the list of saved searches.
  getSavedSearch = () => {
    const url = chrome.addBasePath('/api/kibana/management/saved_objects/_find?perPage=10000&page=1&fields=id&type=search');
    const { httpClient } = this.props;
    httpClient.get(url).then(res => {
        const data = res.data.saved_objects;
        data.map(data => { this.state.options.push({ label: data.meta.title, id: data.id });});
        this.setState({ savedObjects: data });
      })
      .then(error => {
        if (error) {
          this.setState({ options: [] });
          toastNotifications.addDanger('An Error Occurred While fetching the Saved Search');
          throw new Error('An Error Occurred While fetching the Saved Search');
        }
      });
  };

  refreshRecentCsv = () => {
    this.setState({
      hideLoader: false,
      hideCsvItem: true,
    });
    this.setState({ refreshButtonIsLoading: true });
    this.getRecentCsv().then(result => {
      if (result.ok) {
        this.setState({ refreshButtonIsLoading: false });
        toastNotifications.addSuccess('Refreshing done!');
      } else {
        toastNotifications.addDanger('Ouppss An Error Occured ! ' + result.resp);
      }
    });
    this.setState({
      hideLoader: true,
      hideCsvItem: false,
    });
  };

  generateProxy = () => {
    if (this.state.clickCount >= config.CLICK_LIMIT) {
      this.setState({ isDisabled: true });
      toastNotifications.addDanger('Click Max Number reached. Please retry in 1 mn ');
      return false;
    } else {
      this.setState({ clickCount: this.state.clickCount + 1 });
      this.generateCsv();
    }
    setTimeout(() => {
      this.setState({ isDisabled: false, clickCount: 0 });
    }, 60000);
  };

  generateCsv = () => {
    const { httpClient } = this.props;
    if (this.state.selectedOptions.length === 0) {
      toastNotifications.addDanger('Please select a saved search !');
      throw new Error('Please select a saved search !');
    }
    const savedSearchId = this.state.selectedOptions[0].id;
    const start         = this.state.start;
    const end           = this.state.end;
    const startMoment   = dateMath.parse(start);
    if (!startMoment || !startMoment.isValid()) {
      toastNotifications.addDanger('Unable to get the start Date');
      throw new Error('Unable to parse start string');
    }
    const endMoment = dateMath.parse(end);
    if (!endMoment || !endMoment.isValid()) {
      toastNotifications.addDanger('Unable to get the end Date');
      throw new Error('Unable to parse end string');
    }

    if (startMoment > endMoment) {
      this.setState({
        isDisabled: true,
      });
      toastNotifications.addDanger('Wrong Date Selection');
      throw new Error('Unable to parse end string');
    }
    const restapiinfo = JSON.parse(sessionStorage.getItem('restapiinfo'));
    let username = 'Guest';
    if(restapiinfo){
      username = restapiinfo.user_name;
    }
    const url = '../api/reporting/generateCsv/' + savedSearchId + '/' + startMoment + '/' + endMoment + '/' + username;
    httpClient.get(url);
    setTimeout(() => {
      this.getRecentCsv();
    }, 1000);

  };
  componentDidMount() {
    this.setup();
    const restapiinfo = JSON.parse(sessionStorage.getItem('restapiinfo'));
    const lastSubUrl = JSON.parse(localStorage.getItem('kibana.timepicker.timeHistory'));

    if (lastSubUrl) {
      this.setState({
        start: lastSubUrl[0].from,
        end: lastSubUrl[0].to,
      });
    }
    const backendroles    = restapiinfo.user;
    const requiredBackend = this.props.reportingService.get();
    if(requiredBackend){
      if (!backendroles.includes(requiredBackend)) {
        this.setState({
          authorization: true,
        });
      }
    }
    this.getSavedSearch();
  }

  render() {
    const { httpClient } = this.props;
    if (this.state.authorization) {
      return (
        <EuiPage>
          <Error />
        </EuiPage>
      );
    } else {
      return (
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiTitle>
                  <h2>
                    <FormattedMessage
                      id="csvGenerator.defaultMessage"
                      defaultMessage={this.props.title}
                      values={this.props.title}
                    />
                  </h2>
                </EuiTitle>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                <EuiFlexGroup style={{ padding: '0px 5px' }}>
                  <EuiComboBox
                    placeholder="Select a Saved Search"
                    singleSelection={{ asPlainText: true }}
                    options={this.state.options}
                    selectedOptions={this.state.selectedOptions}
                    onChange={this.onSelectChange}
                    isClearable={true}
                  />
                  <EuiSuperDatePicker
                    isLoading={this.state.isLoading}
                    start={this.state.start}
                    end={this.state.end}
                    onTimeChange={this.onTimeChange}
                    onRefresh={this.onRefresh}
                    isPaused={this.state.isPaused}
                    refreshInterval={this.state.refreshInterval}
                    onRefreshChange={this.onRefreshChange}
                    showUpdateButton={false}
                    style={{ margingTop: '50px' }}
                  />
                  <EuiButton
                    isLoading={this.state.buttonIsLoading}
                    isDisabled={this.state.isDisabled}
                    fill
                    onClick={this.generateProxy}
                  >
                    Generate
                  </EuiButton>
                </EuiFlexGroup>
                <EuiSpacer size="l" />
                <EuiSpacer size="xl" />
                {this.state.hideLoader ? null : <EuiLoadingContent lines={10} />}
                {this.state.hideCsvItem ? null : (
                  <CsvItem
                    title="List of Generated Reports"
                    items={this.state.recentCsv}
                    refresh={this.refreshRecentCsv}
                    refreshButtonIsDisabled={this.state.refreshButtonIsDisabled}
                    refreshButtonIsLoading={this.state.refreshButtonIsLoading}
                    httpClient={httpClient}
                  />
                )}
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    }
  }
}
