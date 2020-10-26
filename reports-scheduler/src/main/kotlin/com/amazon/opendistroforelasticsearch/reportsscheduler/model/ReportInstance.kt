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

package com.amazon.opendistroforelasticsearch.reportsscheduler.model

import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.BEGIN_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.CREATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.END_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.IN_CONTEXT_DOWNLOAD_URL_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_DETAILS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_TEXT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.UPDATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.USER_ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils
import java.time.Instant

/**
 * Report instance main data class contains ReportDefinitionDetails.
 */
internal data class ReportInstance(
    val id: String,
    val updatedTime: Instant,
    val createdTime: Instant,
    val beginTime: Instant,
    val endTime: Instant,
    val userId: String,
    val reportDefinitionDetails: ReportDefinitionDetails?,
    val currentState: State,
    val currentStateDescription: String? = null,
    val inContextDownloadUrlPath: String? = null
) : ToXContentObject {
    internal enum class State { Scheduled, Executing, Success, Failed }
    companion object {
        private val log by logger(ReportInstance::class.java)

        /**
         * Parse the data from parser and create ReportInstance object
         * @param parser data referenced at parser
         * @return created ReportInstance object
         */
        @Suppress("ComplexMethod")
        fun parse(parser: XContentParser, useId: String? = null): ReportInstance {
            var id: String? = useId
            var updatedTime: Instant? = null
            var createdTime: Instant? = null
            var beginTime: Instant? = null
            var endTime: Instant? = null
            var userId: String? = null
            var currentState: State? = null
            var currentStateDescription: String? = null
            var inContextDownloadUrlPath: String? = null
            var reportDefinitionDetails: ReportDefinitionDetails? = null
            XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    ID_FIELD -> id = parser.text()
                    UPDATED_TIME_FIELD -> updatedTime = Instant.ofEpochMilli(parser.longValue())
                    CREATED_TIME_FIELD -> createdTime = Instant.ofEpochMilli(parser.longValue())
                    IN_CONTEXT_DOWNLOAD_URL_FIELD -> inContextDownloadUrlPath = parser.text()
                    BEGIN_TIME_FIELD -> beginTime = Instant.ofEpochMilli(parser.longValue())
                    END_TIME_FIELD -> endTime = Instant.ofEpochMilli(parser.longValue())
                    USER_ID_FIELD -> userId = parser.text()
                    STATUS_FIELD -> currentState = State.valueOf(parser.text())
                    STATUS_TEXT_FIELD -> currentStateDescription = parser.text()
                    REPORT_DEFINITION_DETAILS_FIELD -> reportDefinitionDetails = ReportDefinitionDetails.parse(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:ReportInstance Skipping Unknown field $fieldName")
                    }
                }
            }
            id ?: throw IllegalArgumentException("$ID_FIELD field absent")
            updatedTime ?: throw IllegalArgumentException("$UPDATED_TIME_FIELD field absent")
            createdTime ?: throw IllegalArgumentException("$CREATED_TIME_FIELD field absent")
            beginTime ?: throw IllegalArgumentException("$BEGIN_TIME_FIELD field absent")
            endTime ?: throw IllegalArgumentException("$END_TIME_FIELD field absent")
            userId ?: throw IllegalArgumentException("$USER_ID_FIELD field absent")
            currentState ?: throw IllegalArgumentException("$STATUS_FIELD field absent")
            return ReportInstance(id,
                updatedTime,
                createdTime,
                beginTime,
                endTime,
                userId,
                reportDefinitionDetails,
                currentState,
                currentStateDescription,
                inContextDownloadUrlPath)
        }
    }

    /**
     * create XContentBuilder from this object using [XContentFactory.jsonBuilder()]
     * @return created XContentBuilder object
     */
    fun toXContent(includeId: Boolean): XContentBuilder? {
        return toXContent(XContentFactory.jsonBuilder(), ToXContent.EMPTY_PARAMS, includeId)
    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        return toXContent(builder, params, false)
    }

    /**
     * {ref toXContent}
     */
    fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?, includeId: Boolean): XContentBuilder {
        builder!!
        builder.startObject()
        if (includeId) {
            builder.field(ID_FIELD, id)
        }
        builder.field(UPDATED_TIME_FIELD, updatedTime.toEpochMilli())
            .field(CREATED_TIME_FIELD, createdTime.toEpochMilli())
            .field(BEGIN_TIME_FIELD, beginTime.toEpochMilli())
            .field(END_TIME_FIELD, endTime.toEpochMilli())
            .field(USER_ID_FIELD, userId)
            .field(STATUS_FIELD, currentState.name)
        if (currentStateDescription != null) {
            builder.field(STATUS_TEXT_FIELD, currentStateDescription)
        }
        if (inContextDownloadUrlPath != null) {
            builder.field(IN_CONTEXT_DOWNLOAD_URL_FIELD, inContextDownloadUrlPath)
        }
        if (reportDefinitionDetails != null) {
            builder.field(REPORT_DEFINITION_DETAILS_FIELD)
            reportDefinitionDetails.toXContent(builder, ToXContent.EMPTY_PARAMS, true)
        }
        builder.endObject()
        return builder
    }
}
