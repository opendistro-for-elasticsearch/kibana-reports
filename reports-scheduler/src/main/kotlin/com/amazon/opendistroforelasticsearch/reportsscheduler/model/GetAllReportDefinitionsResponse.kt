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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_DEFINITION_LIST_FIELD
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
 * Get all report definitions response.
 * <pre> JSON format
 * {@code
 * {
 *   "reportDefinitionDetailsList":[
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails]
 *   ]
 * }
 * }</pre>
 */
internal class GetAllReportDefinitionsResponse : BaseResponse {
    val reportDefinitionList: List<ReportDefinitionDetails>

    constructor(reportDefinitionList: List<ReportDefinitionDetails>) : super() {
        this.reportDefinitionList = reportDefinitionList
    }

    @Throws(IOException::class)
    constructor(input: StreamInput) : this(input.createJsonParser())

    /**
     * Parse the data from parser and create [GetAllReportDefinitionsResponse] object
     * @param parser data referenced at parser
     */
    constructor(parser: XContentParser) : super() {
        var reportDefinitions: List<ReportDefinitionDetails>? = null
        XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
        while (Token.END_OBJECT != parser.nextToken()) {
            val fieldName = parser.currentName()
            parser.nextToken()
            when (fieldName) {
                REPORT_DEFINITION_LIST_FIELD -> reportDefinitions = parseReportDefinitionList(parser)
                else -> {
                    parser.skipChildren()
                    log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                }
            }
        }
        reportDefinitions ?: throw IllegalArgumentException("$REPORT_DEFINITION_LIST_FIELD field absent")
        this.reportDefinitionList = reportDefinitions
    }

    companion object {
        private val log by logger(GetAllReportDefinitionsResponse::class.java)

        /**
         * Parse the report definition list from parser
         * @param parser data referenced at parser
         * @return created list of ReportDefinitionDetails
         */
        private fun parseReportDefinitionList(parser: XContentParser): List<ReportDefinitionDetails> {
            val retList: MutableList<ReportDefinitionDetails> = mutableListOf()
            XContentParserUtils.ensureExpectedToken(Token.START_ARRAY, parser.currentToken(), parser::getTokenLocation)
            while (parser.nextToken() != Token.END_ARRAY) {
                retList.add(ReportDefinitionDetails.parse(parser))
            }
            return retList
        }
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
            .startArray(REPORT_DEFINITION_LIST_FIELD)
        reportDefinitionList.forEach { it.toXContent(builder, ToXContent.EMPTY_PARAMS, true) }
        return builder.endArray().endObject()
    }
}
