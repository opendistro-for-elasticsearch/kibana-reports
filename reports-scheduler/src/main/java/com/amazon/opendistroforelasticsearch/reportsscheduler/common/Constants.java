package com.amazon.opendistroforelasticsearch.reportsscheduler.common;

public class Constants {
    public static final String BASE_SCHEDULER_URI = "/_opendistro/reports_scheduler";
    public static final String JOB_INDEX_NAME = ".reports_scheduler";
    public static final String JOB_QUEUE_INDEX_NAME = ".reports_scheduler_job_queue";
    public static final Long LOCK_DURATION_SECONDS = 300L;
}
