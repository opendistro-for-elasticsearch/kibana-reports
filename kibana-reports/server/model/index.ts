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

import { schema, TypeOf } from '@kbn/config-schema';

export const dataReportSchema = schema.object({
  saved_search_id: schema.string(),
  start: schema.string(),
  end: schema.string(),
  report_format: schema.oneOf([schema.literal('csv'), schema.literal('xlsx')]),
});

const visualReportSchema = schema.object({
  url: schema.uri(),
  window_width: schema.number({ defaultValue: 1200 }),
  window_height: schema.number({ defaultValue: 800 }),
  report_format: schema.oneOf([schema.literal('pdf'), schema.literal('png')]),
});

export const scheduleSchema = schema.object({
  schedule_type: schema.oneOf([
    schema.literal('Now'),
    schema.literal('Future Date'),
    schema.literal('Recurring'),
    schema.literal('Cron Based'),
  ]),
  schedule: schema.any(),
  enabled_time: schema.number(),
});

export const intervalSchema = schema.object({
  interval: schema.object({
    period: schema.number(),
    // Refer to job scheduler SPI https://github.com/opendistro-for-elasticsearch/job-scheduler/blob/b333469c183a15ddbf496a690300cc9e34d937fb/spi/src/main/java/com/amazon/opendistroforelasticsearch/jobscheduler/spi/schedule/IntervalSchedule.java
    unit: schema.oneOf([
      schema.literal('MINUTES'),
      schema.literal('HOURS'),
      schema.literal('DAYS'),
    ]),
    // timeStamp
    start_time: schema.number(),
  }),
});

export const cronSchema = schema.object({
  corn: schema.object({
    expression: schema.string(),
    time_zone: schema.string(),
  }),
});

export const emailSchema = schema.object({
  subject: schema.string(),
  body: schema.string(),
  has_attachment: schema.boolean({ defaultValue: true }),
  recipients: schema.arrayOf(schema.string(), { minSize: 1 }),
});

export const reportSchema = schema.object({
  report_name: schema.string(),
  report_source: schema.oneOf([
    schema.literal('Dashboard'),
    schema.literal('Visualization'),
    schema.literal('Saved search'),
  ]),
  report_type: schema.oneOf([
    schema.literal('Download'),
    schema.literal('Alert'),
    schema.literal('Schedule'),
  ]),
  description: schema.string(),
  report_params: schema.conditional(
    schema.siblingRef('report_source'),
    'Saved search',
    dataReportSchema,
    visualReportSchema
  ),

  delivery: schema.maybe(
    schema.object({
      channel: schema.oneOf([
        schema.literal('Email'),
        schema.literal('Slack'),
        schema.literal('Chime'),
        schema.literal('Kibana User'),
      ]),
      //TODO: no validation on delivery settings for now, because @kbn/config-schema has no support for more than 2 conditions
      delivery_params: schema.any(),
    })
  ),

  trigger: schema.maybe(
    schema.object({
      trigger_type: schema.oneOf([
        schema.literal('Alert'),
        schema.literal('Schedule'),
      ]),
      trigger_params: schema.conditional(
        schema.siblingRef('trigger_type'),
        'Alert',
        // TODO: add alerting schema here once we finished the design for alerting integration
        schema.any(),
        scheduleSchema
      ),
    })
  ),
});

export type ReportSchemaType = TypeOf<typeof reportSchema>;
