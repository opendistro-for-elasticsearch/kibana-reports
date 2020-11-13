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

import {
  getDashboardBaseUrlCreate,
  getDashboardOptions,
  getSavedSearchBaseUrlCreate,
  getSavedSearchOptions,
  getVisualizationBaseUrlCreate,
  getVisualizationOptions,
  handleDataToVisualReportSourceChange,
  parseInContextUrl,
} from '../report_settings_helpers';

const TEST_DEFINITION_ID = '12345';

describe('report_settings_helpers tests', () => {
  test('parseInContextUrl', () => {
    const urlString =
      'http://localhost:5601/app/opendistro_kibana_reports#/create?previous=dashboard:7adfa750-4c81-11e8-b3d7-01146121b73d?timeFrom=2020-10-26T20:52:56.382Z?timeTo=2020-10-27T20:52:56.384Z';

    const id = parseInContextUrl(urlString, 'id');
    expect(id).toBe('7adfa750-4c81-11e8-b3d7-01146121b73d');

    const timeFrom = parseInContextUrl(urlString, 'timeFrom');
    expect(timeFrom).toBe('2020-10-26T20:52:56.382Z');

    const timeTo = parseInContextUrl(urlString, 'timeTo');
    expect(timeTo).toBe('2020-10-27T20:52:56.384Z');

    const error = parseInContextUrl(urlString, 'invalid');
    expect(error).toBe('error: invalid parameter');
  });

  test('getDashboardBaseUrlCreate', () => {
    const baseUrl = getDashboardBaseUrlCreate(true, TEST_DEFINITION_ID, true);
    expect(baseUrl).toBe('/app/dashboards#/view/');

    const baseUrlNotFromEdit = getDashboardBaseUrlCreate(
      false,
      TEST_DEFINITION_ID,
      true
    );
    expect(baseUrlNotFromEdit).toBe('/app/dashboards#/view/');
  });

  test('getVisualizationBaseUrlCreate', () => {
    const baseUrl = getVisualizationBaseUrlCreate(
      true,
      TEST_DEFINITION_ID,
      true
    );
    expect(baseUrl).toBe('/app/visualize#/edit/');

    const baseUrlNotFromEdit = getVisualizationBaseUrlCreate(
      false,
      TEST_DEFINITION_ID,
      true
    );
    expect(baseUrlNotFromEdit).toBe('/app/visualize#/edit/');
  });

  test('getSavedSearchBaseUrlCreate', () => {
    const baseUrl = getSavedSearchBaseUrlCreate(true, TEST_DEFINITION_ID, true);
    expect(baseUrl).toBe('/app/discover#/view/');

    const baseUrlNotFromEdit = getSavedSearchBaseUrlCreate(
      false,
      TEST_DEFINITION_ID,
      true
    );
    expect(baseUrlNotFromEdit).toBe('/app/discover#/view/');
  });

  test('getDashboardOptions', () => {
    const mockData = [
      {
        _id: 'dashboard:1234567890abcdefghijk',
        _source: {
          dashboard: {
            title: 'Mock dashboard title',
          },
        },
      },
    ];

    const options = getDashboardOptions(mockData);
    expect(options[0].value).toBe('1234567890abcdefghijk');
    expect(options[0].text).toBe('Mock dashboard title');
  });

  test('getVisualizationOptions', () => {
    const mockData = [
      {
        _id: 'visualization:1234567890abcdefghijk',
        _source: {
          visualization: {
            title: 'Mock visualization title',
          },
        },
      },
    ];

    const options = getVisualizationOptions(mockData);
    expect(options[0].value).toBe('1234567890abcdefghijk');
    expect(options[0].text).toBe('Mock visualization title');
  });

  test('getSavedSearchOptions', () => {
    const mockData = [
      {
        _id: 'search:1234567890abcdefghijk',
        _source: {
          search: {
            title: 'Mock saved search title',
          },
        },
      },
    ];
    const options = getSavedSearchOptions(mockData);
    expect(options[0].value).toBe('1234567890abcdefghijk');
    expect(options[0].text).toBe('Mock saved search title');
  });

  test('handleDataToVisualReportSourceChange', () => {
    let reportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          report_format: '',
          saved_search_id: '',
          limit: 10,
          excel: true,
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {},
      },
    };

    handleDataToVisualReportSourceChange(reportDefinitionRequest);
    expect(
      reportDefinitionRequest.report_params.core_params.report_format
    ).toBe('pdf');
    expect(reportDefinitionRequest.report_params.core_params).toMatchObject({
      report_format: 'pdf',
    });
  });
});
