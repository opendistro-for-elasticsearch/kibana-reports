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
  BASE_PATH,
  FORMAT,
  REPORT_STATE,
  REPORT_TYPE,
  TRIGGER_TYPE,
} from '../routes/utils/constants';

export type BackendReportInstanceType = {
  id: string;
  lastUpdatedTimeMs?: number;
  createdTimeMs?: number;
  beginTimeMs: number;
  endTimeMs: number;
  access?: string[];
  tenant?: string;
  status: BACKEND_REPORT_STATE;
  statusText?: string;
  inContextDownloadUrlPath?: string;
  reportDefinitionDetails: BackendReportDefinitionDetailsType;
};

export type BackendReportDefinitionType = {
  name: string;
  isEnabled: boolean;
  source: {
    description: string;
    type: BACKEND_REPORT_SOURCE;
    id: string;
    origin: string;
  };
  format: {
    duration: string;
    fileFormat: BACKEND_REPORT_FORMAT;
    limit?: number;
    header?: string;
    footer?: string;
  };
  trigger: {
    triggerType: BACKEND_TRIGGER_TYPE;
    schedule?: CronType | IntervalType;
  };
  delivery?: DeliveryType;
};

export type BackendReportDefinitionDetailsType = {
  id?: string;
  lastUpdatedTimeMs: number;
  createdTimeMs: number;
  access?: string[];
  reportDefinition: BackendReportDefinitionType;
};

export type CronType = {
  cron: {
    expression: string;
    timezone: string;
  };
};

export type IntervalType = {
  interval: {
    start_time: number;
    period: number;
    unit: string;
  };
};

export type DeliveryType = {
  recipients: string[];
  deliveryFormat: BACKEND_DELIVERY_FORMAT;
  title: string;
  textDescription: string;
  htmlDescription?: string;
  channelIds?: string[];
};

export enum BACKEND_DELIVERY_FORMAT {
  linkOnly = 'LinkOnly',
  attachment = 'Attachment',
  embedded = 'Embedded',
}

export enum BACKEND_REPORT_SOURCE {
  dashboard = 'Dashboard',
  visualization = 'Visualization',
  savedSearch = 'SavedSearch',
}

export enum BACKEND_REPORT_STATE {
  scheduled = 'Scheduled',
  executing = 'Executing',
  success = 'Success',
  failed = 'Failed',
}

export enum BACKEND_REPORT_FORMAT {
  pdf = 'Pdf',
  png = 'Png',
  csv = 'Csv',
}

export enum BACKEND_TRIGGER_TYPE {
  download = 'Download',
  onDemand = 'OnDemand',
  cronSchedule = 'CronSchedule',
  intervalSchedule = 'IntervalSchedule',
}

export const REPORT_STATE_DICT = {
  [REPORT_STATE.pending]: BACKEND_REPORT_STATE.executing,
  [REPORT_STATE.error]: BACKEND_REPORT_STATE.failed,
  [REPORT_STATE.shared]: BACKEND_REPORT_STATE.success,
  [REPORT_STATE.created]: BACKEND_REPORT_STATE.success,
};

export const REPORT_SOURCE_DICT = {
  [REPORT_TYPE.dashboard]: BACKEND_REPORT_SOURCE.dashboard,
  [REPORT_TYPE.visualization]: BACKEND_REPORT_SOURCE.visualization,
  [REPORT_TYPE.savedSearch]: BACKEND_REPORT_SOURCE.savedSearch,
};

export const REPORT_FORMAT_DICT = {
  [FORMAT.csv]: BACKEND_REPORT_FORMAT.csv,
  [FORMAT.pdf]: BACKEND_REPORT_FORMAT.pdf,
  [FORMAT.png]: BACKEND_REPORT_FORMAT.png,
};

export const TRIGGER_TYPE_DICT = {
  [TRIGGER_TYPE.schedule]: [
    BACKEND_TRIGGER_TYPE.cronSchedule,
    BACKEND_TRIGGER_TYPE.intervalSchedule,
  ],
  [TRIGGER_TYPE.onDemand]: [
    BACKEND_TRIGGER_TYPE.onDemand,
    BACKEND_TRIGGER_TYPE.download,
  ],
};

export const URL_PREFIX_DICT = {
  [BACKEND_REPORT_SOURCE.dashboard]: `${BASE_PATH}/app/dashboards#/view/`,
  [BACKEND_REPORT_SOURCE.savedSearch]: `${BASE_PATH}/app/discover#/view/`,
  [BACKEND_REPORT_SOURCE.visualization]: `${BASE_PATH}/app/visualize#/edit/`,
};
