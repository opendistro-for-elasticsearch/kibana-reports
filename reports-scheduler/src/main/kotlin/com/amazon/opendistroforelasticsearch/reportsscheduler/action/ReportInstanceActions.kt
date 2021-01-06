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

import com.amazon.opendistroforelasticsearch.commons.authuser.User
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
import com.amazon.opendistroforelasticsearch.reportsscheduler.security.UserAccessManager
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

    /**
     * Create a new on-demand report from in-context menu.
     * @param request [InContextReportCreateRequest] object
     * @return [InContextReportCreateResponse]
     */
    fun createOnDemand(request: InContextReportCreateRequest, user: User?): InContextReportCreateResponse {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemand")
        UserAccessManager.validateUser(user)
        val currentTime = Instant.now()
        val reportInstance = ReportInstance("ignore",
            currentTime,
            currentTime,
            request.beginTime,
            request.endTime,
            UserAccessManager.getUserTenant(user),
            UserAccessManager.getAllAccessInfo(user),
            request.reportDefinitionDetails,
            Status.Success, // TODO: Revert to request.status when background job execution supported
            request.statusText,
            request.inContextDownloadUrlPath)
        val docId = ReportInstancesIndex.createReportInstance(reportInstance)
        docId ?: throw ElasticsearchStatusException("Report Instance Creation failed", RestStatus.INTERNAL_SERVER_ERROR)
        val reportInstanceCopy = reportInstance.copy(id = docId)
        return InContextReportCreateResponse(reportInstanceCopy, UserAccessManager.hasAllInfoAccess(user))
    }

    /**
     * Create on-demand report from report definition
     * @param request [OnDemandReportCreateRequest] object
     * @return [OnDemandReportCreateResponse]
     */
    fun createOnDemandFromDefinition(request: OnDemandReportCreateRequest, user: User?): OnDemandReportCreateResponse {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemandFromDefinition ${request.reportDefinitionId}")
        UserAccessManager.validateUser(user)
        val currentTime = Instant.now()
        val reportDefinitionDetails = ReportDefinitionsIndex.getReportDefinition(request.reportDefinitionId)
        reportDefinitionDetails
            ?: throw ElasticsearchStatusException("Report Definition ${request.reportDefinitionId} not found", RestStatus.NOT_FOUND)
        if (!UserAccessManager.doesUserHasAccess(user, reportDefinitionDetails.tenant, reportDefinitionDetails.access)) {
            throw ElasticsearchStatusException("Permission denied for Report Definition ${request.reportDefinitionId}", RestStatus.FORBIDDEN)
        }
        val beginTime: Instant = currentTime.minus(reportDefinitionDetails.reportDefinition.format.duration)
        val endTime: Instant = currentTime
        val currentStatus: Status = Status.Success // TODO: Revert to Executing when background job execution supported
        val reportInstance = ReportInstance("ignore",
            currentTime,
            currentTime,
            beginTime,
            endTime,
            UserAccessManager.getUserTenant(user),
            reportDefinitionDetails.access,
            reportDefinitionDetails,
            currentStatus)
        val docId = ReportInstancesIndex.createReportInstance(reportInstance)
        docId ?: throw ElasticsearchStatusException("Report Instance Creation failed", RestStatus.INTERNAL_SERVER_ERROR)
        val reportInstanceCopy = reportInstance.copy(id = docId)
        return OnDemandReportCreateResponse(reportInstanceCopy, UserAccessManager.hasAllInfoAccess(user))
    }

    /**
     * Update status of existing report instance
     * @param request [UpdateReportInstanceStatusRequest] object
     * @return [UpdateReportInstanceStatusResponse]
     */
    fun update(request: UpdateReportInstanceStatusRequest, user: User?): UpdateReportInstanceStatusResponse {
        log.info("$LOG_PREFIX:ReportInstance-update ${request.reportInstanceId}")
        UserAccessManager.validateUser(user)
        val currentReportInstance = ReportInstancesIndex.getReportInstance(request.reportInstanceId)
        currentReportInstance
            ?: throw ElasticsearchStatusException("Report Instance ${request.reportInstanceId} not found", RestStatus.NOT_FOUND)
        if (!UserAccessManager.doesUserHasAccess(user, currentReportInstance.tenant, currentReportInstance.access)) {
            throw ElasticsearchStatusException("Permission denied for Report Definition ${request.reportInstanceId}", RestStatus.FORBIDDEN)
        }
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
    fun info(request: GetReportInstanceRequest, user: User?): GetReportInstanceResponse {
        log.info("$LOG_PREFIX:ReportInstance-info ${request.reportInstanceId}")
        UserAccessManager.validateUser(user)
        val reportInstance = ReportInstancesIndex.getReportInstance(request.reportInstanceId)
        reportInstance
            ?: throw ElasticsearchStatusException("Report Instance ${request.reportInstanceId} not found", RestStatus.NOT_FOUND)
        if (!UserAccessManager.doesUserHasAccess(user, reportInstance.tenant, reportInstance.access)) {
            throw ElasticsearchStatusException("Permission denied for Report Definition ${request.reportInstanceId}", RestStatus.FORBIDDEN)
        }
        return GetReportInstanceResponse(reportInstance, UserAccessManager.hasAllInfoAccess(user))
    }

    /**
     * Get information of all report instances
     * @param request [GetAllReportInstancesRequest] object
     * @return [GetAllReportInstancesResponse]
     */
    fun getAll(request: GetAllReportInstancesRequest, user: User?): GetAllReportInstancesResponse {
        log.info("$LOG_PREFIX:ReportInstance-getAll fromIndex:${request.fromIndex} maxItems:${request.maxItems}")
        UserAccessManager.validateUser(user)
        val reportInstanceList = ReportInstancesIndex.getAllReportInstances(UserAccessManager.getUserTenant(user),
            UserAccessManager.getSearchAccessInfo(user),
            request.fromIndex,
            request.maxItems)
        return GetAllReportInstancesResponse(reportInstanceList, UserAccessManager.hasAllInfoAccess(user))
    }

    fun poll(user: User?): PollReportInstanceResponse {
        log.info("$LOG_PREFIX:ReportInstance-poll")
        UserAccessManager.validatePollingUser(user)
        val currentTime = Instant.now()
        val reportInstances = ReportInstancesIndex.getPendingReportInstances()
        return if (reportInstances.isEmpty()) {
            PollReportInstanceResponse(getRetryAfterTime())
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
                PollReportInstanceResponse(PluginSettings.minPollingDurationSeconds)
            } else {
                PollReportInstanceResponse(0, lockedJob.reportInstance, UserAccessManager.hasAllInfoAccess(user))
            }
        }
    }

    private fun getRetryAfterTime(): Int {
        return Random.nextInt(PluginSettings.minPollingDurationSeconds, PluginSettings.maxPollingDurationSeconds)
    }
}
