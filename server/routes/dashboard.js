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

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export default function (server) {
    server.route({
      path: '/api/reporting/get_dashboards',
      method: 'GET',
      async handler() {
        try {
          var dashboards = getDashboards();
        }
        catch (e) {
          console.log(e);
        }
        return dashboards;
      }
    });
  }

  function getDashboards() {
    var jsonBeforeParse = getJson();
    var jsonAfterParse = JSON.parse(jsonBeforeParse);
    return jsonAfterParse;
  }

  function getJson() {
      var url = "http://localhost:9200/.kibana/_search?q=type:dashboard";
      var HttpRequest = new XMLHttpRequest();
      HttpRequest.open("GET", url, false);
      HttpRequest.send(null);
      return HttpRequest.responseText; 
  }