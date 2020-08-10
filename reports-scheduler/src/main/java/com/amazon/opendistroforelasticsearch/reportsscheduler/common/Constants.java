/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.common;

public class Constants {
    public static final String BASE_SCHEDULER_URI = "/_opendistro/reports_scheduler";
    public static final String JOB_INDEX_NAME = ".reports_scheduler";
    public static final String JOB_QUEUE_INDEX_NAME = ".reports_scheduler_job_queue";
    public static final Long LOCK_DURATION_SECONDS = 300L;
}
