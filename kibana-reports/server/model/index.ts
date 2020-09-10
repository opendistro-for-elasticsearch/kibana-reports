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
import {
  REPORT_TYPE,
  TRIGGER_TYPE,
  FORMAT,
  SCHEDULE_TYPE,
  REPORT_STATE,
  REPORT_DEFINITION_STATUS,
} from '../routes/utils/constants';

export const dataReportSchema = schema.object({
  ref_url: schema.uri(),
  saved_search_id: schema.string(),
  // "1h" will be convert to moment.duration()
  time_duration: schema.duration(),
  //TODO: future support schema.literal('xlsx')
  report_format: schema.oneOf([schema.literal(FORMAT.csv)]),
});

const visualReportSchema = schema.object({
  ref_url: schema.uri(),
  window_width: schema.number({ defaultValue: 1200 }),
  window_height: schema.number({ defaultValue: 800 }),
  report_format: schema.oneOf([
    schema.literal(FORMAT.pdf),
    schema.literal(FORMAT.png),
  ]),
  time_duration: schema.duration(),
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
    schema.literal(SCHEDULE_TYPE.recurring),
    schema.literal(SCHEDULE_TYPE.cron),
  ]),
  schedule: schema.conditional(
    schema.siblingRef('schedule_type'),
    SCHEDULE_TYPE.recurring,
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
      schema.literal(REPORT_TYPE.dashboard),
      schema.literal(REPORT_TYPE.visualization),
      schema.literal(REPORT_TYPE.savedSearch),
    ]),
    description: schema.string(),

    core_params: schema.conditional(
      schema.siblingRef('report_source'),
      REPORT_TYPE.savedSearch,
      dataReportSchema,
      visualReportSchema
    ),
  }),

  notification: schema.maybe(
    schema.object({
      recipients: schema.arrayOf(schema.string(), { minSize: 0 }),
      title: schema.string(),
      description: schema.oneOf([
        schema.object({ text: schema.string() }),
        schema.object({ html: schema.string() }),
      ]),
      channel_ids: schema.maybe(schema.arrayOf(schema.string())),
    })
  ),

  trigger: schema.object({
    trigger_type: schema.oneOf([
      /*
        TODO: Alerting will be added in the future.
        Currently @kbn/config-schema has no support for more than 2 conditions, keep an eye on library update
      */
      // schema.literal(TRIGGER_TYPE.alerting)
      schema.literal(TRIGGER_TYPE.schedule),
      schema.literal(TRIGGER_TYPE.onDemand),
    ]),
    trigger_params: schema.conditional(
      schema.siblingRef('trigger_type'),
      TRIGGER_TYPE.onDemand,
      schema.never(),
      scheduleSchema
    ),
  }),

  time_created: schema.maybe(schema.number()),
  last_updated: schema.maybe(schema.number()),
  status: schema.maybe(
    schema.oneOf([
      schema.literal(REPORT_DEFINITION_STATUS.active),
      schema.literal(REPORT_DEFINITION_STATUS.disabled),
    ])
  ),
});

export const reportSchema = schema.object({
  query_url: schema.uri(),
  time_from: schema.number(),
  time_to: schema.number(),
  report_definition: reportDefinitionSchema,

  time_created: schema.maybe(schema.number()),
  state: schema.maybe(
    schema.oneOf([
      schema.literal(REPORT_STATE.created),
      schema.literal(REPORT_STATE.error),
    ])
  ),
});

export type ReportDefinitionSchemaType = TypeOf<typeof reportDefinitionSchema>;
export type ReportSchemaType = TypeOf<typeof reportSchema>;
export type dataReportSchemaType = TypeOf<typeof dataReportSchema>;
export type visualReportSchemaType = TypeOf<typeof visualReportSchema>;
