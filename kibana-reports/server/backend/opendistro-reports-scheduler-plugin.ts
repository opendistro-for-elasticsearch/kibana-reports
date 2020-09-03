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

import { REPORTS_SCHEDULER_API } from '../../common';

export default function (Client: any, config: any, components: any) {
  const clientAction = components.clientAction.factory;

  Client.prototype.reports_scheduler = components.clientAction.namespaceFactory();
  const scheduler = Client.prototype.reports_scheduler.prototype;

  scheduler.createSchedule = clientAction({
    url: {
      fmt: `${REPORTS_SCHEDULER_API.SCHEDULE_BASE}?job_id=<%=jobId%>`,
      req: {
        jobId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'POST',
    needBody: true,
  });

  scheduler.deleteSchedule = clientAction({
    url: {
      fmt: `${REPORTS_SCHEDULER_API.SCHEDULE_BASE}?job_id=<%=jobId%>`,
      req: {
        jobId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'DELETE',
  });

  scheduler.getJob = clientAction({
    url: {
      fmt: `${REPORTS_SCHEDULER_API.JOB_BASE}`,
    },
    method: 'GET',
  });

  scheduler.updateJobStatus = clientAction({
    url: {
      fmt: `${REPORTS_SCHEDULER_API.JOB_BASE}/<%=jobId%>`,
      req: {
        jobId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'POST',
  });
}
