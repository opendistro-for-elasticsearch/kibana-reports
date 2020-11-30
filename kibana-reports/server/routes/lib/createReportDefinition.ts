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

import { ReportDefinitionSchemaType } from '../../model';
import {
  KibanaRequest,
  RequestHandlerContext,
  ILegacyScopedClusterClient,
} from '../../../../../src/core/server';
import { uiToBackendReportDefinition } from '../utils/converters/uiToBackend';

export const createReportDefinition = async (
  request: KibanaRequest,
  context: RequestHandlerContext,
  reportDefinition: ReportDefinitionSchemaType
) => {
  // @ts-ignore
  const esReportsClient: ILegacyScopedClusterClient = context.reporting_plugin.esReportsClient.asScoped(
    request
  );
  // create report definition
  const reqBody = {
    reportDefinition: uiToBackendReportDefinition(reportDefinition),
  };
  const esResp = await esReportsClient.callAsCurrentUser(
    'es_reports.createReportDefinition',
    {
      body: reqBody,
    }
  );

  return esResp;
};
