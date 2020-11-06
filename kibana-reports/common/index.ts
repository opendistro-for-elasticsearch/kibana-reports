export const PLUGIN_ID = 'opendistroKibanaReports';
export const PLUGIN_NAME = 'opendistro_kibana_reports';

export const API_PREFIX = '/api/reporting';
export const REPORTS_SCHEDULER_API = {
  SCHEDULE_BASE: '/_opendistro/reports_scheduler/schedule',
  JOB_BASE: '/_opendistro/reports_scheduler/job',
};

export const NOTIFICATION_API = {
  SEND: '/_opendistro/_notifications/send',
};

const BASE_REPORTS_URI = '/_opendistro/_reports';

export const ES_REPORTS_API = {
  ON_DEMAND_REPORT: `${BASE_REPORTS_URI}/on-demand`,
  REPORT_INSTANCE: `${BASE_REPORTS_URI}/instance`,
  LIST_REPORT_INSTANCES: `${BASE_REPORTS_URI}/instances`,
  REPORT_DEFINITION: `${BASE_REPORTS_URI}/definition`,
  LIST_REPORT_DEFINITIONS: `${BASE_REPORTS_URI}/definitions`,
  POLL_REPORT_INSTANCE: `${BASE_REPORTS_URI}/poll_instance`,
};
