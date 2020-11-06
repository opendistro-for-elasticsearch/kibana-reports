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

import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.index.ReportDefinitionsIndex
import com.amazon.opendistroforelasticsearch.reportsscheduler.index.ReportInstancesIndex
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportInstancesRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportInstancesResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportInstanceRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportInstanceResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.InContextReportCreateRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.InContextReportCreateResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.OnDemandReportCreateRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.OnDemandReportCreateResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.PollReportInstanceResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance.Status
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportInstanceStatusResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.ElasticsearchStatusException
import org.elasticsearch.rest.RestStatus
import java.time.Instant
import kotlin.random.Random

/**
 * Report instances index operation actions.
 */
internal object ReportInstanceActions {
    private val log by logger(ReportInstanceActions::class.java)
    private const val TEMP_ROLE_ID = "roleId" // TODO get this from request

    /**
     * Create a new on-demand report from in-context menu.
     * @param request [InContextReportCreateRequest] object
     * @return [InContextReportCreateResponse]
     */
    fun createOnDemand(request: InContextReportCreateRequest): InContextReportCreateResponse {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemand")
        val currentTime = Instant.now()
        val reportInstance = ReportInstance("ignore",
            currentTime,
            currentTime,
            request.beginTime,
            request.endTime,
            listOf(TEMP_ROLE_ID),
            request.reportDefinitionDetails,
            request.status,
            request.statusText,
            request.inContextDownloadUrlPath)
        val docId = ReportInstancesIndex.createReportInstance(reportInstance)
        docId ?: throw ElasticsearchStatusException("Report Instance Creation failed", RestStatus.INTERNAL_SERVER_ERROR)
        val reportInstanceCopy = reportInstance.copy(id = docId)
        return InContextReportCreateResponse(reportInstanceCopy)
    }

    /**
     * Create on-demand report from report definition
     * @param request [OnDemandReportCreateRequest] object
     * @return [OnDemandReportCreateResponse]
     */
    fun createOnDemandFromDefinition(request: OnDemandReportCreateRequest): OnDemandReportCreateResponse {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemandFromDefinition ${request.reportDefinitionId}")
        val currentTime = Instant.now()
        val reportDefinitionDetails = ReportDefinitionsIndex.getReportDefinition(request.reportDefinitionId)
        reportDefinitionDetails
            ?: throw ElasticsearchStatusException("Report Definition ${request.reportDefinitionId} not found", RestStatus.NOT_FOUND)
        // TODO verify actual requester ID
        val beginTime: Instant = currentTime.minus(reportDefinitionDetails.reportDefinition.format.duration)
        val endTime: Instant = currentTime
        val currentStatus: Status = Status.Executing
        val reportInstance = ReportInstance("ignore",
            currentTime,
            currentTime,
            beginTime,
            endTime,
            reportDefinitionDetails.roles,
            reportDefinitionDetails,
            currentStatus)
        val docId = ReportInstancesIndex.createReportInstance(reportInstance)
        docId ?: throw ElasticsearchStatusException("Report Instance Creation failed", RestStatus.INTERNAL_SERVER_ERROR)
        val reportInstanceCopy = reportInstance.copy(id = docId)
        return OnDemandReportCreateResponse(reportInstanceCopy)
    }

    /**
     * Update status of existing report instance
     * @param request [UpdateReportInstanceStatusRequest] object
     * @return [UpdateReportInstanceStatusResponse]
     */
    fun update(request: UpdateReportInstanceStatusRequest): UpdateReportInstanceStatusResponse {
        log.info("$LOG_PREFIX:ReportInstance-update ${request.reportInstanceId}")
        val currentReportInstance = ReportInstancesIndex.getReportInstance(request.reportInstanceId)
        currentReportInstance
            ?: throw ElasticsearchStatusException("Report Instance ${request.reportInstanceId} not found", RestStatus.NOT_FOUND)
        // TODO verify actual requester ID
        if (request.status == Status.Scheduled) { // Don't allow changing status to Scheduled
            throw ElasticsearchStatusException("Status cannot be updated to ${Status.Scheduled}", RestStatus.BAD_REQUEST)
        }
        val currentTime = Instant.now()
        val updatedReportInstance = currentReportInstance.copy(updatedTime = currentTime,
            status = request.status,
            statusText = request.statusText)
        if (!ReportInstancesIndex.updateReportInstance(updatedReportInstance)) {
            throw ElasticsearchStatusException("Report Instance state update failed", RestStatus.INTERNAL_SERVER_ERROR)
        }
        return UpdateReportInstanceStatusResponse(request.reportInstanceId)
    }

    /**
     * Get information of existing report instance
     * @param request [GetReportInstanceRequest] object
     * @return [GetReportInstanceResponse]
     */
    fun info(request: GetReportInstanceRequest): GetReportInstanceResponse {
        log.info("$LOG_PREFIX:ReportInstance-info ${request.reportInstanceId}")
        val reportInstance = ReportInstancesIndex.getReportInstance(request.reportInstanceId)
        reportInstance
            ?: throw ElasticsearchStatusException("Report Instance ${request.reportInstanceId} not found", RestStatus.NOT_FOUND)
        // TODO verify actual requester ID
        return GetReportInstanceResponse(reportInstance)
    }

    /**
     * Get information of all report instances
     * @param request [GetAllReportInstancesRequest] object
     * @return [GetAllReportInstancesResponse]
     */
    fun getAll(request: GetAllReportInstancesRequest): GetAllReportInstancesResponse {
        log.info("$LOG_PREFIX:ReportInstance-getAll ${request.fromIndex}")
        // TODO verify actual requester ID
        val reportInstanceList = ReportInstancesIndex.getAllReportInstances(listOf(TEMP_ROLE_ID), request.fromIndex)
        return GetAllReportInstancesResponse(reportInstanceList)
    }

    fun poll(): PollReportInstanceResponse {
        log.info("$LOG_PREFIX:ReportInstance-poll")
        val currentTime = Instant.now()
        // TODO verify actual requester ID to be kibana background task
        val reportInstances = ReportInstancesIndex.getPendingReportInstances()
        return if (reportInstances.isEmpty()) {
            PollReportInstanceResponse(getRetryAfterTime(), null)
        } else {
            // Shuffle list so that when multiple requests are made, chances of lock conflict is less
            reportInstances.shuffle()
            /*
            If the shuffling is perfect random then there is high probability that first item locking is successful
            even when there are many parallel requests. i.e. say there are x jobs and y parallel requests.
            then x out of y jobs can lock first item and rest cannot lock any jobs. However shuffle may not be perfect
            hence checking first few jobs for locking.
            */
            val lockedJob = reportInstances.subList(0, PluginSettings.maxLockRetries).find {
                val updatedInstance = it.copy(reportInstance = it.reportInstance.copy(
                    updatedTime = currentTime,
                    status = Status.Executing
                ))
                ReportInstancesIndex.updateReportInstanceDoc(updatedInstance)
            }
            if (lockedJob == null) {
                PollReportInstanceResponse(PluginSettings.minPollingDurationSeconds, null)
            } else {
                PollReportInstanceResponse(0, lockedJob.reportInstance)
            }
        }
    }

    private fun getRetryAfterTime(): Int {
        return Random.nextInt(PluginSettings.minPollingDurationSeconds, PluginSettings.maxPollingDurationSeconds)
    }
}
