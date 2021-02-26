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

import { RequestParams } from '@elastic/elasticsearch';
import path from 'path';
import { ILegacyScopedClusterClient } from '../../../../src/core/server';
import {
  reportDefinitionSchema,
  ReportDefinitionSchemaType,
  reportSchema,
  ReportSchemaType,
} from '../../server/model';
import { REPORT_TYPE } from '../../server/routes/utils/constants';

export const isValidRelativeUrl = (relativeUrl: string) => {
  const normalizedRelativeUrl = path.posix.normalize(relativeUrl);
  // check pattern
  // ODFE pattern: /app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g
  // AES pattern: /_plugin/kibana/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g
  const isValid = regexRelativeUrl.test(normalizedRelativeUrl);

  return isValid;
};

/**
 * moment.js isValid() API fails to validate time duration, so use regex
 * https://github.com/moment/moment/issues/1805
 **/
export const regexDuration = /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
export const regexEmailAddress = /\S+@\S+\.\S+/;
export const regexReportName = /^[\w\-\s\(\)\[\]\,\_\-+]+$/;
export const regexRelativeUrl = /^\/(_plugin\/kibana\/app|app)\/(dashboards|visualize|discover)(\?security_tenant=.+|)#\/(view|edit)\/[^\/]+$/;

export const validateReport = async (
  client: ILegacyScopedClusterClient,
  report: ReportSchemaType
) => {
  // validate basic schema
  report = reportSchema.validate(report);
  // parse to retrieve data
  const {
    query_url: queryUrl,
    report_definition: {
      report_params: { report_source: reportSource },
    },
  } = report;
  // Check if saved object actually exists
  await validateSavedObject(client, queryUrl, reportSource);
  return report;
};

export const validateReportDefinition = async (
  client: ILegacyScopedClusterClient,
  reportDefinition: ReportDefinitionSchemaType
) => {
  // validate basic schema
  reportDefinition = reportDefinitionSchema.validate(reportDefinition);
  // parse to retrieve data
  const {
    report_params: {
      report_source: reportSource,
      core_params: { base_url: baseUrl },
    },
  } = reportDefinition;
  // Check if saved object actually exists
  await validateSavedObject(client, baseUrl, reportSource);
  return reportDefinition;
};

const validateSavedObject = async (
  client: ILegacyScopedClusterClient,
  url: string,
  source: REPORT_TYPE
) => {
  const getId = (url: string) => {
    return url
      .split('/')
      .pop()
      ?.replace(/\?\S+$/, '');
  };
  const getType = (source: REPORT_TYPE) => {
    switch (source) {
      case REPORT_TYPE.dashboard:
        return 'dashboard';
      case REPORT_TYPE.savedSearch:
        return 'search';
      case REPORT_TYPE.visualization:
        return 'visualization';
    }
  };

  const savedObjectId = `${getType(source)}:${getId(url)}`;
  const params: RequestParams.Exists = {
    index: '.kibana',
    id: savedObjectId,
  };

  const exist = await client.callAsCurrentUser('exists', params);
  if (!exist) {
    throw Error(`saved object with id ${savedObjectId} does not exist`);
  }
};
