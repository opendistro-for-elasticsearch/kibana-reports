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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.GetReportInstanceAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportInstanceActions
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.UpdateReportInstanceStatusAction
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.MetricName
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportInstanceRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_INSTANCE_ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.contentParserNextToken
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestHandler.Route
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestRequest.Method.GET
import org.elasticsearch.rest.RestRequest.Method.POST
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for report instances lifecycle management.
 * This handler uses [ReportInstanceActions].
 */
internal class ReportInstanceRestHandler : BaseRestHandler() {
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
             * Request URL: POST REPORT_INSTANCE_URL/{reportInstanceId}
             * Request body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusRequest]
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusResponse]
             */
            Route(POST, "$REPORT_INSTANCE_URL/{$REPORT_INSTANCE_ID_FIELD}"),
            /**
             * Get a report instance information
             * Request URL: GET REPORT_INSTANCE_URL/{reportInstanceId}
             * Request body: None
             * Response body: Ref [com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportInstanceResponse]
             */
            Route(GET, "$REPORT_INSTANCE_URL/{$REPORT_INSTANCE_ID_FIELD}")
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun responseParams(): Set<String> {
        return setOf(REPORT_INSTANCE_ID_FIELD)
    }

    /**
     * {@inheritDoc}
     */
    override fun prepareRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        val reportInstanceId = request.param(REPORT_INSTANCE_ID_FIELD) ?: throw IllegalArgumentException("Must specify id")
        return when (request.method()) {
            POST -> RestChannelConsumer {
                Metrics.getInstance().getNumericalMetric(MetricName.REPORT_INSTANCE_UPDATE_TOTAL).increment()
                Metrics.getInstance().getNumericalMetric(MetricName.REPORT_INSTANCE_UPDATE_INTERVAL_COUNT).increment()
                client.execute(UpdateReportInstanceStatusAction.ACTION_TYPE,
                    UpdateReportInstanceStatusRequest.parse(request.contentParserNextToken(), reportInstanceId),
                    RestResponseToXContentListener(it))
            }
            GET -> RestChannelConsumer {
                Metrics.getInstance().getNumericalMetric(MetricName.REPORT_INSTANCE_INFO_TOTAL).increment()
                Metrics.getInstance().getNumericalMetric(MetricName.REPORT_INSTANCE_INFO_INTERVAL_COUNT).increment()
                client.execute(GetReportInstanceAction.ACTION_TYPE,
                    GetReportInstanceRequest(reportInstanceId),
                    RestResponseToXContentListener(it))
            }
            else -> RestChannelConsumer {
                it.sendResponse(BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed"))
            }
        }
    }
}
