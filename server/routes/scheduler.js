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

const response_code = {
  status: "success",
  code: 200,
  message: "Schedule created successfully"
}

export default function (server) {
    server.route({
      path: '/api/reporting/schedule',
      method: 'POST',
      async handler(response) {
        try {
            await schedule_job()
          }
          catch (e) {
            console.log(e)
        }
        return response_code
      }
    });
}

async function schedule_job() {

}
