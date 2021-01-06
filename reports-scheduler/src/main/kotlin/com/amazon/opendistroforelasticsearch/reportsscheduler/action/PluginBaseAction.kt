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

package com.amazon.opendistroforelasticsearch.reportsscheduler.action

import com.amazon.opendistroforelasticsearch.commons.ConfigConstants.OPENDISTRO_SECURITY_USER_INFO_THREAD_CONTEXT
import com.amazon.opendistroforelasticsearch.commons.authuser.User
// import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
// import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.MetricName
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.MyMetrics
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.elasticsearch.ElasticsearchSecurityException
import org.elasticsearch.ElasticsearchStatusException
import org.elasticsearch.action.ActionListener
import org.elasticsearch.action.ActionRequest
import org.elasticsearch.action.ActionResponse
import org.elasticsearch.action.support.ActionFilters
import org.elasticsearch.action.support.HandledTransportAction
import org.elasticsearch.client.Client
import org.elasticsearch.common.io.stream.Writeable
import org.elasticsearch.index.IndexNotFoundException
import org.elasticsearch.index.engine.VersionConflictEngineException
import org.elasticsearch.indices.InvalidIndexNameException
import org.elasticsearch.rest.RestStatus
import org.elasticsearch.tasks.Task
import org.elasticsearch.transport.TransportService
import java.io.IOException

abstract class PluginBaseAction<Request : ActionRequest, Response : ActionResponse>(
    name: String,
    transportService: TransportService,
    val client: Client,
    actionFilters: ActionFilters,
    requestReader: Writeable.Reader<Request>
) : HandledTransportAction<Request, Response>(name, transportService, actionFilters, requestReader) {
    companion object {
        private val log by logger(PluginBaseAction::class.java)
        private val scope: CoroutineScope = CoroutineScope(Dispatchers.IO)
    }

    /**
     * {@inheritDoc}
     */
    @Suppress("TooGenericExceptionCaught")
    override fun doExecute(
        task: Task?,
        request: Request,
        listener: ActionListener<Response>
    ) {
        val userStr: String? = client.threadPool().threadContext.getTransient<String>(OPENDISTRO_SECURITY_USER_INFO_THREAD_CONTEXT)
        val user: User? = User.parse(userStr)
        scope.launch {
            try {
                listener.onResponse(executeRequest(request, user))
            } catch (exception: ElasticsearchStatusException) {
                MyMetrics.REPORT_EXCEPTIONS_ES_STATUS_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:ElasticsearchStatusException: message:${exception.message}")
                listener.onFailure(exception)
            } catch (exception: ElasticsearchSecurityException) {
                MyMetrics.REPORT_EXCEPTIONS_ES_SECURITY_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:ElasticsearchSecurityException:", exception)
                listener.onFailure(ElasticsearchStatusException("Permissions denied: ${exception.message} - Contact administrator",
                    RestStatus.FORBIDDEN))
            } catch (exception: VersionConflictEngineException) {
                MyMetrics.REPORT_EXCEPTIONS_VERSION_CONFLICT_ENGINE_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:VersionConflictEngineException:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.CONFLICT))
            } catch (exception: IndexNotFoundException) {
                MyMetrics.REPORT_EXCEPTIONS_INDEX_NOT_FOUND_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:IndexNotFoundException:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.NOT_FOUND))
            } catch (exception: InvalidIndexNameException) {
                MyMetrics.REPORT_EXCEPTIONS_INVALID_INDEX_NAME_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:InvalidIndexNameException:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.BAD_REQUEST))
            } catch (exception: IllegalArgumentException) {
                MyMetrics.REPORT_EXCEPTIONS_ILLEGAL_ARGUMENT_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:IllegalArgumentException:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.BAD_REQUEST))
            } catch (exception: IllegalStateException) {
                MyMetrics.REPORT_EXCEPTIONS_ILLEGAL_STATE_EXCEPTION.counter.increment()
                log.warn("$LOG_PREFIX:IllegalStateException:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.SERVICE_UNAVAILABLE))
            } catch (exception: IOException) {
                MyMetrics.REPORT_EXCEPTIONS_IO_EXCEPTION.counter.increment()
                log.error("$LOG_PREFIX:Uncaught IOException:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.FAILED_DEPENDENCY))
            } catch (exception: Exception) {
                MyMetrics.REPORT_EXCEPTIONS_INTERNAL_SERVER_ERROR.counter.increment()
                log.error("$LOG_PREFIX:Uncaught Exception:", exception)
                listener.onFailure(ElasticsearchStatusException(exception.message, RestStatus.INTERNAL_SERVER_ERROR))
            }
        }
    }

    /**
     * Execute the transport request
     * @param request the request to execute
     * @return the response to return.
     */
    abstract fun executeRequest(request: Request, user: User?): Response
}
