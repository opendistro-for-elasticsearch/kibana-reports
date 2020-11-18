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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_DEFINITION_DETAILS_FIELD
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
import java.io.IOException

/**
 * Get report Definition info response.
 * <pre> JSON format
 * {@code
 * {
 *   "reportDefinitionDetails":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails]
 *   }
 * }
 * }</pre>
 */
internal class GetReportDefinitionResponse : BaseResponse {
    val reportDefinitionDetails: ReportDefinitionDetails

    companion object {
        private val log by logger(GetReportDefinitionResponse::class.java)
    }

    constructor(reportDefinition: ReportDefinitionDetails) : super() {
        this.reportDefinitionDetails = reportDefinition
    }

    @Throws(IOException::class)
    constructor(input: StreamInput) : this(input.createJsonParser())

    /**
     * Parse the data from parser and create [GetReportDefinitionResponse] object
     * @param parser data referenced at parser
     */
    constructor(parser: XContentParser) : super() {
        var reportDefinition: ReportDefinitionDetails? = null
        XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser)
        while (Token.END_OBJECT != parser.nextToken()) {
            val fieldName = parser.currentName()
            parser.nextToken()
            when (fieldName) {
                REPORT_DEFINITION_DETAILS_FIELD -> reportDefinition = ReportDefinitionDetails.parse(parser)
                else -> {
                    parser.skipChildren()
                    log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                }
            }
        }
        reportDefinition ?: throw IllegalArgumentException("${RestTag.REPORT_DEFINITION_FIELD} field absent")
        this.reportDefinitionDetails = reportDefinition
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
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        builder!!.startObject()
            .field(REPORT_DEFINITION_DETAILS_FIELD)
        reportDefinitionDetails.toXContent(builder, ToXContent.EMPTY_PARAMS, true)
        return builder.endObject()
    }
}
