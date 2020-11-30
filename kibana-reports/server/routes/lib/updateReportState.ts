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
  ILegacyClusterClient,
  ILegacyScopedClusterClient,
} from '../../../../../src/core/server';
import { REPORT_STATE } from '../utils/constants';
import { getBackendReportState } from '../utils/converters/uiToBackend';

// The only thing can be updated of a report instance is its "state"
export const updateReportState = async (
  reportId: string,
  esReportsClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  state: REPORT_STATE
) => {
  //Build request body
  const reqBody = {
    reportInstanceId: reportId,
    status: getBackendReportState(state),
  };

  const esResp = await esReportsClient.callAsInternalUser(
    // @ts-ignore
    'es_reports.updateReportInstanceStatus',
    {
      reportInstanceId: reportId,
      body: reqBody,
    }
  );

  return esResp;
};
