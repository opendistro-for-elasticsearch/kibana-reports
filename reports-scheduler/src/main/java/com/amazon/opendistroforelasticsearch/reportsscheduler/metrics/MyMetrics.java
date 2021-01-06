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
 *
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.metrics;

import com.github.wnameless.json.unflattener.JsonUnflattener;
import org.json.JSONObject;

public enum MyMetrics {

    REQUEST_TOTAL("request_total", new BasicCounter()),
    REQUEST_INTERVAL_COUNT("request_count", new RollingCounter()),
    REQUEST_SUCCESS("success_count", new RollingCounter()),
    REQUEST_USER_ERROR("failed_request_count_user_error", new RollingCounter()),
    REQUEST_SYSTEM_ERROR("failed_request_count_system_error", new RollingCounter()),

    /**
     * Exceptions from:
     * @see com.amazon.opendistroforelasticsearch.reportsscheduler.action.PluginBaseAction
     */
    REPORT_EXCEPTIONS_ES_STATUS_EXCEPTION("exception.es_status", new RollingCounter()),
    REPORT_EXCEPTIONS_ES_SECURITY_EXCEPTION("exception.es_security", new RollingCounter()),
    REPORT_EXCEPTIONS_VERSION_CONFLICT_ENGINE_EXCEPTION("exception.version_conflict_engine", new RollingCounter()),
    REPORT_EXCEPTIONS_INDEX_NOT_FOUND_EXCEPTION("exception.index_not_found", new RollingCounter()),
    REPORT_EXCEPTIONS_INVALID_INDEX_NAME_EXCEPTION("exception.invalid_index_name", new RollingCounter()),
    REPORT_EXCEPTIONS_ILLEGAL_ARGUMENT_EXCEPTION("exception.illegal_argument", new RollingCounter()),
    REPORT_EXCEPTIONS_ILLEGAL_STATE_EXCEPTION("exception.illegal_state", new RollingCounter()),
    REPORT_EXCEPTIONS_IO_EXCEPTION("exception.io", new RollingCounter()),
    REPORT_EXCEPTIONS_INTERNAL_SERVER_ERROR("exception.internal_server_error", new RollingCounter()),

    /**
     * Per REST endpoint metrics
     */
    REPORT_DEFINITION_CREATE_TOTAL("report_definition.create.total", new BasicCounter()),
    REPORT_DEFINITION_CREATE_INTERVAL_COUNT("report_definition.create.count", new RollingCounter()),
    REPORT_DEFINITION_CREATE_USER_ERROR("report_definition.create.user_error", new RollingCounter()),
    REPORT_DEFINITION_CREATE_SYSTEM_ERROR("report_definition.create.system_error", new RollingCounter()),

    REPORT_DEFINITION_UPDATE_TOTAL("report_definition.update.total", new BasicCounter()),
    REPORT_DEFINITION_UPDATE_INTERVAL_COUNT("report_definition.update.count", new RollingCounter()),
    REPORT_DEFINITION_UPDATE_USER_ERROR("report_definition.update.user_error", new RollingCounter()),
    REPORT_DEFINITION_UPDATE_SYSTEM_ERROR("report_definition.update.system_error", new RollingCounter()),

    REPORT_DEFINITION_INFO_TOTAL("report_definition.info.total", new BasicCounter()),
    REPORT_DEFINITION_INFO_INTERVAL_COUNT("report_definition.info.count", new RollingCounter()),
    REPORT_DEFINITION_INFO_USER_ERROR("report_definition.info.user_error", new RollingCounter()),
    REPORT_DEFINITION_INFO_SYSTEM_ERROR("report_definition.info.system_error", new RollingCounter()),

    REPORT_DEFINITION_DELETE_TOTAL("report_definition.delete.total", new BasicCounter()),
    REPORT_DEFINITION_DELETE_INTERVAL_COUNT("report_definition.delete.count", new RollingCounter()),
    REPORT_DEFINITION_DELETE_USER_ERROR("report_definition.delete.user_error", new RollingCounter()),
    REPORT_DEFINITION_DELETE_SYSTEM_ERROR("report_definition.delete.system_error", new RollingCounter()),

    REPORT_DEFINITION_LIST_TOTAL("report_definition.list.total",new BasicCounter()),
    REPORT_DEFINITION_LIST_INTERVAL_COUNT("report_definition.list.count", new RollingCounter()),
    REPORT_DEFINITION_LIST_USER_ERROR("report_definition.list.user_error", new RollingCounter()),
    REPORT_DEFINITION_LIST_SYSTEM_ERROR("report_definition.list.system_error", new RollingCounter()),

    REPORT_INSTANCE_UPDATE_TOTAL("report_instance.update.total", new BasicCounter()),
    REPORT_INSTANCE_UPDATE_INTERVAL_COUNT("report_instance.update.count", new RollingCounter()),
    REPORT_INSTANCE_UPDATE_USER_ERROR("report_instance.update.user_error", new RollingCounter()),
    REPORT_INSTANCE_UPDATE_SYSTEM_ERROR("report_instance.update.system_error", new RollingCounter()),

    REPORT_INSTANCE_INFO_TOTAL("report_instance.info.total", new BasicCounter()),
    REPORT_INSTANCE_INFO_INTERVAL_COUNT("report_instance.info.count", new RollingCounter()),
    REPORT_INSTANCE_INFO_USER_ERROR("report_instance.info.user_error", new RollingCounter()),
    REPORT_INSTANCE_INFO_SYSTEM_ERROR("report_instance.info.system_error", new RollingCounter()),

    REPORT_INSTANCE_LIST_TOTAL("report_instance.list.total", new BasicCounter()),
    REPORT_INSTANCE_LIST_INTERVAL_COUNT("report_instance.list.count", new RollingCounter()),
    REPORT_INSTANCE_LIST_USER_ERROR("report_instance.list.user_error", new RollingCounter()),
    REPORT_INSTANCE_LIST_SYSTEM_ERROR("report_instance.list.system_error", new RollingCounter()),

    REPORT_FROM_DEFINITION_TOTAL("on_demand.create.total", new BasicCounter()),
    REPORT_FROM_DEFINITION_INTERVAL_COUNT("on_demand.create.count", new RollingCounter()),
    REPORT_FROM_DEFINITION_USER_ERROR("on_demand.create.user_error", new RollingCounter()),
    REPORT_FROM_DEFINITION_SYSTEM_ERROR("on_demand.create.system_error", new RollingCounter()),

    REPORT_FROM_DEFINITION_ID_TOTAL("on_demand_from_definition.create.total", new BasicCounter()),
    REPORT_FROM_DEFINITION_ID_INTERVAL_COUNT("on_demand_from_definition.create.count", new RollingCounter()),
    REPORT_FROM_DEFINITION_ID_USER_ERROR("on_demand_from_definition.create.user_error", new RollingCounter()),
    REPORT_FROM_DEFINITION_ID_SYSTEM_ERROR("on_demand_from_definition.create.system_error", new RollingCounter()),

    REPORT_SECURITY_PERMISSION_ERROR("es_security_permission_error",  new RollingCounter()),
    REPORT_PERMISSION_USER_ERROR("permission_user_error",  new RollingCounter());
    

    private final String name;
    private final Counter<?> counter;

    MyMetrics(String name, Counter<?> counter) {
        this.name = name;
        this.counter = counter;
    }

    public String getName() {
        return name;
    }

    public Counter<?> getCounter() {
        return counter;
    }

    private static final MyMetrics[] values = values();

    //TODO: use json and remove org.json dependencies
    public static String collectToJSON() {
        JSONObject metricsJSONObject = new JSONObject();

        for (MyMetrics metric: values) {
            metricsJSONObject.put(metric.name, metric.counter.getValue());
        }
        return metricsJSONObject.toString();
    }

    public static String collectToFlattenedJSON() {
        return JsonUnflattener.unflatten(collectToJSON());
    }
}
