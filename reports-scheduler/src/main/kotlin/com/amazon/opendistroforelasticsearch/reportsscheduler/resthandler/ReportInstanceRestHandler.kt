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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportInstanceActions
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportInstanceRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.IRestResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestErrorResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusRequest
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestRequest.Method.POST
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for report instances lifecycle management.
 * This handler uses [ReportInstanceActions].
 */
internal class ReportInstanceRestHandler : PluginRestHandler() {
    companion object {
        private const val REPORT_INSTANCE_LIST_ACTION = "report_instance_actions"
        private const val REPORT_INSTANCE_URL = "$BASE_REPORTS_URI/instance"
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
             * Update report instance status
             * Request URL: POST REPORT_INSTANCE_URL?id=<reportInstanceId>
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusResponse]
             */
            Route(POST, REPORT_INSTANCE_URL),
            /**
             * Get a report instance information
             * Request URL: GET REPORT_INSTANCE_URL?id=<reportInstanceId>
             * Request body: None
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportInstanceResponse]
             */
            Route(GET, REPORT_INSTANCE_URL)
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
    override fun executeRequest(request: RestRequest, client: NodeClient, channel: RestChannel): IRestResponse {
        val reportInstanceId = request.param(ID_FIELD) ?: throw IllegalArgumentException("Must specify id")
        return when (request.method()) {
            POST -> {
                val parser = request.contentParser()
                parser.nextToken()
                ReportInstanceActions.update(UpdateReportInstanceStatusRequest.parse(parser, reportInstanceId))
            }
            GET -> ReportInstanceActions.info(GetReportInstanceRequest(reportInstanceId))
            else -> RestErrorResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed")
        }
    }
}
