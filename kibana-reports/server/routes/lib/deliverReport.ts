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
  Logger,
} from '../../../../../src/core/server';
import { DELIVERY_TYPE, REPORT_STATE } from '../utils/constants';
import { composeEmbeddedHtml } from '../utils/notification/deliveryContentHelper';
import { callCluster, updateReportState } from '../utils/helpers';
import { CreateReportResultType } from '../utils/types';

export const deliverReport = async (
  report: ReportSchemaType,
  reportData: CreateReportResultType,
  notificationClient: ILegacyScopedClusterClient | ILegacyClusterClient,
  esClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  reportId: string,
  isScheduledTask: boolean,
  logger: Logger
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
    const {
      query_url: queryUrl,
      report_definition: {
        report_params: { report_name: reportName },
      },
    } = report;
    const { htmlDescription, origin } = deliveryParams;
    const originalQueryUrl = origin + queryUrl;
    /**
     * have to manually compose the url because the Kibana url for AES is.../_plugin/kibana/app/opendistro_kibana_reports#/report_details/${reportId}
     * while default Kibana is just .../app/opendistro_kibana_reports#/report_details/${reportId}
     */
    const reportDetailUrl = `${originalQueryUrl.replace(
      /\/app\/.*$/i,
      ''
    )}/app/opendistro_kibana_reports#/report_details/${reportId}`;
    const template = composeEmbeddedHtml(
      htmlDescription,
      originalQueryUrl,
      reportDetailUrl,
      reportName
    );
    const deliveryBody = {
      ...deliveryParams,
      htmlDescription: template,
      refTag: reportId,
    };
    // send email
    const notificationResp = await callCluster(
      notificationClient,
      'notification.send',
      {
        body: deliveryBody,
      },
      isScheduledTask
    );
    /**
     * notification plugin response example:
     * {
          "refTag": "jeWuU3UBp8p83fn6xwzB",
          "recipients": [
            {
              "recipient": "odfe@amazon.com",
              "statusCode": 200,
              "statusText": "Success"
            },
            {
              "recipient": "wrong.odfe@amazon.com",
              "statusCode": 503,
              "statusText": "sendEmail Error, SES status:400:Optional[Bad Request]"
            }
          ]
        }
     */
    logger.info(
      `notification plugin response: ${JSON.stringify(notificationResp)}`
    );
    notificationResp.recipients.map((recipient) => {
      if (recipient.statusCode !== 200) {
        throw new Error(
          `Fail to deliver report ${JSON.stringify(
            notificationResp.recipients
          )}`
        );
      }
    });
  } else {
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
