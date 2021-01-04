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

public class MetricFactory {
    public static Metric<?> createMetric(MetricName name) {

        switch (name) {
            case REPORT_DEFINITION_CREATE_TOTAL:
            case REPORT_DEFINITION_UPDATE_TOTAL:
            case REPORT_DEFINITION_INFO_TOTAL:
            case REPORT_DEFINITION_DELETE_TOTAL:
            case REPORT_DEFINITION_LIST_TOTAL:
            case REPORT_INSTANCE_UPDATE_TOTAL:
            case REPORT_INSTANCE_INFO_TOTAL:
            case REPORT_INSTANCE_LIST_TOTAL:
            case REPORT_FROM_DEFINITION_TOTAL:
            case REPORT_FROM_DEFINITION_ID_TOTAL:
            case DEFAULT:
                return new NumericMetric<>(name.getName(), new BasicCounter());

            case REPORT_DEFINITION_CREATE_INTERVAL_COUNT:
            case REPORT_DEFINITION_CREATE_USER_ERROR:
            case REPORT_DEFINITION_CREATE_SYSTEM_ERROR:

            case REPORT_DEFINITION_UPDATE_INTERVAL_COUNT:
            case REPORT_DEFINITION_UPDATE_USER_ERROR:
            case REPORT_DEFINITION_UPDATE_SYSTEM_ERROR:

            case REPORT_DEFINITION_INFO_INTERVAL_COUNT:
            case REPORT_DEFINITION_INFO_USER_ERROR:
            case REPORT_DEFINITION_INFO_SYSTEM_ERROR:

            case REPORT_DEFINITION_DELETE_INTERVAL_COUNT:
            case REPORT_DEFINITION_DELETE_USER_ERROR:
            case REPORT_DEFINITION_DELETE_SYSTEM_ERROR:

            case REPORT_DEFINITION_LIST_INTERVAL_COUNT:
            case REPORT_DEFINITION_LIST_USER_ERROR:
            case REPORT_DEFINITION_LIST_SYSTEM_ERROR:

            case REPORT_INSTANCE_UPDATE_INTERVAL_COUNT:
            case REPORT_INSTANCE_UPDATE_USER_ERROR:
            case REPORT_INSTANCE_UPDATE_SYSTEM_ERROR:

            case REPORT_INSTANCE_INFO_INTERVAL_COUNT:
            case REPORT_INSTANCE_INFO_USER_ERROR:
            case REPORT_INSTANCE_INFO_SYSTEM_ERROR:

            case REPORT_INSTANCE_LIST_INTERVAL_COUNT:
            case REPORT_INSTANCE_LIST_USER_ERROR:
            case REPORT_INSTANCE_LIST_SYSTEM_ERROR:

            case REPORT_FROM_DEFINITION_INTERVAL_COUNT:
            case REPORT_FROM_DEFINITION_USER_ERROR:
            case REPORT_FROM_DEFINITION_SYSTEM_ERROR:

            case REPORT_FROM_DEFINITION_ID_INTERVAL_COUNT:
            case REPORT_FROM_DEFINITION_ID_USER_ERROR:
            case REPORT_FROM_DEFINITION_ID_SYSTEM_ERROR:

            case REPORT_PERMISSION_USER_ERROR:
                return new NumericMetric<>(name.getName(), new RollingCounter());
            default:
                return new NumericMetric<>(name.getName(), new BasicCounter());
        }
    }
}
