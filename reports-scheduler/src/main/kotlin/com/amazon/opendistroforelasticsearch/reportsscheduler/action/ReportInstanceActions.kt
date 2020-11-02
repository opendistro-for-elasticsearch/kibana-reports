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
import com.amazon.opendistroforelasticsearch.reportsscheduler.index.IndexManager
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
        val docId = IndexManager.createReportInstance(reportInstance)
        return if (docId == null) {
            InContextReportCreateResponse(RestStatus.INTERNAL_SERVER_ERROR,
                "Report Instance Creation failed",
                null)
        } else {
            val reportInstanceCopy = reportInstance.copy(id = docId)
            InContextReportCreateResponse(RestStatus.OK,
                null,
                reportInstanceCopy)
        }
    }

    /**
     * Create on-demand report from report definition
     * @param request [OnDemandReportCreateRequest] object
     * @return [OnDemandReportCreateResponse]
     */
    fun createOnDemandFromDefinition(request: OnDemandReportCreateRequest): OnDemandReportCreateResponse {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemandFromDefinition ${request.reportDefinitionId}")
        val currentTime = Instant.now()
        val reportDefinitionDetails = IndexManager.getReportDefinition(request.reportDefinitionId)
        return if (reportDefinitionDetails == null) { // TODO verify actual requester ID
            OnDemandReportCreateResponse(RestStatus.INTERNAL_SERVER_ERROR,
                "Report Definition ${request.reportDefinitionId} not found",
                null)
        } else {
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
            val docId = IndexManager.createReportInstance(reportInstance)
            if (docId == null) {
                OnDemandReportCreateResponse(RestStatus.INTERNAL_SERVER_ERROR,
                    "Report Instance Creation failed",
                    null)
            } else {
                val reportInstanceCopy = reportInstance.copy(id = docId)
                OnDemandReportCreateResponse(RestStatus.OK,
                    null,
                    reportInstanceCopy)
            }
        }
    }

    /**
     * Update status of existing report instance
     * @param request [UpdateReportInstanceStatusRequest] object
     * @return [UpdateReportInstanceStatusResponse]
     */
    fun update(request: UpdateReportInstanceStatusRequest): UpdateReportInstanceStatusResponse {
        log.info("$LOG_PREFIX:ReportInstance-update ${request.reportInstanceId}")
        val currentReportInstance = IndexManager.getReportInstance(request.reportInstanceId)
        return if (currentReportInstance == null) { // TODO verify actual requester ID
            UpdateReportInstanceStatusResponse(RestStatus.NOT_FOUND,
                "Report Instance not found",
                request.reportInstanceId)
        } else if (request.status == Status.Scheduled) { // Don't allow changing status to Scheduled
            UpdateReportInstanceStatusResponse(RestStatus.NOT_FOUND,
                "Status cannot be updated to ${Status.Scheduled}",
                request.reportInstanceId)
        } else {
            val currentTime = Instant.now()
            val updatedReportInstance = currentReportInstance.copy(updatedTime = currentTime,
                status = request.status,
                statusText = request.statusText)
            val isUpdated = IndexManager.updateReportInstance(updatedReportInstance)
            if (isUpdated) {
                UpdateReportInstanceStatusResponse(RestStatus.OK,
                    null,
                    request.reportInstanceId)
            } else {
                UpdateReportInstanceStatusResponse(RestStatus.INTERNAL_SERVER_ERROR,
                    "Report Instance state update failed",
                    request.reportInstanceId)
            }
        }
    }

    /**
     * Get information of existing report instance
     * @param request [GetReportInstanceRequest] object
     * @return [GetReportInstanceResponse]
     */
    fun info(request: GetReportInstanceRequest): GetReportInstanceResponse {
        log.info("$LOG_PREFIX:ReportInstance-info ${request.reportInstanceId}")
        val reportInstance = IndexManager.getReportInstance(request.reportInstanceId)
        return if (reportInstance == null) { // TODO verify actual requester ID
            GetReportInstanceResponse(RestStatus.NOT_FOUND,
                "Report Instance ${request.reportInstanceId} not found",
                null)
        } else {
            GetReportInstanceResponse(RestStatus.OK,
                null,
                reportInstance)
        }
    }

    /**
     * Get information of all report instances
     * @param request [GetAllReportInstancesRequest] object
     * @return [GetAllReportInstancesResponse]
     */
    fun getAll(request: GetAllReportInstancesRequest): GetAllReportInstancesResponse {
        log.info("$LOG_PREFIX:ReportInstance-getAll ${request.fromIndex}")
        // TODO verify actual requester ID
        val reportInstanceList = IndexManager.getAllReportInstances(listOf(TEMP_ROLE_ID), request.fromIndex)
        return if (reportInstanceList.isEmpty()) {
            GetAllReportInstancesResponse(RestStatus.NOT_FOUND,
                "No Report Instances found",
                null)
        } else {
            GetAllReportInstancesResponse(RestStatus.OK, null, reportInstanceList)
        }
    }

    fun poll(): PollReportInstanceResponse {
        log.info("$LOG_PREFIX:ReportInstance-poll")
        val currentTime = Instant.now()
        // TODO verify actual requester ID to be kibana background task
        val reportInstances = IndexManager.getPendingReportInstances()
        return if (reportInstances.isEmpty()) {
            PollReportInstanceResponse(RestStatus.MULTI_STATUS,
                "No Scheduled Report Instance found",
                getRetryAfterTime(),
                null)
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
                IndexManager.updateReportInstanceDoc(updatedInstance)
            }
            if (lockedJob == null) {
                PollReportInstanceResponse(RestStatus.MULTI_STATUS,
                    "Could not get lock. try after sometime",
                    PluginSettings.minPollingDurationSeconds,
                    null)
            } else {
                PollReportInstanceResponse(RestStatus.OK, null, 0, lockedJob.reportInstance)
            }
        }
    }

    private fun getRetryAfterTime(): Int {
        return Random.nextInt(PluginSettings.minPollingDurationSeconds, PluginSettings.maxPollingDurationSeconds)
    }
}
