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

import { PLUGIN_ID } from '../../../common';

export enum FORMAT {
  pdf = 'pdf',
  png = 'png',
  csv = 'csv',
}

export enum REPORT_STATE {
  created = 'Created',
  error = 'Error',
  pending = 'Pending',
  shared = 'Shared',
}

export enum REPORT_DEFINITION_STATUS {
  active = 'Active',
  disabled = 'Disabled',
}

export enum DELIVERY_CHANNEL {
  email = 'Email',
  slack = 'Slack',
  chime = 'Chime',
  kibana = 'Kibana user',
}

export enum SCHEDULE_TYPE {
  recurring = 'Recurring',
  cron = 'Cron based',
}

export enum REPORT_TYPE {
  savedSearch = 'Saved search',
  dashboard = 'Dashboard',
  visualization = 'Visualization',
}

export enum DATA_REPORT_CONFIG {
  excelDateFormat = 'MM/DD/YYYY h:mm:ss a',
}

export enum TRIGGER_TYPE {
  schedule = 'Schedule',
  onDemand = 'On demand',
}

export enum DELIVERY_TYPE {
  kibanaUser = 'Kibana user',
  channel = 'Channel',
}

export enum SELECTOR {
  dashboard = '#dashboardViewport',
  visualization = '.visEditor__content',
  topNavBar = '#globalHeaderBars',
}

// https://www.elastic.co/guide/en/elasticsearch/reference/6.8/search-request-from-size.html
export const DEFAULT_MAX_SIZE = 10000;

export const LOCAL_HOST = 'http://localhost:5601';

export const DEFAULT_REPORT_HEADER = '<h1>Open Distro Kibana Reports</h1>';

export const SECURITY_AUTH_COOKIE_NAME = 'security_authentication';

export const CHROMIUM_PATH = `${__dirname}/../../../.chromium/headless_shell`;
