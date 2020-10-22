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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportDefinitionAction
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.DELETE
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestRequest.Method.POST
import org.elasticsearch.rest.RestRequest.Method.PUT
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for report definitions lifecycle management.
 * This handler uses [ReportDefinitionAction].
 */
internal class ReportDefinitionRestHandler : PluginRestHandler() {
    companion object {
        private const val REPORT_DEFINITION_ACTION = "report_definition_actions"
        private const val REPORT_DEFINITION_URL = "$BASE_REPORTS_URI/definition"
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return REPORT_DEFINITION_ACTION
    }

    /**
     * {@inheritDoc}
     */
    override fun routes(): List<Route> {
        return listOf(
            // create a new report definition
            // POST REPORT_DEFINITION_URL
            Route(POST, REPORT_DEFINITION_URL),
            // update report definition
            // PUT REPORT_DEFINITION_URL?id=<reportDefinitionId>
            Route(PUT, REPORT_DEFINITION_URL),
            // get a report definition
            // GET REPORT_DEFINITION_URL?id=<reportDefinitionId>
            Route(GET, REPORT_DEFINITION_URL),
            // delete report definition
            // DELETE REPORT_DEFINITION_URL?id=<reportDefinitionId>
            Route(DELETE, REPORT_DEFINITION_URL)
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf(ID_FIELD)
    }

    /**
     * {@inheritDoc}
     */
    override fun executeRequest(request: RestRequest, client: NodeClient, channel: RestChannel) {
        val handler = ReportDefinitionAction(request, client, channel)
        when (request.method()) {
            POST -> handler.create()
            PUT -> handler.update(request.param(ID_FIELD))
            GET -> handler.info(request.param(ID_FIELD))
            DELETE -> handler.delete(request.param(ID_FIELD))
            else -> channel.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
        }
    }
}
