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
import { REPORT_TYPE, TRIGGER_TYPE } from '../routes/utils/constants';

export const dataReportSchema = schema.object({
  saved_search_id: schema.string(),
  time_duration: schema.duration(), // moment.js duration format. e.g. "1h"
  report_format: schema.oneOf([schema.literal('csv'), schema.literal('xlsx')]),
});

const visualReportSchema = schema.object({
  url: schema.uri(),
  window_width: schema.number({ defaultValue: 1200 }),
  window_height: schema.number({ defaultValue: 800 }),
  report_format: schema.oneOf([schema.literal('pdf'), schema.literal('png')]),
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
    // timestamp
    start_time: schema.number(),
  }),
});

export const cronSchema = schema.object({
  cron: schema.object({
    expression: schema.string(),
    time_zone: schema.string(),
  }),
});

export const scheduleSchema = schema.object({
  schedule_type: schema.oneOf([
    /*
    TODO: Alerting will be added in the future.
    Currently @kbn/config-schema has no support for more than 2 conditions, keep an eye on library update
    */
    // schema.literal('Future Date'),
    schema.literal('Recurring'),
    schema.literal('Cron Based'),
  ]),
  schedule: schema.conditional(
    schema.siblingRef('schedule_type'),
    'Recurring',
    intervalSchema,
    cronSchema
  ),
  enabled_time: schema.number(),
  enabled: schema.boolean(),
});

export const reportDefinitionSchema = schema.object({
  report_params: schema.object({
    report_name: schema.string(),
    report_source: schema.oneOf([
      schema.literal('Dashboard'),
      schema.literal('Visualization'),
      schema.literal('Saved search'),
    ]),
    description: schema.string(),

    core_params: schema.conditional(
      schema.siblingRef('report_source'),
      'Saved search',
      dataReportSchema,
      visualReportSchema
    ),
  }),

  delivery: schema.object({
    recipients: schema.arrayOf(schema.string(), { minSize: 0 }),
    title: schema.string(),
    description: schema.string(),
  }),

  trigger: schema.object({
    trigger_type: schema.oneOf([
      /*
      TODO: Alerting will be added in the future.
      Currently @kbn/config-schema has no support for more than 2 conditions, keep an eye on library update
      */
      // schema.literal(TRIGGER_TYPE.alerting)
      schema.literal('Schedule'),
      schema.literal('On demand'),
    ]),
    trigger_params: schema.conditional(
      schema.siblingRef('trigger_type'),
      'On demand',
      schema.never(),
      scheduleSchema
    ),
  }),
});

export type ReportDefinitionSchemaType = TypeOf<typeof reportDefinitionSchema>;
