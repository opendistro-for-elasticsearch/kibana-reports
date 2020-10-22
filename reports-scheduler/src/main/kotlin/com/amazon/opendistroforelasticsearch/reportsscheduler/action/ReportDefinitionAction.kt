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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinition
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_TEXT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentType
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus
import java.time.Instant

/**
 * Report definitions index operation actions.
 */
internal class ReportDefinitionAction(
    private val request: RestRequest,
    private val client: NodeClient,
    private val restChannel: RestChannel
) {

    companion object {
        private val log by logger(ReportDefinitionAction::class.java)
        private const val TEMP_OWNER_ID = "ownerId" // TODO get this from request
    }

    /**
     * Create new ReportDefinition
     */
    fun create() {
        log.info("$LOG_PREFIX:ReportDefinition-create")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        var restStatus = RestStatus.OK // Default to success
        val currentTime = Instant.now()
        val contentParser = request.contentParser()
        contentParser.nextToken()
        val reportDefinition = ReportDefinition.parse(contentParser)
        val reportDefinitionDetails = ReportDefinitionDetails("ignore",
            currentTime,
            currentTime,
            TEMP_OWNER_ID, // TODO update with actual requester ID
            reportDefinition
        )
        val docId = IndexManager.createReportDefinition(reportDefinitionDetails)
        if (docId == null) {
            response.field(STATUS_TEXT_FIELD, "Report Definition Creation failed")
            restStatus = RestStatus.INTERNAL_SERVER_ERROR
        } else {
            response.field(ID_FIELD, docId)
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Update ReportDefinition
     * @param reportDefinitionId ReportDefinition id
     */
    fun update(reportDefinitionId: String) {
        log.info("$LOG_PREFIX:ReportDefinition-update $reportDefinitionId")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        var restStatus = RestStatus.OK // Default to success
        val currentReportDefinitionDetails = IndexManager.getReportDefinition(reportDefinitionId)
        if (currentReportDefinitionDetails == null) { // TODO verify actual requester ID
            restStatus = RestStatus.NOT_FOUND
            response.field(STATUS_TEXT_FIELD, "Report Definition $reportDefinitionId not found")
        } else {
            val currentTime = Instant.now()
            val contentParser = request.contentParser()
            contentParser.nextToken()
            val reportDefinition = ReportDefinition.parse(contentParser)
            val reportDefinitionDetails = ReportDefinitionDetails(reportDefinitionId,
                currentTime,
                currentReportDefinitionDetails.createdTime,
                currentReportDefinitionDetails.ownerId,
                reportDefinition
            )
            val isUpdated = IndexManager.updateReportDefinition(reportDefinitionId, reportDefinitionDetails)
            if (isUpdated) {
                response.field(ID_FIELD, reportDefinitionId)
            } else {
                response.field(STATUS_TEXT_FIELD, "Report Definition Update failed")
                restStatus = RestStatus.INTERNAL_SERVER_ERROR
            }
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Get ReportDefinition info
     * @param reportDefinitionId ReportDefinition id
     */
    fun info(reportDefinitionId: String) {
        log.info("$LOG_PREFIX:ReportDefinition-info $reportDefinitionId")
        val response = restChannel.newBuilder(XContentType.JSON, false)
        var restStatus = RestStatus.OK // Default to success
        val reportDefinitionDetails = IndexManager.getReportDefinition(reportDefinitionId)
        if (reportDefinitionDetails == null) { // TODO verify actual requester ID
            restStatus = RestStatus.NOT_FOUND
            response.startObject()
                .field(STATUS_TEXT_FIELD, "Report Definition $reportDefinitionId not found")
                .endObject()
        } else {
            reportDefinitionDetails.toXContent(response, ToXContent.EMPTY_PARAMS, true)
        }
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Delete ReportDefinition
     * @param reportDefinitionId ReportDefinition id
     */
    fun delete(reportDefinitionId: String) {
        log.info("$LOG_PREFIX:ReportDefinition-delete $reportDefinitionId")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        var restStatus = RestStatus.OK // Default to success
        val reportDefinitionDetails = IndexManager.getReportDefinition(reportDefinitionId)
        if (reportDefinitionDetails == null) { // TODO verify actual requester ID
            restStatus = RestStatus.NOT_FOUND
            response.startObject()
                .field(STATUS_TEXT_FIELD, "Report Definition $reportDefinitionId not found")
                .endObject()
        } else {
            val isDeleted = IndexManager.deleteReportDefinition(reportDefinitionId)
            if (!isDeleted) {
                restStatus = RestStatus.REQUEST_TIMEOUT
                response.field(STATUS_TEXT_FIELD, "Report Definition $reportDefinitionId delete failed")
            } else {
                response.field(STATUS_TEXT_FIELD, "Report Definition $reportDefinitionId deleted")
            }
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Get all ReportDefinition for current user
     */
    fun getAll(from: Int) {
        log.info("$LOG_PREFIX:ReportDefinition-getAll")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        var restStatus = RestStatus.OK // Default to success
        // TODO verify actual requester ID
        val reportDefinitionsList = IndexManager.getAllReportDefinitions(TEMP_OWNER_ID, from)
        if (reportDefinitionsList.isEmpty()) {
            restStatus = RestStatus.NOT_FOUND
            response.field(STATUS_TEXT_FIELD, "No Report Definitions found")
        } else {
            response.startArray(REPORT_DEFINITION_LIST_FIELD)
            reportDefinitionsList.forEach { it.toXContent(response, ToXContent.EMPTY_PARAMS, true) }
            response.endArray()
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }
}
