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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance.State
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.BEGIN_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.END_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.IN_CONTEXT_DOWNLOAD_URL_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_DETAILS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_INSTANCE_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_INSTANCE_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.RETRY_AFTER_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_TEXT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils
import org.elasticsearch.common.xcontent.XContentType
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus
import java.time.Instant
import kotlin.random.Random

/**
 * Report instances index operation actions.
 */
internal class ReportInstanceAction(
    private val request: RestRequest,
    private val client: NodeClient,
    private val restChannel: RestChannel
) {

    companion object {
        private val log by logger(ReportInstanceAction::class.java)
        private const val TEMP_OWNER_ID = "ownerId"
    }

    /**
     * Create a new on-demand report from in-context menu.
     */
    fun createOnDemand() {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemand")
        val response = restChannel.newBuilder(XContentType.JSON, false)
        var restStatus = RestStatus.OK // Default to success
        val currentTime = Instant.now()
        val parser = request.contentParser()
        parser.nextToken()
        var beginTime: Instant? = null
        var endTime: Instant? = null
        var currentState: State = State.Success
        var currentStateDescription: String? = null
        var inContextDownloadUrlPath: String? = null
        var reportDefinitionDetails: ReportDefinitionDetails? = null
        XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
        while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
            val fieldName = parser.currentName()
            parser.nextToken()
            when (fieldName) {
                IN_CONTEXT_DOWNLOAD_URL_FIELD -> inContextDownloadUrlPath = parser.text()
                BEGIN_TIME_FIELD -> beginTime = Instant.ofEpochMilli(parser.longValue())
                END_TIME_FIELD -> endTime = Instant.ofEpochMilli(parser.longValue())
                STATUS_FIELD -> currentState = State.valueOf(parser.text())
                STATUS_TEXT_FIELD -> currentStateDescription = parser.text()
                REPORT_DEFINITION_DETAILS_FIELD -> reportDefinitionDetails = ReportDefinitionDetails.parse(parser, TEMP_OWNER_ID)
                else -> {
                    parser.skipChildren()
                    log.info("$LOG_PREFIX:createOnDemand Skipping Unknown field $fieldName")
                }
            }
        }
        beginTime ?: throw IllegalArgumentException("$BEGIN_TIME_FIELD field absent")
        endTime ?: throw IllegalArgumentException("$END_TIME_FIELD field absent")
        val reportInstance = ReportInstance("ignore",
            currentTime,
            currentTime,
            beginTime,
            endTime,
            TEMP_OWNER_ID, // TODO validate userId actual requester ID
            reportDefinitionDetails,
            currentState,
            currentStateDescription,
            inContextDownloadUrlPath)
        val docId = IndexManager.createReportInstance(reportInstance)
        if (docId == null) {
            response.startObject()
                .field(STATUS_TEXT_FIELD, "Report Instance Creation failed")
                .endObject()
            restStatus = RestStatus.INTERNAL_SERVER_ERROR
        } else {
            val reportInstanceCopy = reportInstance.copy(id = docId)
            reportInstanceCopy.toXContent(response, ToXContent.EMPTY_PARAMS, true)
        }
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Create on-demand report from report definition
     * @param reportDefinitionId ReportDefinition id
     */
    fun createOnDemandFromDefinition(reportDefinitionId: String) {
        log.info("$LOG_PREFIX:ReportInstance-createOnDemandFromDefinition")
        val response = restChannel.newBuilder(XContentType.JSON, false)
        var restStatus = RestStatus.OK // Default to success
        val currentTime = Instant.now()
        val reportDefinitionDetails = IndexManager.getReportDefinition(reportDefinitionId)
        if (reportDefinitionDetails == null) { // TODO verify actual requester ID
            restStatus = RestStatus.NOT_FOUND
            response.startObject()
                .field(STATUS_TEXT_FIELD, "Report Definition $reportDefinitionId not found")
                .endObject()
        } else {
            val beginTime: Instant = currentTime.minus(reportDefinitionDetails.reportDefinition.format.duration)
            val endTime: Instant = currentTime
            val currentState: State = State.Executing
            val reportInstance = ReportInstance("ignore",
                currentTime,
                currentTime,
                beginTime,
                endTime,
                reportDefinitionDetails.ownerId,
                reportDefinitionDetails,
                currentState)
            val docId = IndexManager.createReportInstance(reportInstance)
            if (docId == null) {
                response.startObject()
                    .field(STATUS_TEXT_FIELD, "Report Instance Creation failed")
                    .endObject()
                restStatus = RestStatus.INTERNAL_SERVER_ERROR
            } else {
                val reportInstanceCopy = reportInstance.copy(id = docId)
                reportInstanceCopy.toXContent(response, ToXContent.EMPTY_PARAMS, true)
            }
        }
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Update status of existing report instance
     * @param reportInstanceId ReportInstance id
     */
    fun update(reportInstanceId: String) {
        log.info("$LOG_PREFIX:ReportInstance-update $reportInstanceId")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        var restStatus = RestStatus.OK // Default to success
        val currentReportInstance = IndexManager.getReportInstance(reportInstanceId)
        if (currentReportInstance == null) { // TODO verify actual requester ID
            restStatus = RestStatus.NOT_FOUND
            response.field(STATUS_TEXT_FIELD, "Report Instance $reportInstanceId not found")
        } else {
            val currentTime = Instant.now()
            val parser = request.contentParser()
            parser.nextToken()
            var state: State? = null
            var stateDescription: String? = null
            XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    STATUS_FIELD -> state = State.valueOf(parser.text())
                    STATUS_TEXT_FIELD -> stateDescription = parser.text()
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:updateReportInstanceStatus Skipping Unknown field $fieldName")
                    }
                }
            }
            if (state == null || state == State.Scheduled) { // Don't allow changing status to Scheduled
                throw IllegalArgumentException("$STATUS_FIELD field not valid")
            }
            val updatedReportInstance = currentReportInstance.copy(updatedTime = currentTime,
                currentState = state,
                currentStateDescription = stateDescription)
            val isUpdated = IndexManager.updateReportInstance(updatedReportInstance)
            if (isUpdated) {
                response.field(ID_FIELD, reportInstanceId)
            } else {
                response.field(STATUS_TEXT_FIELD, "Report Instance state update failed")
                restStatus = RestStatus.INTERNAL_SERVER_ERROR
            }
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Get information of existing report instance
     * @param reportInstanceId ReportInstance id
     */
    fun info(reportInstanceId: String) {
        log.info("$LOG_PREFIX:ReportInstance-info $reportInstanceId")
        val response = restChannel.newBuilder(XContentType.JSON, false)
        var restStatus = RestStatus.OK // Default to success
        val reportInstance = IndexManager.getReportInstance(reportInstanceId)
        if (reportInstance == null) { // TODO verify actual requester ID
            restStatus = RestStatus.NOT_FOUND
            response.startObject()
                .field(STATUS_TEXT_FIELD, "Report Instance $reportInstanceId not found")
                .endObject()
        } else {
            reportInstance.toXContent(response, ToXContent.EMPTY_PARAMS, true)
        }
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    /**
     * Get information of all report instance for given user
     */
    fun getAll(from: Int) {
        log.info("$LOG_PREFIX:ReportInstance-getAll")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        var restStatus = RestStatus.OK // Default to success
        // TODO verify actual requester ID
        val reportInstanceList = IndexManager.getAllReportInstances(TEMP_OWNER_ID, from)
        if (reportInstanceList.isEmpty()) {
            restStatus = RestStatus.NOT_FOUND
            response.field(STATUS_TEXT_FIELD, "No Report Definitions found")
        } else {
            response.startArray(REPORT_INSTANCE_LIST_FIELD)
            reportInstanceList.forEach { it.toXContent(response, ToXContent.EMPTY_PARAMS, true) }
            response.endArray()
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    fun poll() {
        log.info("$LOG_PREFIX:ReportInstance-poll")
        val response = restChannel.newBuilder(XContentType.JSON, false).startObject()
        val restStatus: RestStatus
        val currentTime = Instant.now()
        // TODO verify actual requester ID to be kibana background task
        val reportInstances = IndexManager.getPendingReportInstances()
        if (reportInstances.isEmpty()) {
            restStatus = RestStatus.MULTI_STATUS
            response.field(RETRY_AFTER_FIELD, getRetryAfterTime())
            response.field(STATUS_TEXT_FIELD, "No Scheduled Report Instance found")
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
                    currentState = State.Executing
                ))
                IndexManager.updateReportInstanceDoc(updatedInstance)
            }
            if (lockedJob == null) {
                restStatus = RestStatus.MULTI_STATUS
                response.field(RETRY_AFTER_FIELD, PluginSettings.minPollingDurationSeconds)
                response.field(STATUS_TEXT_FIELD, "Could not get lock. try after sometime")
            } else {
                restStatus = RestStatus.OK
                response.field(REPORT_INSTANCE_FIELD)
                lockedJob.reportInstance.toXContent(response, ToXContent.EMPTY_PARAMS, true)
            }
        }
        response.endObject()
        restChannel.sendResponse(BytesRestResponse(restStatus, response))
    }

    private fun getRetryAfterTime(): Int {
        return Random.nextInt(PluginSettings.minPollingDurationSeconds, PluginSettings.maxPollingDurationSeconds)
    }
}
