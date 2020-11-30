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
  isValidRelativeUrl,
  regexDuration,
  regexEmailAddress,
  regexReportName,
} from '../utils/validationHelper';
import { isValidCron } from 'cron-validator';
import {
  REPORT_TYPE,
  TRIGGER_TYPE,
  FORMAT,
  SCHEDULE_TYPE,
  REPORT_STATE,
  REPORT_DEFINITION_STATUS,
  DELIVERY_TYPE,
  DEFAULT_MAX_SIZE,
} from '../routes/utils/constants';

export const dataReportSchema = schema.object({
  // Need this to build the links in email
  origin: schema.uri(), //e.g. https://xxxxx.com
  base_url: schema.string({
    validate(value) {
      if (!isValidRelativeUrl(value)) {
        return `invalid relative url: ${value}`;
      }
    },
    minLength: 1,
  }),
  saved_search_id: schema.string(),
  //ISO duration format. 'PT10M' means 10 min
  time_duration: schema.string({
    validate(value) {
      if (!regexDuration.test(value)) {
        return `invalid time duration: ${value}`;
      }
    },
  }),
  //TODO: future support schema.literal('xlsx')
  report_format: schema.oneOf([schema.literal(FORMAT.csv)]),
  limit: schema.number({ defaultValue: DEFAULT_MAX_SIZE, min: 0 }),
  excel: schema.boolean({ defaultValue: true }),
});

export const visualReportSchema = schema.object({
  // Need this to build the links in email
  origin: schema.uri(), //e.g. https://xxxxx.com
  base_url: schema.string({
    validate(value) {
      if (!isValidRelativeUrl(value)) {
        return `invalid relative url: ${value}`;
      }
    },
    minLength: 1,
  }),
  window_width: schema.number({ defaultValue: 1600, min: 0 }),
  window_height: schema.number({ defaultValue: 800, min: 0 }),
  report_format: schema.oneOf([
    schema.literal(FORMAT.pdf),
    schema.literal(FORMAT.png),
  ]),
  header: schema.maybe(schema.string()),
  footer: schema.maybe(schema.string()),
  time_duration: schema.string({
    validate(value) {
      if (!regexDuration.test(value)) {
        return `invalid time duration: ${value}`;
      }
    },
  }),
});

export const intervalSchema = schema.object({
  interval: schema.object({
    period: schema.number({ min: 0 }),
    // Refer to job scheduler SPI https://github.com/opendistro-for-elasticsearch/job-scheduler/blob/b333469c183a15ddbf496a690300cc9e34d937fb/spi/src/main/java/com/amazon/opendistroforelasticsearch/jobscheduler/spi/schedule/IntervalSchedule.java
    unit: schema.oneOf([
      schema.literal('MINUTES'),
      schema.literal('HOURS'),
      schema.literal('DAYS'),
      // Job scheduler in reporting ES plugin always saves as following format
      schema.literal('Minutes'),
      schema.literal('Hours'),
      schema.literal('Days'),
    ]),
    // timestamp
    start_time: schema.number(),
  }),
});

export const cronSchema = schema.object({
  cron: schema.object({
    expression: schema.string({
      validate(value) {
        if (!isValidCron(value)) {
          return `invalid cron expression: ${value}`;
        }
      },
    }),
    //TODO: add more validation once we add full support of timezone
    timezone: schema.string(),
  }),
});

export const scheduleSchema = schema.object({
  schedule_type: schema.oneOf([
    /*
    TODO: Future Date option will be added in the future.
    Currently @kbn/config-schema has no support for more than 2 conditions, keep an eye on library update
    */
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

export const kibanaUserSchema = schema.object({
  kibana_recipients: schema.arrayOf(schema.string()),
});

export const channelSchema = schema.object({
  recipients: schema.arrayOf(
    schema.string({
      validate(value) {
        if (!regexEmailAddress.test(value)) {
          return `invalid email address ${value}`;
        }
      },
    }),
    { minSize: 1 }
  ),
  title: schema.string(),
  textDescription: schema.string(),
  htmlDescription: schema.maybe(schema.string()),
  channelIds: schema.maybe(schema.arrayOf(schema.string())),
});

export const triggerSchema = schema.object({
  trigger_type: schema.oneOf([
    /*
      TODO: Alerting will be added in the future.
      Currently @kbn/config-schema has no support for more than 2 conditions, keep an eye on library update
    */
    schema.literal(TRIGGER_TYPE.schedule),
    schema.literal(TRIGGER_TYPE.onDemand),
  ]),
  trigger_params: schema.conditional(
    schema.siblingRef('trigger_type'),
    TRIGGER_TYPE.onDemand,
    schema.never(),
    scheduleSchema
  ),
});

export const deliverySchema = schema.object({
  delivery_type: schema.oneOf([
    schema.literal(DELIVERY_TYPE.kibanaUser),
    schema.literal(DELIVERY_TYPE.channel),
  ]),
  delivery_params: schema.conditional(
    schema.siblingRef('delivery_type'),
    DELIVERY_TYPE.kibanaUser,
    kibanaUserSchema,
    channelSchema
  ),
});

export const reportParamsSchema = schema.object({
  report_name: schema.string({
    validate(value) {
      if (!regexReportName.test(value)) {
        return `invald report name ${value}.\nMust be non-empty, allow a-z, A-Z, 0-9, (), [], ',' - and _ and spaces`;
      }
    },
  }),
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
});

export const reportDefinitionSchema = schema.object({
  report_params: reportParamsSchema,
  delivery: deliverySchema,
  trigger: triggerSchema,
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
  query_url: schema.string({
    validate(value) {
      if (!isValidRelativeUrl(value)) {
        return `invalid relative url: ${value}`;
      }
    },
    minLength: 1,
  }),
  time_from: schema.number(),
  time_to: schema.number(),
  report_definition: reportDefinitionSchema,

  time_created: schema.maybe(schema.number()),
  last_updated: schema.maybe(schema.number()),
  state: schema.maybe(
    schema.oneOf([
      schema.literal(REPORT_STATE.created),
      schema.literal(REPORT_STATE.error),
      schema.literal(REPORT_STATE.pending),
      schema.literal(REPORT_STATE.shared),
    ])
  ),
});

export type ReportDefinitionSchemaType = TypeOf<typeof reportDefinitionSchema>;
export type ReportSchemaType = TypeOf<typeof reportSchema>;
export type DataReportSchemaType = TypeOf<typeof dataReportSchema>;
export type VisualReportSchemaType = TypeOf<typeof visualReportSchema>;
export type ChannelSchemaType = TypeOf<typeof channelSchema>;
export type KibanaUserSchemaType = TypeOf<typeof kibanaUserSchema>;
export type DeliverySchemaType = TypeOf<typeof deliverySchema>;
export type TriggerSchemaType = TypeOf<typeof triggerSchema>;
export type ScheduleSchemaType = TypeOf<typeof scheduleSchema>;
export type ReportParamsSchemaType = TypeOf<typeof reportParamsSchema>;
