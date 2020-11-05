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

import { ES_REPORTS_API } from '../../common';

export default function (Client: any, config: any, components: any) {
  const clientAction = components.clientAction.factory;

  Client.prototype.es_reports = components.clientAction.namespaceFactory();
  const esReports = Client.prototype.es_reports.prototype;

  esReports.createReport = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.ON_DEMAND_REPORT}`,
    },
    method: 'PUT',
    needBody: true,
  });

  esReports.updateReportInstanceStatus = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_INSTANCE}?id=<%=reportId%>`,
      req: {
        reportId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'POST',
    needBody: true,
  });

  esReports.getReportById = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_INSTANCE}?id=<%=reportId%>`,
      req: {
        reportId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'GET',
  });

  esReports.getReports = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.LIST_REPORT_INSTANCES}`,
      //TODO: wrong format error thrown even required = false, need to figure it out the correct setting to make it truly optional
      // req: {
      //   fromIndex: {
      //     type: 'string',
      //     required: false,
      //   },
      // },
    },
    method: 'GET',
  });

  // scheduler.createSchedule = clientAction({
  //   url: {
  //     fmt: `${REPORTS_SCHEDULER_API.SCHEDULE_BASE}?job_id=<%=jobId%>`,
  //     req: {
  //       jobId: {
  //         type: 'string',
  //         required: true,
  //       },
  //     },
  //   },
  //   method: 'POST',
  //   needBody: true,
  // });

  // scheduler.deleteSchedule = clientAction({
  //   url: {
  //     fmt: `${REPORTS_SCHEDULER_API.SCHEDULE_BASE}?job_id=<%=jobId%>`,
  //     req: {
  //       jobId: {
  //         type: 'string',
  //         required: true,
  //       },
  //     },
  //   },
  //   method: 'DELETE',
  // });

  // scheduler.getJob = clientAction({
  //   url: {
  //     fmt: `${REPORTS_SCHEDULER_API.JOB_BASE}`,
  //   },
  //   method: 'GET',
  // });

  // scheduler.updateJobStatus = clientAction({
  //   url: {
  //     fmt: `${REPORTS_SCHEDULER_API.JOB_BASE}/<%=jobId%>`,
  //     req: {
  //       jobId: {
  //         type: 'string',
  //         required: true,
  //       },
  //     },
  //   },
  //   method: 'POST',
  // });
}
