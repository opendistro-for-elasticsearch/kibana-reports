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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportInstanceAction
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for getting list of report instances.
 * This handler uses [ReportInstanceAction].
 */
internal class ReportInstanceListRestHandler : PluginRestHandler() {
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
            // Get all report instances (from optional fromIndex)
            // GET LIST_REPORT_INSTANCES_URL[?fromIndex=1000]
            Route(GET, LIST_REPORT_INSTANCES_URL)
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
    override fun executeRequest(request: RestRequest, client: NodeClient, channel: RestChannel) {
        val from = request.param(FROM_INDEX_FIELD)?.toIntOrNull() ?: 0
        val handler = ReportInstanceAction(request, client, channel)
        when (request.method()) {
            GET -> handler.getAll(from)
            else -> channel.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
        }
    }
}
