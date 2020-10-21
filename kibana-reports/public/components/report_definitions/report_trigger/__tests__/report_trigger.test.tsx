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
import { render } from '@testing-library/react';
import { ReportTrigger } from '../report_trigger';
import 'babel-polyfill';
import 'regenerator-runtime';
import httpClientMock from '../../../../../test/httpMockClient';
import { shallow } from 'enzyme';
import fetchMock from 'jest-fetch-mock';
import axios from 'axios';

var getFunction = async function() {
  let test = {
    report_params: {
      report_name: 'test create report definition trigger',
      report_source: 'Dashboard',
      description: '',
      core_params: {
        base_url: '',
        report_format: '',
        header: '',
        footer: '',
        time_duration: '',
      },
    },
    delivery: {
      delivery_type: '',
      delivery_params: {},
    },
    trigger: {
      trigger_type: 'Schedule',
      trigger_params: {
        schedule_type: 'Recurring',
        schedule: {
          interval: {
            period: 5,
            unit: 'HOURS',
            timezone: "PST8PDT"
          }
        },
        enabled_time: 1114939203,
        enabled: true
      }
    },
  }
  console.log("getFucntion was called");
  return test;
}

describe('<ReportTrigger /> panel', () => {

  const httpClientMockTrigger = jest.fn();
  // httpClientMockTrigger.get = httpClientMockTrigger.bind((getFunction()));
  httpClientMockTrigger.get = jest.fn(() => ({
    then: httpClientMockTrigger.bind(getFunction())
  }));

  // jest.mock("axios");


  test('render create component', () => {
    let createReportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {

        }
      },
    };

    jest.mock("axios");
    axios.get.mockResolvedValue(createReportDefinitionRequest);

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    const { container } = render(
      <ReportTrigger
        edit={false}
        reportDefinitionRequest={createReportDefinitionRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  // edit test
  test('render edit recurring 5 hours schedule component', () => {
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 5,
              unit: 'HOURS',
              timezone: "PST8PDT"
            }
          },
          enabled_time: 1114939203,
          enabled: true
        }
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    fetchMock.mockResponseOnce(JSON.stringify(editReportDefinitionRequest));
    // var test = ReportTrigger.defaultConfigurationEdit();
    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={"1"}
        reportDefinitionRequest={editReportDefinitionRequest}
        httpClientProps={httpClientMockTrigger}
        timeRange={timeRange}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  })

  test('render edit recurring daily schedule component', () => {
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 1,
              unit: 'DAYS',
              start_time: 1114939203
            }
          },
          enabled_time: 1114939203,
          enabled: true
        }
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={"1"}
        reportDefinitionRequest={editReportDefinitionRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('render edit Cron schedule component', () => {
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'edit cron schedule component',
        report_source: 'Visualization',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Cron',
          schedule: {
            cron: {
              expression: "30 11 * * *",
              timezone: "PDT"
            }
          },
          enabled_time: 1234567890,
          enabled: true
        }
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={"1"}
        reportDefinitionRequest={editReportDefinitionRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showTriggerIntervalNaNError={false}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('try testing individual component in trigger', () => {
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'edit cron schedule component',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'On demand',
        // trigger_params: {
        //   schedule_type: 'Cron',
        //   schedule: {
        //     cron: {
        //       expression: "30 11 * * *",
        //       timezone: "PDT"
        //     }
        //   },
        //   enabled_time: 1234567890,
        //   enabled: true
        // }
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={"1"}
        reportDefinitionRequest={editReportDefinitionRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  })
});
