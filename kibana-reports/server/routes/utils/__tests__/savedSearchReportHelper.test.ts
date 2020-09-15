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
import { createSavedSearchReport } from '../../savedSearchReportHelper';

/**
 * The mock and sample input for saved search export function.
 */
const input = {
  report_name: 'Test',
  report_source: 'Saved search',
  report_type: 'Download',
  description: 'Hi this is your saved search',
  report_params: {
    saved_search_id: 'ddd8f430-f2ef-11ea-8c86-81a0b21b4b67',
    start: '1343576635300',
    end: '1596037435301',
    report_format: 'csv',
  },
};

/**
 * Max result window size in ES index settings.
 */
const maxResultSize = 5;

describe('test create saved search report', () => {
  test('create report by single search', async () => {
    const hits = [
      hit({ category: 'c1', customer_gender: 'Male' }),
      hit({ category: 'c2', customer_gender: 'Male' }),
      hit({ category: 'c3', customer_gender: 'Male' }),
      hit({ category: 'c4', customer_gender: 'Male' }),
      hit({ category: 'c5', customer_gender: 'Male' }),
    ];
    const client = mockEsClient(hits);
    const { timeCreated, dataUrl, fileName } = await createSavedSearchReport(
      input,
      client
    );

    expect(fileName).toContain(`${input.report_name}_${timeCreated}`);
    expect(fileName).toContain(`.${input.report_params.report_format}`);
    expect(dataUrl).toEqual(
      '0.category,0.customer_gender,' +
        '1.category,1.customer_gender,' +
        '2.category,2.customer_gender,' +
        '3.category,3.customer_gender,' +
        '4.category,4.customer_gender\n' +
        'c1,Male,c2,Male,c3,Male,c4,Male,c5,Male'
    );
  }, 20000);

  test('create report by scroll', async () => {
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
    const { timeCreated, dataUrl, fileName } = await createSavedSearchReport(
      input,
      client
    );

    expect(fileName).toContain(`${input.report_name}_${timeCreated}`);
    expect(fileName).toContain(`.${input.report_params.report_format}`);
    expect(dataUrl).toEqual(
      '0.category,0.customer_gender,' +
        '1.category,1.customer_gender,' +
        '2.category,2.customer_gender,' +
        '3.category,3.customer_gender,' +
        '4.category,4.customer_gender,' +
        '5.category,5.customer_gender,' +
        '6.category,6.customer_gender,' +
        '7.category,7.customer_gender,' +
        '8.category,8.customer_gender,' +
        '9.category,9.customer_gender,' +
        '10.category,10.customer_gender\n' +
        'c1,Male,c2,Male,c3,Male,c4,Male,c5,Male,' +
        'c6,Female,c7,Female,c8,Female,c9,Female,c10,Female,' +
        'c11,Male'
    );
  }, 20000);
});

/**
 * Mock Elasticsearch client and return different mock objects based on endpoint and parameters.
 */
function mockEsClient(mockHits: Array<{ _source: any }>) {
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
              : mockSavedSearch(),
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
              hits: mockHits.slice(0, maxResultSize),
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
 * Mock a saved search for kibana_sample_data_ecommerce with 2 selected fields: category and customer_gender.
 */
function mockSavedSearch() {
  return JSON.parse(`
  {
    "type": "search",
    "id": "ddd8f430-f2ef-11ea-8c86-81a0b21b4b67",
    "search": {
      "title": "Show category and gender",
      "description": "",
      "hits": 0,
      "columns": [
        "category",
        "customer_gender"
      ],
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
