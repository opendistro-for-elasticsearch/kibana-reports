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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.CreateReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.CreateReportDefinitionResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportDefinitionsRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetAllReportDefinitionsResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.GetReportDefinitionResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.UpdateReportDefinitionResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.security.UserAccessManager
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.ElasticsearchStatusException
import org.elasticsearch.rest.RestStatus
import java.time.Instant

/**
 * Report definitions index operation actions.
 */
internal object ReportDefinitionActions {
    private val log by logger(ReportDefinitionActions::class.java)

    /**
     * Create new ReportDefinition
     * @param request [CreateReportDefinitionRequest] object
     * @return [CreateReportDefinitionResponse]
     */
    fun create(request: CreateReportDefinitionRequest, user: User?): CreateReportDefinitionResponse {
        log.info("$LOG_PREFIX:ReportDefinition-create")
        UserAccessManager.validateUser(user)
        val currentTime = Instant.now()
        val reportDefinitionDetails = ReportDefinitionDetails("ignore",
            currentTime,
            currentTime,
            UserAccessManager.getAllAccessInfo(user),
            request.reportDefinition
        )
        val docId = ReportDefinitionsIndex.createReportDefinition(reportDefinitionDetails)
        docId ?: throw ElasticsearchStatusException("Report Definition Creation failed",
            RestStatus.INTERNAL_SERVER_ERROR)
        return CreateReportDefinitionResponse(docId)
    }

    /**
     * Update ReportDefinition
     * @param request [UpdateReportDefinitionRequest] object
     * @return [UpdateReportDefinitionResponse]
     */
    fun update(request: UpdateReportDefinitionRequest, user: User?): UpdateReportDefinitionResponse {
        log.info("$LOG_PREFIX:ReportDefinition-update ${request.reportDefinitionId}")
        UserAccessManager.validateUser(user)
        val currentReportDefinitionDetails = ReportDefinitionsIndex.getReportDefinition(request.reportDefinitionId)
        currentReportDefinitionDetails
            ?: throw ElasticsearchStatusException("Report Definition ${request.reportDefinitionId} not found", RestStatus.NOT_FOUND)
        if (!UserAccessManager.doesUserHasAccess(user, currentReportDefinitionDetails.access)) {
            throw ElasticsearchStatusException("Permission denied for Report Definition ${request.reportDefinitionId}", RestStatus.FORBIDDEN)
        }
        val currentTime = Instant.now()
        val reportDefinitionDetails = ReportDefinitionDetails(request.reportDefinitionId,
            currentTime,
            currentReportDefinitionDetails.createdTime,
            currentReportDefinitionDetails.access,
            request.reportDefinition
        )
        if (!ReportDefinitionsIndex.updateReportDefinition(request.reportDefinitionId, reportDefinitionDetails)) {
            throw ElasticsearchStatusException("Report Definition Update failed", RestStatus.INTERNAL_SERVER_ERROR)
        }
        return UpdateReportDefinitionResponse(request.reportDefinitionId)
    }

    /**
     * Get ReportDefinition info
     * @param request [GetReportDefinitionRequest] object
     * @return [GetReportDefinitionResponse]
     */
    fun info(request: GetReportDefinitionRequest, user: User?): GetReportDefinitionResponse {
        log.info("$LOG_PREFIX:ReportDefinition-info ${request.reportDefinitionId}")
        UserAccessManager.validateUser(user)
        val reportDefinitionDetails = ReportDefinitionsIndex.getReportDefinition(request.reportDefinitionId)
        reportDefinitionDetails
            ?: throw ElasticsearchStatusException("Report Definition ${request.reportDefinitionId} not found", RestStatus.NOT_FOUND)
        if (!UserAccessManager.doesUserHasAccess(user, reportDefinitionDetails.access)) {
            throw ElasticsearchStatusException("Permission denied for Report Definition ${request.reportDefinitionId}", RestStatus.FORBIDDEN)
        }
        return GetReportDefinitionResponse(reportDefinitionDetails, UserAccessManager.hasAllInfoAccess(user))
    }

    /**
     * Delete ReportDefinition
     * @param request [DeleteReportDefinitionRequest] object
     * @return [DeleteReportDefinitionResponse]
     */
    fun delete(request: DeleteReportDefinitionRequest, user: User?): DeleteReportDefinitionResponse {
        log.info("$LOG_PREFIX:ReportDefinition-delete ${request.reportDefinitionId}")
        UserAccessManager.validateUser(user)
        val reportDefinitionDetails = ReportDefinitionsIndex.getReportDefinition(request.reportDefinitionId)
        reportDefinitionDetails
            ?: throw ElasticsearchStatusException("Report Definition ${request.reportDefinitionId} not found", RestStatus.NOT_FOUND)
        if (!UserAccessManager.doesUserHasAccess(user, reportDefinitionDetails.access)) {
            throw ElasticsearchStatusException("Permission denied for Report Definition ${request.reportDefinitionId}", RestStatus.FORBIDDEN)
        }
        if (!ReportDefinitionsIndex.deleteReportDefinition(request.reportDefinitionId)) {
            throw ElasticsearchStatusException("Report Definition ${request.reportDefinitionId} delete failed", RestStatus.REQUEST_TIMEOUT)
        }
        return DeleteReportDefinitionResponse(request.reportDefinitionId)
    }

    /**
     * Get all ReportDefinitions
     * @param request [GetAllReportDefinitionsRequest] object
     * @return [GetAllReportDefinitionsResponse]
     */
    fun getAll(request: GetAllReportDefinitionsRequest, user: User?): GetAllReportDefinitionsResponse {
        log.info("$LOG_PREFIX:ReportDefinition-getAll fromIndex:${request.fromIndex} maxItems:${request.maxItems}")
        UserAccessManager.validateUser(user)
        val reportDefinitionsList = ReportDefinitionsIndex.getAllReportDefinitions(UserAccessManager.getSearchAccessInfo(user),
            request.fromIndex,
            request.maxItems)
        return GetAllReportDefinitionsResponse(reportDefinitionsList, UserAccessManager.hasAllInfoAccess(user))
    }
}
