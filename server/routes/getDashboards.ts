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

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
      console.log("in promise, going to call getDashboards")
      let dashboards = getDashboards();
      console.log("just assigned getDashboards retval to dashboards")
      console.log("dahsboards is", dashboards);
      return response.ok({
        body: dashboards
      });
    }
  )
}

  function getDashboards() {
    console.log("in getDashboards, about to call getJson()");
    var jsonBeforeParse = getJson();
    var jsonAfterParse = JSON.parse(jsonBeforeParse);
    return jsonAfterParse;
  }

  function getJson() {
    console.log("in getJson(), about to make request to .kibana to get dashboards");
      var url = "http://localhost:9200/.kibana/_search?q=type:dashboard";
      var HttpRequest = new XMLHttpRequest();
      HttpRequest.open("GET", url, false);
      HttpRequest.send(null);
      return HttpRequest.responseText; 
  }