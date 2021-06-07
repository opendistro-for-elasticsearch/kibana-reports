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

import 'regenerator-runtime/runtime';
import { createSavedSearchReport } from '../savedSearchReportHelper';
import { reportSchema } from '../../../model';

/**
 * The mock and sample input for saved search export function.
 */
const input = {
  query_url: '/app/discover#/view/7adfa750-4c81-11e8-b3d7-01146121b73d',
  time_from: 1343576635300,
  time_to: 1596037435301,
  report_definition: {
    report_params: {
      report_name: 'test report table order',
      report_source: 'Saved search',
      description: 'Hi this is your saved search on demand',
      core_params: {
        base_url: '/app/discover#/view/7adfa750-4c81-11e8-b3d7-01146121b73d',
        saved_search_id: 'ddd8f430-f2ef-11ea-8c86-81a0b21b4b67',
        report_format: 'csv',
        time_duration: 'PT5M',
        limit: 10000,
        excel: true,
        origin: 'http://localhost:5601',
      },
    },
    delivery: {
      delivery_type: 'Kibana user',
      delivery_params: {
        kibana_recipients: [],
      },
    },
    trigger: {
      trigger_type: 'On demand',
    },
  },
};

/**
 * Max result window size in ES index settings.
 */
const maxResultSize = 5;

describe('test create saved search report', () => {
  test('create report with valid input', async () => {
    // Check if the assumption of input is up-to-date
    reportSchema.validate(input);
  }, 20000);

  test('create report with expected file name', async () => {
    const hits: Array<{ _source: any }> = [];
    const client = mockEsClient(hits);
    const { timeCreated, fileName } = await createSavedSearchReport(
      input,
      client
    );
    expect(fileName).toContain(`test report table order_`);
  }, 20000);

  test('create report with expected file name extension', async () => {
    const csvReport = await createSavedSearchReport(input, mockEsClient([]));
    expect(csvReport.fileName).toContain('.csv');

    input.report_definition.report_params.core_params.report_format = 'xlsx';
    const xlsxReport = await createSavedSearchReport(input, mockEsClient([]));
    expect(xlsxReport.fileName).toContain('.xlsx');
  }, 20000);

  test('create report for empty data set', async () => {
    const hits: Array<{ _source: any }> = [];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);
    expect(dataUrl).toEqual('');
  }, 20000);

  test('create report for small data set by single search', async () => {
    const hits = [
      hit({ category: 'c1', customer_gender: 'Male' }),
      hit({ category: 'c2', customer_gender: 'Male' }),
      hit({ category: 'c3', customer_gender: 'Male' }),
      hit({ category: 'c4', customer_gender: 'Male' }),
      hit({ category: 'c5', customer_gender: 'Male' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        'c1,Male\n' +
        'c2,Male\n' +
        'c3,Male\n' +
        'c4,Male\n' +
        'c5,Male'
    );
  }, 20000);

  test('create report for large data set by scroll', async () => {
    const hits = [
      hit({ category: 'c1', customer_gender: 'Male' }),
      hit({ category: 'c2', customer_gender: 'Male' }),
      hit({ category: 'c3', customer_gender: 'Male' }),
      hit({ category: 'c4', customer_gender: 'Male' }),
      hit({ category: 'c5', customer_gender: 'Male' }),
      hit({ category: 'c6', customer_gender: 'Female' }),
      hit({ category: 'c7', customer_gender: 'Female' }),
      hit({ category: 'c8', customer_gender: 'Female' }),
      hit({ category: 'c9', customer_gender: 'Female' }),
      hit({ category: 'c10', customer_gender: 'Female' }),
      hit({ category: 'c11', customer_gender: 'Male' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        'c1,Male\n' +
        'c2,Male\n' +
        'c3,Male\n' +
        'c4,Male\n' +
        'c5,Male\n' +
        'c6,Female\n' +
        'c7,Female\n' +
        'c8,Female\n' +
        'c9,Female\n' +
        'c10,Female\n' +
        'c11,Male'
    );
  }, 20000);

  test('create report with limit smaller than max result size', async () => {
    // Assign a smaller limit than default to test
    input.report_definition.report_params.core_params.limit = 1;

    const hits = [
      hit({ category: 'c1', customer_gender: 'Male' }),
      hit({ category: 'c2', customer_gender: 'Male' }),
      hit({ category: 'c3', customer_gender: 'Male' }),
      hit({ category: 'c4', customer_gender: 'Male' }),
      hit({ category: 'c5', customer_gender: 'Male' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual('category,customer_gender\n' + 'c1,Male');
  }, 20000);

  test('create report with limit greater than max result size', async () => {
    // Assign a limit just a little greater than max result size (5)
    input.report_definition.report_params.core_params.limit = 6;

    const hits = [
      hit({ category: 'c1', customer_gender: 'Male' }),
      hit({ category: 'c2', customer_gender: 'Male' }),
      hit({ category: 'c3', customer_gender: 'Male' }),
      hit({ category: 'c4', customer_gender: 'Male' }),
      hit({ category: 'c5', customer_gender: 'Male' }),
      hit({ category: 'c6', customer_gender: 'Female' }),
      hit({ category: 'c7', customer_gender: 'Female' }),
      hit({ category: 'c8', customer_gender: 'Female' }),
      hit({ category: 'c9', customer_gender: 'Female' }),
      hit({ category: 'c10', customer_gender: 'Female' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        'c1,Male\n' +
        'c2,Male\n' +
        'c3,Male\n' +
        'c4,Male\n' +
        'c5,Male\n' +
        'c6,Female'
    );
  }, 20000);

  test('create report with limit greater than total result size', async () => {
    // Assign a limit even greater than the result size
    input.report_definition.report_params.core_params.limit = 10;

    const hits = [
      hit({ category: 'c1', customer_gender: 'Male' }),
      hit({ category: 'c2', customer_gender: 'Male' }),
      hit({ category: 'c3', customer_gender: 'Male' }),
      hit({ category: 'c4', customer_gender: 'Male' }),
      hit({ category: 'c5', customer_gender: 'Male' }),
      hit({ category: 'c6', customer_gender: 'Female' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        'c1,Male\n' +
        'c2,Male\n' +
        'c3,Male\n' +
        'c4,Male\n' +
        'c5,Male\n' +
        'c6,Female'
    );
  }, 20000);

  test('create report for data set with comma', async () => {
    const hits = [
      hit({ category: ',c1', customer_gender: 'Ma,le' }),
      hit({ category: 'c2,', customer_gender: 'M,ale' }),
      hit({ category: ',,c3', customer_gender: 'Male,,,' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        '",c1","Ma,le"\n' +
        '"c2,","M,ale"\n' +
        '",,c3","Male,,,"'
    );
  }, 20000);

  test('create report for data set with nested fields', async () => {
    const hits = [
      hit({
        'geoip.country_iso_code': 'GB',
        'geoip.location': { lon: -0.1, lat: 51.5 },
      }),
      hit({
        'geoip.country_iso_code': 'US',
        'geoip.city_name': 'New York',
        'geoip.location': { lon: -74, lat: 40.8 },
      }),
    ];
    const client = mockEsClient(
      hits,
      '"geoip.country_iso_code", "geoip.city_name", "geoip.location"'
    );
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'geoip.country_iso_code,geoip.location.lon,geoip.location.lat,geoip.city_name\n' +
        'GB,-0.1,51.5, \n' +
        'US,-74,40.8,New York'
    );
  }, 20000);

  test('create report by sanitizing data set for Excel', async () => {
    const hits = [
      hit({ category: 'c1', customer_gender: '=Male' }),
      hit({ category: 'c2', customer_gender: 'Male=' }),
      hit({ category: 'c3', customer_gender: '+Ma,le' }),
      hit({ category: ',-c4', customer_gender: 'Male' }),
      hit({ category: ',,,@c5', customer_gender: 'Male' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        `c1,'=Male\n` +
        `c2,Male=\n` +
        `c3,"'+Ma,le"\n` +
        `",-c4",Male\n` +
        `",,,@c5",Male`
    );
  }, 20000);

  test('create report by not sanitizing data set for Excel', async () => {
    // Enable Excel escape option
    input.report_definition.report_params.core_params.excel = false;

    const hits = [
      hit({ category: 'c1', customer_gender: '=Male' }),
      hit({ category: 'c2', customer_gender: 'Male=' }),
      hit({ category: 'c3', customer_gender: '+Ma,le' }),
      hit({ category: ',-c4', customer_gender: 'Male' }),
      hit({ category: ',,,@c5', customer_gender: 'Male' }),
    ];
    const client = mockEsClient(hits);
    const { dataUrl } = await createSavedSearchReport(input, client);

    expect(dataUrl).toEqual(
      'category,customer_gender\n' +
        'c1,=Male\n' +
        'c2,Male=\n' +
        'c3,"+Ma,le"\n' +
        '",-c4",Male\n' +
        '",,,@c5",Male'
    );
  }, 20000);
});

test('create report for data set contains null field value', async () => {
  const hits = [
    hit({ category: 'c1', customer_gender: 'Ma' }),
    hit({ category: 'c2', customer_gender: 'le' }),
    hit({ category: 'c3', customer_gender: null }),
  ];
  const client = mockEsClient(hits);
  const { dataUrl } = await createSavedSearchReport(input, client);

  expect(dataUrl).toEqual(
    'category,customer_gender\n' + 'c1,Ma\n' + 'c2,le\n' + 'c3, '
  );
}, 20000);

/**
 * Mock Elasticsearch client and return different mock objects based on endpoint and parameters.
 */
function mockEsClient(
  mockHits: Array<{ _source: any }>,
  columns = '"category", "customer_gender"'
) {
  let call = 0;
  const client = jest.fn();
  client.callAsInternalUser = jest
    .fn()
    .mockImplementation((endpoint: string, params: any) => {
      switch (endpoint) {
        case 'get':
          return {
            _source: params.id.startsWith('index-pattern:')
              ? mockIndexPattern()
              : mockSavedSearch(columns),
          };
        case 'indices.getSettings':
          return mockIndexSettings();
        case 'count':
          return {
            count: mockHits.length,
          };
        case 'search':
          return {
            hits: {
              hits: mockHits.slice(0, params.size),
            },
          };
        case 'scroll':
          call++;
          return {
            hits: {
              hits: mockHits.slice(
                maxResultSize * call,
                maxResultSize * (call + 1)
              ),
            },
          };
        case 'clearScroll':
          return null;
        default:
          fail('Fail due to unexpected function call on client', endpoint);
      }
    });
  return client;
}

/**
 * Mock a saved search for kibana_sample_data_ecommerce with 2 default selected fields: category and customer_gender.
 */
function mockSavedSearch(columns = '"category", "customer_gender"') {
  return JSON.parse(`
  {
    "type": "search",
    "id": "ddd8f430-f2ef-11ea-8c86-81a0b21b4b67",
    "search": {
      "title": "Show category and gender",
      "description": "",
      "hits": 0,
      "columns": [ ${columns} ],
      "sort": [],
      "version": 1,
      "kibanaSavedObjectMeta": {
        "searchSourceJSON": "{\\"highlightAll\\":true,\\"version\\":true,\\"query\\":{\\"query\\":\\"\\",\\"language\\":\\"kuery\\"},\\"indexRefName\\":\\"kibanaSavedObjectMeta.searchSourceJSON.index\\",\\"filter\\":[]}"
      }
    },
    "references": [
      {
        "name": "kibanaSavedObjectMeta.searchSourceJSON.index",
        "type": "index-pattern",
        "id": "ff959d40-b880-11e8-a6d9-e546fe2bba5f"
      }
    ]
  }
  `);
}

/**
 * Mock index pattern for kibana_sample_data_ecommerce.
 */
function mockIndexPattern() {
  return JSON.parse(`
  {
    "index-pattern": {
      "title": "kibana_sample_data_ecommerce",
      "timeFieldName": "order_date",
      "fields": "[{\\"name\\":\\"_id\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"_id\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":false},{\\"name\\":\\"_index\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"_index\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":false},{\\"name\\":\\"_score\\",\\"type\\":\\"number\\",\\"count\\":0,\\"scripted\\":false,\\"searchable\\":false,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"_source\\",\\"type\\":\\"_source\\",\\"esTypes\\":[\\"_source\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":false,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"_type\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"_type\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":false},{\\"name\\":\\"category\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":2,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"category.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"category\\"}}},{\\"name\\":\\"currency\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"customer_birth_date\\",\\"type\\":\\"date\\",\\"esTypes\\":[\\"date\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"customer_first_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"customer_first_name.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"customer_first_name\\"}}},{\\"name\\":\\"customer_full_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"customer_full_name.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"customer_full_name\\"}}},{\\"name\\":\\"customer_gender\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":2,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"customer_id\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"customer_last_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"customer_last_name.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"customer_last_name\\"}}},{\\"name\\":\\"customer_phone\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"day_of_week\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"day_of_week_i\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"integer\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"email\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"geoip.city_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"geoip.continent_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"geoip.country_iso_code\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"geoip.location\\",\\"type\\":\\"geo_point\\",\\"esTypes\\":[\\"geo_point\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"geoip.region_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"manufacturer\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"manufacturer.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"manufacturer\\"}}},{\\"name\\":\\"order_date\\",\\"type\\":\\"date\\",\\"esTypes\\":[\\"date\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"order_id\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products._id\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"products._id.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"products._id\\"}}},{\\"name\\":\\"products.base_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.base_unit_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.category\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"products.category.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"products.category\\"}}},{\\"name\\":\\"products.created_on\\",\\"type\\":\\"date\\",\\"esTypes\\":[\\"date\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.discount_amount\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.discount_percentage\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.manufacturer\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"products.manufacturer.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"products.manufacturer\\"}}},{\\"name\\":\\"products.min_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.product_id\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"long\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.product_name\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"text\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":false,\\"readFromDocValues\\":false},{\\"name\\":\\"products.product_name.keyword\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true,\\"subType\\":{\\"multi\\":{\\"parent\\":\\"products.product_name\\"}}},{\\"name\\":\\"products.quantity\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"integer\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.sku\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.tax_amount\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.taxful_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.taxless_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"products.unit_discount_amount\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"sku\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"taxful_total_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"taxless_total_price\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"half_float\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"total_quantity\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"integer\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"total_unique_products\\",\\"type\\":\\"number\\",\\"esTypes\\":[\\"integer\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"type\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true},{\\"name\\":\\"user\\",\\"type\\":\\"string\\",\\"esTypes\\":[\\"keyword\\"],\\"count\\":0,\\"scripted\\":false,\\"searchable\\":true,\\"aggregatable\\":true,\\"readFromDocValues\\":true}]",
      "fieldFormatMap": "{\\"taxful_total_price\\":{\\"id\\":\\"number\\",\\"params\\":{\\"parsedUrl\\":{\\"origin\\":\\"http://localhost:5601\\",\\"pathname\\":\\"/app/kibana\\",\\"basePath\\":\\"\\"},\\"pattern\\":\\"$0,0.[00]\\"}}}"
    }
  }
  `);
}

/**
 * Mock index settings for kibana_sample_data_ecommerce.
 */
function mockIndexSettings() {
  return JSON.parse(`
  {
    "kibana_sample_data_ecommerce": {
      "settings": {
        "index": {
          "number_of_shards": "1",
          "auto_expand_replicas": "0-1",
          "provided_name": "kibana_sample_data_ecommerce",
          "max_result_window": "${maxResultSize}",
          "creation_date": "1594417718898",
          "number_of_replicas": "0",
          "uuid": "0KnfmEsaTYKg39ONcrA5Eg",
          "version": {
            "created": "7080099"
          }
        }
      }
    }
  }
  `);
}

function hit(kv: any) {
  return {
    _source: kv,
  };
}
