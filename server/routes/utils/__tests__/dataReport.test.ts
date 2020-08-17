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
const axios = require('axios');

describe('data report metadata tests suites', () => {
  test('test to generate data report meta data successfully', async () => {
    expect.assertions(5);
    const url = '/api/reporting/data-report/metadata';
    const input = {
      saved_search_id: '571aaf70-4c88-11e8-b3d7-01146121b73d',
      start: '1343576635300',
      end: '1596037435301',
      report_format: 'csv',
    };
    let response: any = {};
    const report = await axios({
      method: 'POST',
      proxy: { host: '127.0.0.1', port: 5601 },
      url,
      headers: { 'kbn-xsrf': 'reporting' },
      data: input,
    }).then((res) => {
      response = res.data;
    });
    const {
      saved_search_id,
      report_format,
      start,
      end,
      paternName,
    } = response.metaData;
    expect(saved_search_id).toEqual(input.saved_search_id);
    expect(paternName).toEqual('kibana_sample_data_flights');
    expect(start).toEqual(input.start);
    expect(end).toEqual(input.end);
    expect(report_format).toEqual('csv');
  }, 20000);

  test("test to generate data report meta data Report doesn't exist", async () => {
    expect.assertions(1);
    const url = '/api/reporting/data-report/metadata';
    const input = {
      saved_search_id: '571aaf70-4c88-11e8-b3d7-01146121b73d0',
      start: '1343576635300',
      end: '1596037435301',
      report_format: 'csv',
    };
    let response: any = {};
    let message: string = '';
    const report = await axios({
      method: 'POST',
      proxy: { host: '127.0.0.1', port: 5601 },
      url,
      headers: { 'kbn-xsrf': 'reporting' },
      data: input,
    })
      .then((res) => {
        response = res.data;
      })
      .catch((error) => {
        message = error.response.data.message;
      });
    expect(message).toEqual("Saved Search doesn't exist !");
  }, 20000);
});

describe('data report data generation tests suites', () => {
  describe('test for Case 1 No args ', () => {
    test('esCount > default_fetch_size  => default_fetch_size', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;

      expect(datasetCount).toEqual(input.default_max_size);
    }, 20000);

    test('esCount < default_fetch_size => esCount ', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'LNf9-3MBBSuiES58df_j',
        esCount: 818,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;
      expect(datasetCount).toEqual(input.esCount);
    }, 20000);
  });

  describe('test for Case 2: arg => nbRows ', () => {
    test('nbRows == esCount => esCount', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 111396,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
        },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;

      expect(datasetCount).toEqual(input.esCount);
    }, 20000);

    test('nbRows > esCount  < default_max_size => esCount', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 200000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
        },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;

      expect(datasetCount).toEqual(input.esCount);
    }, 20000);

    test('nbRows > esCount > default_max_size => default_max_size', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 200000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
        },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;

      expect(datasetCount).toEqual(input.esCount);
    }, 20000);

    test('nbRows > default_max_size && nbRows < esCount => nbRows ', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 30000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
        },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;

      expect(datasetCount).toEqual(input.nbRows);
    }, 20000);

    test('nbRows < default_max_size => nbRows', async () => {
      expect.assertions(1);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 5000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
        },
      }).then((res) => {
        response = res.data;
      });
      const { datasetCount } = response;

      expect(datasetCount).toEqual(input.nbRows);
    }, 20000);
  });

  describe('test for Case 2: arg => scroll_size ', () => {
    test('esCount > default_max_size &&  scroll_size > default_max_size => esCount', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        scroll_size: 200000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });
      let scrolls = Math.floor(input.esCount / input.default_max_size);
      const { datasetCount, nbScroll } = response;
      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('esCount > default_max_size &&  scroll_size < default_max_size ', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        scroll_size: 8000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });
      let scrolls = Math.floor(input.esCount / input.scroll_size);
      const { datasetCount, nbScroll } = response;
      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('esCount < default_max_size  ', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'LNf9-3MBBSuiES58df_j',
        scroll_size: 200000,
        esCount: 818,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });
      let scrolls = 0;
      const { datasetCount, nbScroll } = response;
      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);
  });

  describe('test for Case 3: args => nbRows && scroll_size  ', () => {
    test('nbRows > esCount  > default_max_size  &&  scroll_size < default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 200000,
        scroll_size: 200,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });
      let scrolls = Math.floor(input.esCount / input.scroll_size);
      const { datasetCount, nbScroll } = response;
      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('nbRows > esCount > default_max_size  &&  scroll_size > default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 200000,
        scroll_size: 12000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = Math.floor(input.esCount / input.default_max_size);
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('nbRows > esCount < default_max_size  &&  scroll_size > default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'LNf9-3MBBSuiES58df_j',
        nbRows: 200000,
        scroll_size: 18000,
        esCount: 818,
        default_max_size: 10000,
      };

      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = 0;
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('nbRows > esCount < default_max_size  &&  scroll_size < default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'LNf9-3MBBSuiES58df_j',
        nbRows: 200000,
        scroll_size: 8000,
        esCount: 818,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = 0;
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.esCount);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('esCount > nbRows < default_max_size  &&  scroll_size > default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 5000,
        scroll_size: 28000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = 0;
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.nbRows);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('esCount > nbRows < default_max_size  &&  scroll_size < default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 5000,
        scroll_size: 8000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = 0;
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.nbRows);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('esCount > nbRows > default_max_size  &&  scroll_size > default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 20000,
        scroll_size: 18000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = Math.floor(input.nbRows / input.default_max_size);
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.nbRows);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);

    test('esCount > nbRows > default_max_size  &&  scroll_size < default_max_size', async () => {
      expect.assertions(2);
      const input = {
        reportId: 'ldfN-3MBBSuiES58RP5j',
        nbRows: 15000,
        scroll_size: 7000,
        esCount: 111396,
        default_max_size: 10000,
      };
      let url = '/api/reporting/data-report/generate/' + input.reportId;
      let response: any = {};
      const data = await axios({
        method: 'GET',
        proxy: { host: '127.0.0.1', port: 5601 },
        url,
        headers: { 'kbn-xsrf': 'reporting' },
        params: {
          nbRows: input.nbRows,
          scroll_size: input.scroll_size,
        },
      }).then((res) => {
        response = res.data;
      });

      let scrolls = Math.floor(input.nbRows / input.scroll_size);
      const { datasetCount, nbScroll } = response;

      expect(datasetCount).toEqual(input.nbRows);
      expect(nbScroll).toEqual(scrolls);
    }, 20000);
  });
});
