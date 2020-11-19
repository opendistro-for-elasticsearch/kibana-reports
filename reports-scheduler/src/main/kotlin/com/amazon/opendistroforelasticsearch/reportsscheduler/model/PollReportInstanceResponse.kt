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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_INSTANCE_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.RETRY_AFTER_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.createJsonParser
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.io.stream.StreamInput
import org.elasticsearch.common.io.stream.StreamOutput
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParser.Token
import org.elasticsearch.common.xcontent.XContentParserUtils
import org.elasticsearch.rest.RestStatus
import java.io.IOException

/**
 * Poll report instance info response.
 * <pre> JSON format
 * {@code
 * // On Success
 * {
 *   "reportInstance":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance]
 *   }
 * }
 * // if no job found
 * {
 *   "retryAfter":300
 * }
 * }</pre>
 */
internal class PollReportInstanceResponse : BaseResponse {
    val retryAfter: Int
    val reportInstance: ReportInstance?
    private val filterSensitiveInfo: Boolean

    companion object {
        private val log by logger(GetReportDefinitionResponse::class.java)
    }

    constructor(retryAfter: Int, reportInstance: ReportInstance? = null, filterSensitiveInfo: Boolean = true) : super() {
        this.retryAfter = retryAfter
        this.reportInstance = reportInstance
        this.filterSensitiveInfo = filterSensitiveInfo
    }

    @Throws(IOException::class)
    constructor(input: StreamInput) : this(input.createJsonParser())

    /**
     * Parse the data from parser and create [PollReportInstanceResponse] object
     * @param parser data referenced at parser
     */
    constructor(parser: XContentParser) : super() {
        var retryAfter: Int = PluginSettings.minPollingDurationSeconds
        var reportInstance: ReportInstance? = null
        XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser)
        while (Token.END_OBJECT != parser.nextToken()) {
            val fieldName = parser.currentName()
            parser.nextToken()
            when (fieldName) {
                RETRY_AFTER_FIELD -> retryAfter = parser.intValue()
                REPORT_INSTANCE_FIELD -> reportInstance = ReportInstance.parse(parser)
                else -> {
                    parser.skipChildren()
                    log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                }
            }
        }
        this.retryAfter = retryAfter
        this.reportInstance = reportInstance
        this.filterSensitiveInfo = false // Sensitive info Must have filtered when created json object
    }

    /**
     * {@inheritDoc}
     */
    @Throws(IOException::class)
    override fun writeTo(output: StreamOutput) {
        toXContent(XContentFactory.jsonBuilder(output), ToXContent.EMPTY_PARAMS)
    }

    /**
     * {@inheritDoc}
     */
    override fun getStatus(): RestStatus {
        return if (reportInstance != null) {
            RestStatus.OK
        } else {
            RestStatus.MULTI_STATUS
        }
    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        return if (reportInstance != null) {
            val xContentParams = if (filterSensitiveInfo) {
                RestTag.FILTERED_REST_OUTPUT_PARAMS
            } else {
                RestTag.REST_OUTPUT_PARAMS
            }
            builder!!.startObject()
                .field(REPORT_INSTANCE_FIELD)
            reportInstance.toXContent(builder, xContentParams)
            builder.endObject()
        } else {
            builder!!.startObject()
                .field(RETRY_AFTER_FIELD, retryAfter)
                .endObject()
        }
    }
}
