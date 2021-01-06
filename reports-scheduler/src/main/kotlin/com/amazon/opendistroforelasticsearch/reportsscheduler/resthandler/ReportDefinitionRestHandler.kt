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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.CreateReportDefinitionAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.DeleteReportDefinitionAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.GetReportDefinitionAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportDefinitionActions
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.UpdateReportDefinitionAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.CreateReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_DEFINITION_ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.contentParserNextToken
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.DELETE
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestRequest.Method.POST
import org.elasticsearch.rest.RestRequest.Method.PUT
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for report definitions lifecycle management.
 * This handler uses [ReportDefinitionActions].
 */
internal class ReportDefinitionRestHandler : PluginBaseHandler() {
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
            /**
             * Create a new report definition
             * Request URL: POST REPORT_DEFINITION_URL
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.CreateReportDefinitionRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.CreateReportDefinitionResponse]
             */
            Route(POST, REPORT_DEFINITION_URL),
            /**
             * Update report definition
             * Request URL: PUT REPORT_DEFINITION_URL/{reportDefinitionId}
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportDefinitionRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportDefinitionResponse]
             */
            Route(PUT, "$REPORT_DEFINITION_URL/{$REPORT_DEFINITION_ID_FIELD}"),
            /**
             * Get a report definition
             * Request URL: GET REPORT_DEFINITION_URL/{reportDefinitionId}
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionResponse]
             */
            Route(GET, "$REPORT_DEFINITION_URL/{$REPORT_DEFINITION_ID_FIELD}"),
            /**
             * Delete report definition
             * Request URL: DELETE REPORT_DEFINITION_URL/{reportDefinitionId}
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionResponse]
             */
            Route(DELETE, "$REPORT_DEFINITION_URL/{$REPORT_DEFINITION_ID_FIELD}")
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf(REPORT_DEFINITION_ID_FIELD)
    }

    /**
     * {@inheritDoc}
     */
    override fun executeRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        return when (request.method()) {
            POST -> RestChannelConsumer {
                Metrics.REPORT_DEFINITION_CREATE_TOTAL.counter.increment()
                Metrics.REPORT_DEFINITION_CREATE_INTERVAL_COUNT.counter.increment()
                client.execute(CreateReportDefinitionAction.ACTION_TYPE,
                    CreateReportDefinitionRequest(request.contentParserNextToken()),
                    RestResponseToXContentListener(it))
            }
            PUT -> RestChannelConsumer {
                Metrics.REPORT_DEFINITION_UPDATE_TOTAL.counter.increment()
                Metrics.REPORT_DEFINITION_UPDATE_INTERVAL_COUNT.counter.increment()
                client.execute(
                    UpdateReportDefinitionAction.ACTION_TYPE,
                    UpdateReportDefinitionRequest(request.contentParserNextToken(), request.param(REPORT_DEFINITION_ID_FIELD)),
                    RestResponseToXContentListener(it))
            }
            GET -> RestChannelConsumer {
                Metrics.REPORT_DEFINITION_INFO_TOTAL.counter.increment()
                Metrics.REPORT_DEFINITION_INFO_INTERVAL_COUNT.counter.increment()
                client.execute(GetReportDefinitionAction.ACTION_TYPE,
                    GetReportDefinitionRequest(request.param(REPORT_DEFINITION_ID_FIELD)),
                    RestResponseToXContentListener(it))
            }
            DELETE -> RestChannelConsumer {
                Metrics.REPORT_DEFINITION_DELETE_TOTAL.counter.increment()
                Metrics.REPORT_DEFINITION_DELETE_INTERVAL_COUNT.counter.increment()
                client.execute(DeleteReportDefinitionAction.ACTION_TYPE,
                    DeleteReportDefinitionRequest(request.param(REPORT_DEFINITION_ID_FIELD)),
                    RestResponseToXContentListener(it))
            }
            else -> RestChannelConsumer {
                it.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
            }
        }
    }
}
