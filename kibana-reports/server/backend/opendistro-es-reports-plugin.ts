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

  /**
   * report related APIs
   */
  esReports.createReport = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.ON_DEMAND_REPORT}`,
    },
    method: 'PUT',
    needBody: true,
  });

  esReports.createReportFromDefinition = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.ON_DEMAND_REPORT}/<%=reportDefinitionId%>`,
      req: {
        reportDefinitionId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'POST',
    needBody: true,
  });

  esReports.updateReportInstanceStatus = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_INSTANCE}/<%=reportInstanceId%>`,
      req: {
        reportInstanceId: {
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
      fmt: `${ES_REPORTS_API.REPORT_INSTANCE}/<%=reportInstanceId%>`,
      req: {
        reportInstanceId: {
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
      params: {
        fromIndex: {
          type: 'number',
        },
        maxItems: {
          type: 'number',
        },
      },
    },
    method: 'GET',
  });

  /**
   * report definition related APIs
   */
  esReports.createReportDefinition = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_DEFINITION}`,
    },
    method: 'POST',
    needBody: true,
  });

  esReports.updateReportDefinitionById = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_DEFINITION}/<%=reportDefinitionId%>`,
      req: {
        reportDefinitionId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'PUT',
    needBody: true,
  });

  esReports.getReportDefinitionById = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_DEFINITION}/<%=reportDefinitionId%>`,
      req: {
        reportDefinitionId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'GET',
  });

  esReports.getReportDefinitions = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.LIST_REPORT_DEFINITIONS}`,
      params: {
        fromIndex: {
          type: 'number',
        },
        maxItems: {
          type: 'number',
        },
      },
    },
    method: 'GET',
  });

  esReports.deleteReportDefinitionById = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.REPORT_DEFINITION}/<%=reportDefinitionId%>`,
      req: {
        reportDefinitionId: {
          type: 'string',
          required: true,
        },
      },
    },
    method: 'DELETE',
  });

  /**
   * Poller API
   */
  esReports.pollReportInstance = clientAction({
    url: {
      fmt: `${ES_REPORTS_API.POLL_REPORT_INSTANCE}`,
    },
    method: 'GET',
  });
}
