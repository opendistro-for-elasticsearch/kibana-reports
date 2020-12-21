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
// import com.amazon.opendistroforelasticsearch.reportsscheduler.action.CreateReportDefinitionAction
// import com.amazon.opendistroforelasticsearch.reportsscheduler.action.DeleteReportDefinitionAction
// import com.amazon.opendistroforelasticsearch.reportsscheduler.action.GetReportDefinitionAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportDefinitionActions
// import com.amazon.opendistroforelasticsearch.reportsscheduler.action.UpdateReportDefinitionAction
// import com.amazon.opendistroforelasticsearch.reportsscheduler.model.CreateReportDefinitionRequest
// import com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionRequest
// import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionRequest
// import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_DEFINITION_ID_FIELD
// import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportDefinitionRequest
// import com.amazon.opendistroforelasticsearch.reportsscheduler.util.contentParserNextToken
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for getting reporting backend stats
 * This handler uses [ReportDefinitionActions]. TODO: change this
 */
internal class ReportStatsRestHandler : BaseRestHandler() {
    companion object {
        private const val REPORT_STATS_ACTION = "report_definition_stats"
        private const val REPORT_STATS_URL = "$BASE_REPORTS_URI/stats"
        public const val COUNT = 4
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return REPORT_STATS_ACTION
    }

    /**
     * {@inheritDoc}
     */
    override fun routes(): List<Route> {
        return listOf(
            /**
             * Get reporting backend stats
             * Request URL: GET REPORT_STATS_URL
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionResponse]
             */
            Route(GET, "$REPORT_STATS_URL")
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf()
    }

    /**
     * {@inheritDoc}
     */
    override fun prepareRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        return when (request.method()) {
            GET -> RestChannelConsumer {
//                it.sendResponse(BytesRestResponse(RestStatus.OK, Metrics.getInstance().collectToJSON()))
                it.sendResponse(BytesRestResponse(RestStatus.OK, Metrics.getInstance().collectToFlattenedJSON()))
            }
            else -> RestChannelConsumer {
                it.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
            }
        }
    }
}
