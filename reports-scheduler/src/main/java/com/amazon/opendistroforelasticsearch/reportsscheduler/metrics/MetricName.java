/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

package com.amazon.opendistroforelasticsearch.reportsscheduler.metrics;

public enum MetricName {

    REQUEST_TOTAL("request_total", true),
    REQUEST_INTERVAL_COUNT("request_count", true),
    REQUEST_SUCCESS("success_count", true),
    REQUEST_USER_ERROR("failed_request_count_user_error", true),
    REQUEST_SYSTEM_ERROR("failed_request_count_system_error", true),

    /**
     * Exceptions from:
     * @see com.amazon.opendistroforelasticsearch.reportsscheduler.action.PluginBaseAction
     */
    REPORT_EXCEPTIONS_ES_STATUS_EXCEPTION("exception.es_status", true),
    REPORT_EXCEPTIONS_ES_SECURITY_EXCEPTION("exception.es_security", true),
    REPORT_EXCEPTIONS_VERSION_CONFLICT_ENGINE_EXCEPTION("exception.version_conflict_engine", true),
    REPORT_EXCEPTIONS_INDEX_NOT_FOUND_EXCEPTION("exception.index_not_found", true),
    REPORT_EXCEPTIONS_INVALID_INDEX_NAME_EXCEPTION("exception.invalid_index_name", true),
    REPORT_EXCEPTIONS_ILLEGAL_ARGUMENT_EXCEPTION("exception.illegal_argument", true),
    REPORT_EXCEPTIONS_ILLEGAL_STATE_EXCEPTION("exception.illegal_state", true),
    REPORT_EXCEPTIONS_IO_EXCEPTION("exception.io", true),
    REPORT_EXCEPTIONS_INTERNAL_SERVER_ERROR("exception.internal_server_error", true),

    /**
     * Per REST endpoint metrics
     */
    REPORT_DEFINITION_CREATE_TOTAL("report_definition.create.total", true),
    REPORT_DEFINITION_CREATE_INTERVAL_COUNT("report_definition.create.count", true),
    REPORT_DEFINITION_CREATE_USER_ERROR("report_definition.create.user_error", true),
    REPORT_DEFINITION_CREATE_SYSTEM_ERROR("report_definition.create.system_error", true),

    REPORT_DEFINITION_UPDATE_TOTAL("report_definition.update.total", true),
    REPORT_DEFINITION_UPDATE_INTERVAL_COUNT("report_definition.update.count", true),
    REPORT_DEFINITION_UPDATE_USER_ERROR("report_definition.update.user_error", true),
    REPORT_DEFINITION_UPDATE_SYSTEM_ERROR("report_definition.update.system_error", true),

    REPORT_DEFINITION_INFO_TOTAL("report_definition.info.total", true),
    REPORT_DEFINITION_INFO_INTERVAL_COUNT("report_definition.info.count", true),
    REPORT_DEFINITION_INFO_USER_ERROR("report_definition.info.user_error", true),
    REPORT_DEFINITION_INFO_SYSTEM_ERROR("report_definition.info.system_error", true),

    REPORT_DEFINITION_DELETE_TOTAL("report_definition.delete.total", true),
    REPORT_DEFINITION_DELETE_INTERVAL_COUNT("report_definition.delete.count", true),
    REPORT_DEFINITION_DELETE_USER_ERROR("report_definition.delete.user_error", true),
    REPORT_DEFINITION_DELETE_SYSTEM_ERROR("report_definition.delete.system_error", true),

    REPORT_DEFINITION_LIST_TOTAL("report_definition.list.total", true),
    REPORT_DEFINITION_LIST_INTERVAL_COUNT("report_definition.list.count", true),
    REPORT_DEFINITION_LIST_USER_ERROR("report_definition.list.user_error", true),
    REPORT_DEFINITION_LIST_SYSTEM_ERROR("report_definition.list.system_error", true),

    REPORT_INSTANCE_UPDATE_TOTAL("report_instance.update.total", true),
    REPORT_INSTANCE_UPDATE_INTERVAL_COUNT("report_instance.update.count", true),
    REPORT_INSTANCE_UPDATE_USER_ERROR("report_instance.update.user_error", true),
    REPORT_INSTANCE_UPDATE_SYSTEM_ERROR("report_instance.update.system_error", true),

    REPORT_INSTANCE_INFO_TOTAL("report_instance.info.total", true),
    REPORT_INSTANCE_INFO_INTERVAL_COUNT("report_instance.info.count", true),
    REPORT_INSTANCE_INFO_USER_ERROR("report_instance.info.user_error", true),
    REPORT_INSTANCE_INFO_SYSTEM_ERROR("report_instance.info.system_error", true),

    REPORT_INSTANCE_LIST_TOTAL("report_instance.list.total", true),
    REPORT_INSTANCE_LIST_INTERVAL_COUNT("report_instance.list.count", true),
    REPORT_INSTANCE_LIST_USER_ERROR("report_instance.list.user_error", true),
    REPORT_INSTANCE_LIST_SYSTEM_ERROR("report_instance.list.system_error", true),

    REPORT_FROM_DEFINITION_TOTAL("on_demand.create.total", true),
    REPORT_FROM_DEFINITION_INTERVAL_COUNT("on_demand.create.count", true),
    REPORT_FROM_DEFINITION_USER_ERROR("on_demand.create.user_error", true),
    REPORT_FROM_DEFINITION_SYSTEM_ERROR("on_demand.create.system_error", true),

    REPORT_FROM_DEFINITION_ID_TOTAL("on_demand_from_definition.create.total", true),
    REPORT_FROM_DEFINITION_ID_INTERVAL_COUNT("on_demand_from_definition.create.count", true),
    REPORT_FROM_DEFINITION_ID_USER_ERROR("on_demand_from_definition.create.user_error", true),
    REPORT_FROM_DEFINITION_ID_SYSTEM_ERROR("on_demand_from_definition.create.system_error", true),

    REPORT_SECURITY_PERMISSION_ERROR("es_security_permission_error", true),
    REPORT_PERMISSION_USER_ERROR("permission_user_error", true),

    DEFAULT("default", true);

    private final String name;
    private final boolean numerical;

    MetricName(String name, boolean numerical) {
        this.name = name;
        this.numerical = numerical;
    }

    public String getName() {
        return name;
    }

    public boolean isNumerical() {
        return numerical;
    }
}


