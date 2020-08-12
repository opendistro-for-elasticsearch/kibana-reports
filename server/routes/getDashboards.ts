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
  IRouter,
  IKibanaResponse,
  ResponseError,
} from '../../../../src/core/server';
import { API_PREFIX } from '../../common';

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

export default function (router: IRouter) {
  router.get(
    {
      path: `${API_PREFIX}/getDashboards`,
      validate: {},
    },
    async (
      context,
      request,
      response
    ): Promise<IKibanaResponse<any | ResponseError>> => {
      let dashboards = await getDashboards();
      return response.ok({
        body: dashboards,
      });
    }
  );
}

async function getDashboards() {
  const result = await client.search({
    index: '.kibana',
    body: {
      query: {
        match: {
          type: 'dashboard',
        },
      },
    },
  });

  client.search(
    {
      index: '.kibana',
      body: {
        query: {
          match: {
            type: 'dashboard',
          },
        },
      },
    },
    (err, result) => {
      if (err) console.log(err);
    }
  );

  return result['body'];
}
