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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.GetAllReportDefinitionsAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportDefinitionActions
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportDefinitionsRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.FROM_INDEX_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.MAX_ITEMS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings

import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for getting list of report definitions.
 * This handler uses [ReportDefinitionActions].
 */
internal class ReportDefinitionListRestHandler : PluginBaseHandler() {
    companion object {
        private const val REPORT_DEFINITION_LIST_ACTION = "report_definition_list_actions"
        private const val LIST_REPORT_DEFINITIONS_URL = "$BASE_REPORTS_URI/definitions"
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return REPORT_DEFINITION_LIST_ACTION
    }

    /**
     * {@inheritDoc}
     */
    override fun routes(): List<Route> {
        return listOf(
            /**
             * Get all report definitions (from optional fromIndex)
             * Request URL: GET LIST_REPORT_DEFINITIONS_URL[?[fromIndex=1000]&[maxItems=100]]
             * Request body: None
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportDefinitionsResponse]
             */
            Route(GET, LIST_REPORT_DEFINITIONS_URL)
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun executeRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        val from = request.param(FROM_INDEX_FIELD)?.toIntOrNull() ?: 0
        val maxItems = request.param(MAX_ITEMS_FIELD)?.toIntOrNull() ?: PluginSettings.defaultItemsQueryCount
        return when (request.method()) {
            GET -> RestChannelConsumer {
                Metrics.REPORT_DEFINITION_LIST_TOTAL.counter.increment()
                Metrics.REPORT_DEFINITION_LIST_INTERVAL_COUNT.counter.increment()
                client.execute(GetAllReportDefinitionsAction.ACTION_TYPE,
                    GetAllReportDefinitionsRequest(from, maxItems),
                    RestResponseToXContentListener(it))
            }
            else -> RestChannelConsumer {
                it.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf(FROM_INDEX_FIELD, MAX_ITEMS_FIELD)
    }
}
