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

import { ReportSchemaType } from 'server/model';
import {
  ILegacyScopedClusterClient,
  ILegacyClusterClient,
} from '../../../../../src/core/server';
import {
  DELIVERY_TYPE,
  EMAIL_FORMAT,
  FORMAT,
  REPORT_STATE,
} from '../utils/constants';
import { callCluster, updateReportState } from '../utils/helpers';
import { CreateReportResultType } from '../utils/types';

export const deliverReport = async (
  report: ReportSchemaType,
  reportData: CreateReportResultType,
  notificationClient: ILegacyScopedClusterClient | ILegacyClusterClient,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  reportId: string,
  isScheduledTask: boolean
) => {
  // check delivery type
  const delivery = report.report_definition.delivery;

  let deliveryType;
  let deliveryParams;
  if (delivery) {
    deliveryType = delivery.delivery_type;
    deliveryParams = delivery.delivery_params;
  } else {
    return reportData;
  }

  if (deliveryType === DELIVERY_TYPE.channel) {
    // deliver through one of [Slack, Chime, Email]
    //@ts-ignore
    const { email_format: emailFormat, ...rest } = deliveryParams;
    // compose request body
    if (emailFormat === EMAIL_FORMAT.attachment) {
      const reportFormat =
        report.report_definition.report_params.core_params.report_format;
      const attachment = {
        fileName: reportData.fileName,
        fileEncoding: reportFormat === FORMAT.csv ? 'text' : 'base64',
        //TODO: figure out when this data field is actually needed
        // fileContentType: 'application/pdf',
        fileData: reportData.dataUrl,
      };
      const deliveryBody = {
        ...rest,
        refTag: reportId,
        attachment,
      };

      const res = await callCluster(
        notificationClient,
        'notification.send',
        {
          body: deliveryBody,
        },
        isScheduledTask
      );
      //TODO: need better error handling or logging
    }
  } else {
    //TODO: No attachment, use embedded html (not implemented yet)
    // empty kibana recipients array
    //TODO: tmp solution
    // @ts-ignore
    if (!deliveryParams.kibana_recipients.length) {
      return reportData;
    }
  }
  // update report document with state "shared" and time_created
  await updateReportState(
    isScheduledTask,
    reportId,
    esClient,
    REPORT_STATE.shared,
    reportData
  );

  return reportData;
};
