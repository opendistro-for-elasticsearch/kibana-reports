/*
 *   Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.metrics

import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportStatsRestHandler.Companion.COUNT

enum class MetricName(val metricName: String, val value: Int, val numerical: Boolean) {

    REPORT_DEFINITION_CREATE_COUNT("report_definition_create_count", COUNT, true),
    REPORT_DEFINITION_CREATE_USER_ERROR("report_definition_create_user_error", COUNT, true),
    REPORT_DEFINITION_CREATE_SYSTEM_ERROR("report_definition_create_system_error", COUNT, true),
    REPORT_DEFINITION_UPDATE_COUNT("report_definition_update_count", COUNT, true),
    REPORT_DEFINITION_UPDATE_USER_ERROR("report_definition_update_user_error", COUNT, true),
    REPORT_DEFINITION_UPDATE_SYSTEM_ERROR("report_definition_update_system_error", COUNT, true),
    REPORT_DEFINITION_DELETE_COUNT("report_definition_delete_count", COUNT, true),
    REPORT_DEFINITION_DELETE_USER_ERROR("report_definition_delete_user_error", COUNT, true),
    REPORT_DEFINITION_DELETE_SYSTEM_ERROR("report_definition_delete_system_error", COUNT, true),
    REPORT_DEFINITION_LIST_COUNT("report_definition_list_count", COUNT, true),
    REPORT_DEFINITION_LIST_USER_ERROR("report_definition_list_user_error", COUNT, true),
    REPORT_DEFINITION_LIST_SYSTEM_ERROR("report_definition_list_system_error", COUNT, true),

    REPORT_INSTANCE_LIST_COUNT("report_instance_list_count", COUNT, true),
    REPORT_INSTANCE_LIST_USER_ERROR("report_instance_list_user_error", COUNT, true),
    REPORT_INSTANCE_LIST_SYSTEM_ERROR("report_instance_list_system_error", COUNT, true)
}
