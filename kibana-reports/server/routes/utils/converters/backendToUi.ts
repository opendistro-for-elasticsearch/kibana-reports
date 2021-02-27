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
  DataReportSchemaType,
  DeliverySchemaType,
  ReportDefinitionSchemaType,
  reportSchema,
  ReportSchemaType,
  TriggerSchemaType,
  VisualReportSchemaType,
} from '../../../model';
import {
  BackendReportDefinitionDetailsType,
  BackendReportInstanceType,
  BACKEND_REPORT_FORMAT,
  BACKEND_REPORT_SOURCE,
  BACKEND_REPORT_STATE,
  CronType,
  DeliveryType,
  IntervalType,
  REPORT_FORMAT_DICT,
  REPORT_SOURCE_DICT,
  REPORT_STATE_DICT,
  TRIGGER_TYPE_DICT,
  URL_PREFIX_DICT,
} from '../../../model/backendModel';
import {
  DEFAULT_MAX_SIZE,
  DELIVERY_TYPE,
  FORMAT,
  REPORT_DEFINITION_STATUS,
  REPORT_STATE,
  REPORT_TYPE,
  SCHEDULE_TYPE,
  TRIGGER_TYPE,
} from '../constants';
import moment from 'moment';
import { parse } from 'url';

export const backendToUiReport = (
  backendReportInstance: BackendReportInstanceType
): ReportSchemaType => {
  const {
    inContextDownloadUrlPath,
    beginTimeMs,
    endTimeMs,
    tenant,
    status,
    lastUpdatedTimeMs: reportLastUpdatedTimeMs,
    createdTimeMs: reportCreatedTimeMs,
    reportDefinitionDetails: backendReportDefinitionDetails,
  } = backendReportInstance;

  const {
    reportDefinition: {
      source: { type: sourceType, id: sourceId },
      delivery,
    },
  } = backendReportDefinitionDetails;

  const baseUrl = getBaseUrl(sourceType, sourceId);

  let report: ReportSchemaType = {
    // inContextDownloadUrlPath may not exist for report instance created from scheduled job
    query_url:
      inContextDownloadUrlPath ||
      getUiQueryUrl(baseUrl, beginTimeMs, endTimeMs, tenant),
    time_from: beginTimeMs,
    time_to: endTimeMs,
    last_updated: reportLastUpdatedTimeMs,
    time_created: reportCreatedTimeMs,
    state: getUiReportState(status, delivery),
    report_definition: backendToUiReportDefinition(
      backendReportDefinitionDetails
    ),
  };
  // validate to assign default values to some fields for UI model
  report = reportSchema.validate(report);
  return report;
};

export const backendToUiReportsList = (
  backendReportsList: BackendReportInstanceType[]
) => {
  const res = backendReportsList.map((backendReport) => {
    return { _id: backendReport.id, _source: backendToUiReport(backendReport) };
  });
  return res;
};

export const backendToUiReportDefinition = (
  backendReportDefinitionDetails: BackendReportDefinitionDetailsType
): ReportDefinitionSchemaType => {
  const {
    lastUpdatedTimeMs,
    createdTimeMs,
    reportDefinition: {
      name,
      isEnabled,
      source: { type: sourceType, description, id: sourceId, origin },
      format: { fileFormat, duration, header, footer, limit },
      trigger: { triggerType, schedule },
      delivery,
    },
  } = backendReportDefinitionDetails;

  const baseUrl = getBaseUrl(sourceType, sourceId);
  const reportSource = getUiReportSource(sourceType);

  let uiReportDefinition: ReportDefinitionSchemaType = {
    report_params: {
      report_name: name,
      report_source: reportSource,
      description: description,
      core_params:
        reportSource === REPORT_TYPE.savedSearch
          ? getDataReportCoreParams(
              limit,
              sourceId,
              fileFormat,
              duration,
              baseUrl,
              origin
            )
          : getVisualReportCoreParams(
              fileFormat,
              header,
              footer,
              duration,
              baseUrl,
              origin
            ),
    },
    trigger: getUiTriggerParams(
      triggerType,
      schedule,
      createdTimeMs,
      isEnabled
    ),
    delivery: getUiDeliveryParams(delivery), //TODO:
    time_created: createdTimeMs,
    last_updated: lastUpdatedTimeMs,
    status: getUiReportDefinitionStatus(isEnabled),
  };

  return uiReportDefinition;
};

export const backendToUiReportDefinitionsList = (
  backendReportDefinitionDetailsList: BackendReportDefinitionDetailsType[]
) => {
  const res = backendReportDefinitionDetailsList.map(
    (backendReportDefinitionDetails) => {
      return {
        _id: backendReportDefinitionDetails.id,
        _source: {
          // TODO: this property can be removed, but need UI changes as well
          report_definition: backendToUiReportDefinition(
            backendReportDefinitionDetails
          ),
        },
      };
    }
  );
  return res;
};

const getVisualReportCoreParams = (
  fileFormat: BACKEND_REPORT_FORMAT,
  header: string = '',
  footer: string = '',
  duration: string,
  baseUrl: string,
  origin: string
): VisualReportSchemaType => {
  let res: VisualReportSchemaType = {
    base_url: baseUrl,
    report_format: <FORMAT.pdf | FORMAT.png>getUiReportFormat(fileFormat),
    header: header,
    footer: footer,
    time_duration: duration,
    origin: origin,
  };
  return res;
};

// queryUrl = baseUrl + time range
const getUiQueryUrl = (
  baseUrl: string,
  beginTimeMs: number,
  endTimeMs: number,
  tenant?: string
) => {
  const timeFrom = moment(beginTimeMs).toISOString();
  const timeTo = moment(endTimeMs).toISOString();
  let queryUrl = `${baseUrl}?_g=(time:(from:'${timeFrom}',to:'${timeTo}'))`;
  if (tenant) {
    if (tenant === '__user__') {
      tenant = 'private';
    }
    queryUrl = addTenantToURL(queryUrl, tenant);
  }
  return queryUrl;
};

const getBaseUrl = (sourceType: BACKEND_REPORT_SOURCE, sourceId: string) => {
  //TODO: AES domain has different prefix, need figure out a general solution
  const baseUrl = `${URL_PREFIX_DICT[sourceType]}${sourceId}`;
  return baseUrl;
};

const getDataReportCoreParams = (
  limit: number = DEFAULT_MAX_SIZE,
  sourceId: string,
  fileFormat: BACKEND_REPORT_FORMAT,
  duration: string,
  baseUrl: string,
  origin: string
): DataReportSchemaType => {
  let res: DataReportSchemaType = {
    base_url: baseUrl,
    report_format: <FORMAT.csv>getUiReportFormat(fileFormat),
    limit: limit,
    time_duration: duration,
    saved_search_id: sourceId,
    origin: origin,
  };
  return res;
};

const getUiScheduleParams = (
  schedule: CronType | IntervalType | undefined,
  createdTimeMs: number,
  isEnabled: boolean
) => {
  let res = {
    trigger_params: {
      enabled_time: createdTimeMs,
      enabled: isEnabled,
      schedule_type:
        schedule && 'cron' in schedule
          ? SCHEDULE_TYPE.cron
          : SCHEDULE_TYPE.recurring,
      schedule: schedule,
    },
  };
  return res;
};

const getUiTriggerType = (backendField: string): TRIGGER_TYPE => {
  let res: any;
  for (let [ui, backendFieldList] of Object.entries(TRIGGER_TYPE_DICT)) {
    for (let item of backendFieldList) {
      if (item === backendField) {
        res = <TRIGGER_TYPE>ui;
      }
    }
  }
  return res;
};

const getUiReportFormat = (backendField: string): FORMAT => {
  let res: any;
  for (let [ui, backend] of Object.entries(REPORT_FORMAT_DICT)) {
    if (backend === backendField) {
      res = <FORMAT>ui;
    }
  }
  return res;
};

const getUiReportState = (
  status: BACKEND_REPORT_STATE,
  delivery: any
): REPORT_STATE => {
  let res: any;
  for (let [ui, backend] of Object.entries(REPORT_STATE_DICT)) {
    if (backend === status) {
      // distinguish "shared" and "created"
      if (status === BACKEND_REPORT_STATE.success && delivery) {
        res = REPORT_STATE.shared;
      } else {
        res = <REPORT_STATE>ui;
      }
    } else if (status === BACKEND_REPORT_STATE.scheduled) {
      // corner case
      res = REPORT_STATE.pending;
    }
  }
  return res;
};

const getUiReportSource = (type: BACKEND_REPORT_SOURCE): REPORT_TYPE => {
  let res: any;
  for (let [ui, backend] of Object.entries(REPORT_SOURCE_DICT)) {
    if (backend === type) {
      res = <REPORT_TYPE>ui;
    }
  }
  return res;
};

const getUiReportDefinitionStatus = (
  isEnabled: any
): REPORT_DEFINITION_STATUS => {
  return isEnabled
    ? REPORT_DEFINITION_STATUS.active
    : REPORT_DEFINITION_STATUS.disabled;
};

const getUiTriggerParams = (
  triggerType: any,
  schedule: CronType | IntervalType | undefined,
  createdTimeMs: number,
  isEnabled: boolean
): TriggerSchemaType => {
  let res: TriggerSchemaType = {
    trigger_type: getUiTriggerType(triggerType),
    ...(getUiTriggerType(triggerType) === TRIGGER_TYPE.schedule &&
      getUiScheduleParams(schedule, createdTimeMs, isEnabled)),
  };

  return res;
};

// Delivery
const getUiDeliveryParams = (
  delivery: DeliveryType | undefined
): DeliverySchemaType => {
  const kibanaUserDeliveryParams = {
    delivery_type: DELIVERY_TYPE.kibanaUser,
    delivery_params: {
      kibana_recipients: [],
    },
  };

  let params: any;
  if (delivery) {
    const { deliveryFormat, ...rest } = delivery;
    params = {
      delivery_type: DELIVERY_TYPE.channel,
      delivery_params: {
        ...rest,
      },
    };
  } else {
    params = kibanaUserDeliveryParams;
  }
  return params;
};

// helper function to add tenant info to url(if tenant is available)
const addTenantToURL = (url: string, userRequestedTenant: string) => {
  // build fake url from relative url
  const fakeUrl = `http://opendistro.com${url}`;
  const tenantKey = 'security_tenant';
  const tenantKeyAndValue =
    tenantKey + '=' + encodeURIComponent(userRequestedTenant);

  const { pathname, search } = parse(fakeUrl);
  const queryDelimiter = !search ? '?' : '&';

  // The url parser returns null if the search is empty. Change that to an empty
  // string so that we can use it to build the values later
  if (search && search.toLowerCase().indexOf(tenantKey) > -1) {
    // If we for some reason already have a tenant in the URL we skip any updates
    return url;
  }

  // A helper for finding the part in the string that we want to extend/replace
  const valueToReplace = pathname! + (search || '');
  const replaceWith = valueToReplace + queryDelimiter + tenantKeyAndValue;

  return url.replace(valueToReplace, replaceWith);
};
