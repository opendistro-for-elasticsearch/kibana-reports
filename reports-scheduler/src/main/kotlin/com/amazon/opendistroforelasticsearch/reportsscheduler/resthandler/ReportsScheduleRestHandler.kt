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

import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.BASE_SCHEDULER_URI
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportsScheduleActionHandler
import com.google.common.collect.ImmutableList
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestHandler
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for scheduling reports.
 * This handler [ReportsScheduleActionHandler] for scheduling.
 */
internal class ReportsScheduleRestHandler : BaseRestHandler() {
    companion object {
        private const val SCHEDULER_SCHEDULE_ACTION = "reports_scheduler_schedule_action"
        private const val SCHEDULE = "schedule"
        private const val JOB_ID = "job_id"
        private const val SCHEDULE_URL = "$BASE_SCHEDULER_URI/$SCHEDULE"
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return SCHEDULER_SCHEDULE_ACTION
    }

    /**
     * {@inheritDoc}
     */
    override fun routes(): List<RestHandler.Route> {
        return ImmutableList.of(
            // create a scheduled job from report definition
            // POST /_opendistro/reports_scheduler/schedule?job_id=<job_id>
            RestHandler.Route(RestRequest.Method.POST, SCHEDULE_URL),
            // de-schedule a job
            // DELETE /_opendistro/reports_scheduler/schedule?job_id=<job_id>
            RestHandler.Route(RestRequest.Method.DELETE, SCHEDULE_URL)
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun prepareRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        val jobId = request.param(JOB_ID) ?: throw IllegalArgumentException("Must specify id")
        return RestChannelConsumer { channel: RestChannel ->
            val handler = ReportsScheduleActionHandler(client, channel)
            when {
                request.method() == RestRequest.Method.POST -> handler.createSchedule(jobId, request)
                request.method() == RestRequest.Method.DELETE -> handler.deleteSchedule(jobId)
                else -> channel.sendResponse(
                    BytesRestResponse(
                        RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed."))
            }
        }
    }
}
