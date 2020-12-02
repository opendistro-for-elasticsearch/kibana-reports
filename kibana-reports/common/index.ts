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

export const PLUGIN_ID = 'opendistroReportsKibana';
export const PLUGIN_NAME = 'opendistro_kibana_reports';

export const API_PREFIX = '/api/reporting';

export const NOTIFICATION_API = {
  SEND: '/_opendistro/_notifications/send',
};

const BASE_REPORTS_URI = '/_opendistro/_reports';

export const ES_REPORTS_API = {
  ON_DEMAND_REPORT: `${BASE_REPORTS_URI}/on_demand`,
  REPORT_INSTANCE: `${BASE_REPORTS_URI}/instance`,
  LIST_REPORT_INSTANCES: `${BASE_REPORTS_URI}/instances`,
  REPORT_DEFINITION: `${BASE_REPORTS_URI}/definition`,
  LIST_REPORT_DEFINITIONS: `${BASE_REPORTS_URI}/definitions`,
  POLL_REPORT_INSTANCE: `${BASE_REPORTS_URI}/poll_instance`,
};
