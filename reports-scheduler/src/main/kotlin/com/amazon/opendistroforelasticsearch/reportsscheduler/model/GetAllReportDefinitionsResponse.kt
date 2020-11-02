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
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.STATUS_TEXT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.fieldIfNotNull
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParser.Token
import org.elasticsearch.common.xcontent.XContentParserUtils
import org.elasticsearch.rest.RestStatus

/**
 * Get all report instances info response.
 * <pre> JSON format
 * {@code
 * // On Success
 * {
 *   "reportDefinitionDetailsList":[
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails]
 *   ]
 * }
 * // On Failure
 * {
 *   "status":404,
 *   "statusText":"No Report Definitions found"
 * }
 * }</pre>
 */
internal data class GetAllReportDefinitionsResponse(
    override val restStatus: RestStatus,
    override val restStatusText: String?,
    val reportDefinitionList: List<ReportDefinitionDetails>?
) : IRestResponse {
    companion object {
        private val log by logger(GetAllReportDefinitionsResponse::class.java)

        /**
         * Parse the data from parser and create [GetAllReportDefinitionsResponse] object
         * @param parser data referenced at parser
         * @return created [GetAllReportDefinitionsResponse] object
         */
        fun parse(parser: XContentParser): GetAllReportDefinitionsResponse {
            var restStatus: RestStatus = RestStatus.OK
            var statusText: String? = null
            var reportInstances: List<ReportDefinitionDetails>? = null
            XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    STATUS_FIELD -> restStatus = RestStatus.fromCode(parser.intValue())
                    STATUS_TEXT_FIELD -> statusText = parser.text()
                    REPORT_DEFINITION_LIST_FIELD -> reportInstances = parseReportDefinitionList(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                    }
                }
            }
            return GetAllReportDefinitionsResponse(restStatus, statusText, reportInstances)
        }

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
    override fun toXContent(): XContentBuilder {
        return toXContent(XContentFactory.jsonBuilder(), ToXContent.EMPTY_PARAMS)
    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        return if (reportDefinitionList != null) {
            builder!!.startObject()
                .startArray(REPORT_DEFINITION_LIST_FIELD)
            reportDefinitionList.forEach { it.toXContent(builder, ToXContent.EMPTY_PARAMS, true) }
            builder.endArray().endObject()
        } else {
            builder!!.startObject()
                .field(STATUS_FIELD, restStatus)
                .fieldIfNotNull(STATUS_TEXT_FIELD, restStatusText)
                .endObject()
        }
    }
}
