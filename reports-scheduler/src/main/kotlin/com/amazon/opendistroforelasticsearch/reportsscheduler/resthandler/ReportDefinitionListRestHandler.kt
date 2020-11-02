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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportDefinitionActions
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportDefinitionsRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.IRestResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestErrorResponse
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for getting list of report definitions.
 * This handler uses [ReportDefinitionActions].
 */
internal class ReportDefinitionListRestHandler : PluginRestHandler() {
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
             * Request URL: GET LIST_REPORT_DEFINITIONS_URL[?fromIndex=1000]
             * Request body: None
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportDefinitionsResponse]
             */
            Route(GET, LIST_REPORT_DEFINITIONS_URL)
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf(FROM_INDEX_FIELD)
    }

    /**
     * {@inheritDoc}
     */
    override fun executeRequest(request: RestRequest, client: NodeClient, channel: RestChannel): IRestResponse {
        val from = request.param(FROM_INDEX_FIELD)?.toIntOrNull() ?: 0
        return when (request.method()) {
            GET -> ReportDefinitionActions.getAll(GetAllReportDefinitionsRequest(from))
            else -> RestErrorResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed")
        }
    }
}
