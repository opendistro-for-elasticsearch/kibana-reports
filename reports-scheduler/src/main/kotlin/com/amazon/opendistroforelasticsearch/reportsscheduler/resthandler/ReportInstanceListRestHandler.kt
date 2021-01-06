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
package com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler

import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.BASE_REPORTS_URI
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.GetAllReportInstancesAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportInstanceActions
// import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
// import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.MetricName
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.MyMetrics
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportInstancesRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.FROM_INDEX_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.MAX_ITEMS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for getting list of report instances.
 * This handler uses [ReportInstanceActions].
 */
internal class ReportInstanceListRestHandler : BaseRestHandler() {
    companion object {
        private const val REPORT_INSTANCE_LIST_ACTION = "report_instance_list_actions"
        private const val LIST_REPORT_INSTANCES_URL = "$BASE_REPORTS_URI/instances"
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return REPORT_INSTANCE_LIST_ACTION
    }

    /**
     * {@inheritDoc}
     */
    override fun routes(): List<Route> {
        return listOf(
            /**
             * Get all report instances (from optional fromIndex)
             * Request URL: GET LIST_REPORT_INSTANCES_URL[?[fromIndex=1000]&[maxItems=100]]
             * Request body: None
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportInstancesResponse]
             */
            Route(GET, LIST_REPORT_INSTANCES_URL)
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf(FROM_INDEX_FIELD, MAX_ITEMS_FIELD)
    }

    /**
     * {@inheritDoc}
     */
    override fun prepareRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        val from = request.param(FROM_INDEX_FIELD)?.toIntOrNull() ?: 0
        val maxItems = request.param(MAX_ITEMS_FIELD)?.toIntOrNull() ?: PluginSettings.defaultItemsQueryCount
        return when (request.method()) {
            GET -> RestChannelConsumer {
                MyMetrics.REPORT_INSTANCE_LIST_TOTAL.counter.increment()
                MyMetrics.REPORT_INSTANCE_LIST_INTERVAL_COUNT.counter.increment()
                client.execute(GetAllReportInstancesAction.ACTION_TYPE,
                    GetAllReportInstancesRequest(from, maxItems),
                    RestResponseToXContentListener(it))
            }
            else -> RestChannelConsumer {
                it.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
            }
        }
    }
}
