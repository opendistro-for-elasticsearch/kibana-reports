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

import { ChannelSchemaType, ReportSchemaType } from 'server/model';
import {
  ILegacyScopedClusterClient,
  ILegacyClusterClient,
  Logger,
} from '../../../../../src/core/server';
import { DELIVERY_TYPE, REPORT_STATE } from '../utils/constants';
import { composeEmbeddedHtml } from '../utils/notification/deliveryContentHelper';
import { updateReportState } from './updateReportState';

export const deliverReport = async (
  report: ReportSchemaType,
  notificationClient: ILegacyScopedClusterClient | ILegacyClusterClient,
  esReportsClient: ILegacyClusterClient | ILegacyScopedClusterClient,
  reportId: string,
  logger: Logger
) => {
  const {
    report_definition: {
      delivery: {
        delivery_params: deliveryParams,
        delivery_type: deliveryType,
      },
    },
  } = report;
  // check delivery type
  if (deliveryType === DELIVERY_TYPE.channel) {
    // deliver through one of [Slack, Chime, Email]
    const {
      query_url: queryUrl,
      report_definition: {
        report_params: {
          report_name: reportName,
          core_params: { origin },
        },
      },
    } = report;
    const { htmlDescription } = deliveryParams as ChannelSchemaType;
    const originalQueryUrl = origin + queryUrl;
    /**
     * have to manually compose the url because the Kibana url for AES is.../_plugin/kibana/app/opendistro_kibana_reports#/report_details/${reportId}
     * while default Kibana is just .../app/opendistro_kibana_reports#/report_details/${reportId}
     */
    const reportDetailUrl = `${originalQueryUrl.replace(
      /\/app\/.*$/i,
      ''
    )}/app/opendistro_kibana_reports#/report_details/${reportId}`;

    const embeddedHtml = composeEmbeddedHtml(
      htmlDescription,
      originalQueryUrl,
      reportDetailUrl,
      reportName
    );

    const reqBody = {
      ...deliveryParams,
      htmlDescription: embeddedHtml,
      refTag: reportId,
    };

    // send email
    const notificationResp = await notificationClient.callAsInternalUser(
      // @ts-ignore
      'notification.send',
      {
        body: reqBody,
      }
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

    notificationResp.recipients.map((recipient: any) => {
      if (recipient.statusCode !== 200) {
        throw new Error(
          `Fail to deliver report ${JSON.stringify(
            notificationResp.recipients
          )}`
        );
      }
    });
  }

  // update report state
  // TODO: temporarily disable the following, will add back
  // await updateReportState(reportId, esReportsClient, REPORT_STATE.shared);
};
