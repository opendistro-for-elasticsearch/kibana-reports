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

package com.amazon.opendistroforelasticsearch.reportsscheduler.metrics;

//enum class MetricName(val metricName: String, val value: Int, val numerical: Boolean) {
//
//    REPORT_DEFINITION_CREATE_COUNT("report_definition_create_count", COUNT, true),
//    REPORT_DEFINITION_CREATE_USER_ERROR("report_definition_create_user_error", COUNT, true),
//    REPORT_DEFINITION_CREATE_SYSTEM_ERROR("report_definition_create_system_error", COUNT, true),
//    REPORT_DEFINITION_UPDATE_COUNT("report_definition_update_count", COUNT, true),
//    REPORT_DEFINITION_UPDATE_USER_ERROR("report_definition_update_user_error", COUNT, true),
//    REPORT_DEFINITION_UPDATE_SYSTEM_ERROR("report_definition_update_system_error", COUNT, true),
//    REPORT_DEFINITION_DELETE_COUNT("report_definition_delete_count", COUNT, true),
//    REPORT_DEFINITION_DELETE_USER_ERROR("report_definition_delete_user_error", COUNT, true),
//    REPORT_DEFINITION_DELETE_SYSTEM_ERROR("report_definition_delete_system_error", COUNT, true),
//    REPORT_DEFINITION_LIST_COUNT("report_definition_list_count", COUNT, true),
//    REPORT_DEFINITION_LIST_USER_ERROR("report_definition_list_user_error", COUNT, true),
//    REPORT_DEFINITION_LIST_SYSTEM_ERROR("report_definition_list_system_error", COUNT, true),
//
//    REPORT_INSTANCE_LIST_COUNT("report_instance_list_count", COUNT, true),
//    REPORT_INSTANCE_LIST_USER_ERROR("report_instance_list_user_error", COUNT, true),
//    REPORT_INSTANCE_LIST_SYSTEM_ERROR("report_instance_list_system_error", COUNT, true)
//}


import com.google.common.collect.ImmutableSet;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public enum MetricName {
    REQ_TOTAL("request_total"),
    REQ_COUNT_TOTAL("request_count"),
    FAILED_REQ_COUNT_SYS("failed_request_count_syserr"),
    FAILED_REQ_COUNT_CUS("failed_request_count_cuserr"),
    FAILED_REQ_COUNT_CB("failed_request_count_cb"),
    DEFAULT_CURSOR_REQUEST_TOTAL("default_cursor_request_total"),
    DEFAULT_CURSOR_REQUEST_COUNT_TOTAL("default_cursor_request_count"),
    DEFAULT("default"),

    PPL_REQ_TOTAL("ppl_request_total"),
    PPL_REQ_COUNT_TOTAL("ppl_request_count"),
    PPL_FAILED_REQ_COUNT_SYS("ppl_failed_request_count_syserr"),
    PPL_FAILED_REQ_COUNT_CUS("ppl_failed_request_count_cuserr");

    private String name;

    MetricName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static List<String> getNames() {
        return Arrays.stream(MetricName.values()).map(v -> v.name).collect(Collectors.toList());
    }


    private static Set<MetricName> NUMERICAL_METRIC = new ImmutableSet.Builder<MetricName>()
        .add(PPL_REQ_TOTAL)
        .add(PPL_REQ_COUNT_TOTAL)
        .add(PPL_FAILED_REQ_COUNT_SYS)
        .add(PPL_FAILED_REQ_COUNT_CUS)
        .build();

    public boolean isNumerical() {
        return this == REQ_TOTAL || this == REQ_COUNT_TOTAL || this == FAILED_REQ_COUNT_SYS
            || this == FAILED_REQ_COUNT_CUS || this == FAILED_REQ_COUNT_CB || this == DEFAULT
            || this == DEFAULT_CURSOR_REQUEST_TOTAL || this == DEFAULT_CURSOR_REQUEST_COUNT_TOTAL
            || NUMERICAL_METRIC.contains(this);
    }
}


