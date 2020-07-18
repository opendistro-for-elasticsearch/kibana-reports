import { schema, TypeOf } from '@kbn/config-schema';

// TODO: needs update when we integrate csv feature
const data_report_params = schema.object({
  saved_search_id: schema.string(),
  time_range: schema.string(),
  reportFormat: schema.oneOf([schema.literal('csv'), schema.literal('xlsx')]),
});

const visual_report_params = schema.object({
  url: schema.uri(),
  windowWidth: schema.number({ defaultValue: 1200 }),
  windowLength: schema.number({ defaultValue: 800 }),
  reportFormat: schema.oneOf([schema.literal('pdf'), schema.literal('png')]),
});

const schedule = schema.object({
  schedule_type: schema.oneOf([
    schema.literal('Now'),
    schema.literal('Future Date'),
    schema.literal('Recurring'),
    schema.literal('Cron Based'),
  ]),
  schedule: schema.any(),
});

const interval = schema.object({
  interval: schema.object({
    period: schema.number(),
    // Refer to job scheduler SPI https://github.com/opendistro-for-elasticsearch/job-scheduler/blob/b333469c183a15ddbf496a690300cc9e34d937fb/spi/src/main/java/com/amazon/opendistroforelasticsearch/jobscheduler/spi/schedule/IntervalSchedule.java
    unit: schema.oneOf([
      schema.literal('MINUTES'),
      schema.literal('HOURS'),
      schema.literal('DAYS'),
    ]),
    start_time: schema.number(), // timeStamp
  }),
});

const cron = schema.object({
  corn: schema.object({
    expression: schema.string(),
    time_zone: schema.string(),
  }),
});

const email = schema.object({
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
    schema.literal('Saved Search'),
  ]),
  description: schema.string(),
  report_params: schema.conditional(
    schema.siblingRef('report_source'),
    'Saved Search',
    data_report_params,
    visual_report_params
  ),

  delivery: schema.maybe(
    schema.object({
      channel: schema.oneOf([
        schema.literal('Email'),
        schema.literal('Slack'),
        schema.literal('Chime'),
        schema.literal('Kibana User'),
      ]),
      delivery_params: schema.any(), //TODO: no validation on delivery settings for now, because @kbn/config-schema has no support for more than 2 conditions
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
        schema.any(), // TODO: add alerting schema here once we finished the design for alerting integration
        schedule
      ),
    })
  ),
});

// export type ReportSchemaType = TypeOf<typeof reportSchema>;
