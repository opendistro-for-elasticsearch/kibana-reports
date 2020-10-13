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
import com.amazon.opendistroforelasticsearch.reportsscheduler.action.ReportsJobActionHandler
import com.google.common.collect.ImmutableList
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.cluster.service.ClusterService
import org.elasticsearch.rest.BaseRestHandler
import org.elasticsearch.rest.BaseRestHandler.RestChannelConsumer
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestHandler
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus

/**
 * Rest handler for polling/managing jobs.
 * This handler [ReportsJobActionHandler] for job handling.
 */
internal class ReportsJobRestHandler(private val clusterService: ClusterService) : BaseRestHandler() {
    companion object {
        private const val SCHEDULER_JOB_ACTION = "reports_scheduler_job_action"
        private const val JOB = "job"
        private const val JOB_ID = "job_id"
        private const val JOB_ID_URL = "$BASE_SCHEDULER_URI/$JOB/{$JOB_ID}"
        private const val JOB_URL = "$BASE_SCHEDULER_URI/$JOB"
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return SCHEDULER_JOB_ACTION
    }

    /**
     * {@inheritDoc}
     */
    override fun routes(): List<RestHandler.Route> {
        return ImmutableList.of(
            // update job status, release lock and remove job from queue.
            // POST /_opendistro/reports_scheduler/job/{job_id}
            RestHandler.Route(RestRequest.Method.POST, JOB_ID_URL),
            // get triggered jobs from jobs queue.
            // GET /_opendistro/reports_scheduler/job
            RestHandler.Route(RestRequest.Method.GET, JOB_URL)
        )
    }

    /**
     * {@inheritDoc}
     */
    override fun prepareRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        val jobId = request.param(JOB_ID)
        return RestChannelConsumer { channel: RestChannel ->
            val handler = ReportsJobActionHandler(client, channel, clusterService)
            when {
                request.method() == RestRequest.Method.POST -> handler.updateJob(jobId)
                request.method() == RestRequest.Method.GET -> handler.getJob()
                else -> channel.sendResponse(
                    BytesRestResponse(
                        RestStatus.METHOD_NOT_ALLOWED, "${request.method()} is not allowed."))
            }
        }
    }
}
