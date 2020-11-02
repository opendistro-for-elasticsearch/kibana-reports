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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance.Status
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.BEGIN_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.END_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.IN_CONTEXT_DOWNLOAD_URL_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_DETAILS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_TEXT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.fieldIfNotNull
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParser.Token
import org.elasticsearch.common.xcontent.XContentParserUtils
import java.time.Instant

/**
 * Report-create request from in-context menu.
 * <pre> JSON format
 * {@code
 * {
 *   "beginTimeMs":1603506908773,
 *   "endTimeMs":1603506908773,
 *   "reportDefinitionDetails":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails]
 *   },
 *   "status":"Success", // Scheduled, Executing, Success, Failed
 *   "statusText":"Success",
 *   "inContextDownloadUrlPath":"/app/dashboard#view/dashboard-id"
 * }
 * }</pre>
 */
internal data class InContextReportCreateRequest(
    val beginTime: Instant,
    val endTime: Instant,
    val reportDefinitionDetails: ReportDefinitionDetails?,
    val status: Status,
    val statusText: String? = null,
    val inContextDownloadUrlPath: String? = null
) : ToXContentObject {
    companion object {
        private val log by logger(InContextReportCreateRequest::class.java)

        /**
         * Parse the data from parser and create [InContextReportCreateRequest] object
         * @param parser data referenced at parser
         * @return created [InContextReportCreateRequest] object
         */
        fun parse(parser: XContentParser): InContextReportCreateRequest {
            var beginTime: Instant? = null
            var endTime: Instant? = null
            var reportDefinitionDetails: ReportDefinitionDetails? = null
            var status: Status? = null
            var statusText: String? = null
            var inContextDownloadUrlPath: String? = null
            XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    BEGIN_TIME_FIELD -> beginTime = Instant.ofEpochMilli(parser.longValue())
                    END_TIME_FIELD -> endTime = Instant.ofEpochMilli(parser.longValue())
                    REPORT_DEFINITION_DETAILS_FIELD -> reportDefinitionDetails = ReportDefinitionDetails.parse(parser)
                    STATUS_FIELD -> status = Status.valueOf(parser.text())
                    STATUS_TEXT_FIELD -> statusText = parser.text()
                    IN_CONTEXT_DOWNLOAD_URL_FIELD -> inContextDownloadUrlPath = parser.text()
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:InContextReportCreateRequest Skipping Unknown field $fieldName")
                    }
                }
            }
            beginTime ?: throw IllegalArgumentException("$BEGIN_TIME_FIELD field absent")
            endTime ?: throw IllegalArgumentException("$END_TIME_FIELD field absent")
            status ?: throw IllegalArgumentException("$STATUS_FIELD field absent")
            return InContextReportCreateRequest(beginTime,
                endTime,
                reportDefinitionDetails,
                status,
                statusText,
                inContextDownloadUrlPath)
        }
    }

    /**
     * create XContentBuilder from this object using [XContentFactory.jsonBuilder()]
     * @return created XContentBuilder object
     */
    fun toXContent(): XContentBuilder? {
        return toXContent(XContentFactory.jsonBuilder(), ToXContent.EMPTY_PARAMS)
    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        builder!!.startObject()
            .field(BEGIN_TIME_FIELD, beginTime.toEpochMilli())
            .field(END_TIME_FIELD, endTime.toEpochMilli())
        if (reportDefinitionDetails != null) {
            builder.field(REPORT_DEFINITION_DETAILS_FIELD)
            reportDefinitionDetails.toXContent(builder, ToXContent.EMPTY_PARAMS, true)
        }
        return builder.field(STATUS_FIELD, status.name)
            .fieldIfNotNull(STATUS_TEXT_FIELD, statusText)
            .fieldIfNotNull(IN_CONTEXT_DOWNLOAD_URL_FIELD, inContextDownloadUrlPath)
            .endObject()
    }
}
