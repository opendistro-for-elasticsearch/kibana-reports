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
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_DETAILS_FIELD
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
 * Get report Definition info response.
 * <pre> JSON format
 * {@code
 * // On Success
 * {
 *   "reportDefinitionDetails":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails]
 *   }
 * }
 * // On Failure
 * {
 *   "status":404,
 *   "statusText":"No Report Definitions found"
 * }
 * }</pre>
 */
internal data class GetReportDefinitionsResponse(
    override val restStatus: RestStatus,
    override val restStatusText: String?,
    val reportDefinition: ReportDefinitionDetails?
) : IRestResponse {
    companion object {
        private val log by logger(GetReportDefinitionsResponse::class.java)

        /**
         * Parse the data from parser and create [GetReportDefinitionsResponse] object
         * @param parser data referenced at parser
         * @return created [GetReportDefinitionsResponse] object
         */
        fun parse(parser: XContentParser): GetReportDefinitionsResponse {
            var restStatus: RestStatus = RestStatus.OK
            var statusText: String? = null
            var reportDefinition: ReportDefinitionDetails? = null
            XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    STATUS_FIELD -> restStatus = RestStatus.fromCode(parser.intValue())
                    STATUS_TEXT_FIELD -> statusText = parser.text()
                    REPORT_DEFINITION_DETAILS_FIELD -> reportDefinition = ReportDefinitionDetails.parse(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                    }
                }
            }
            return GetReportDefinitionsResponse(restStatus, statusText, reportDefinition)
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
        return if (reportDefinition != null) {
            builder!!.startObject()
                .field(REPORT_DEFINITION_DETAILS_FIELD, reportDefinition)
                .endObject()
        } else {
            builder!!.startObject()
                .field(STATUS_FIELD, restStatus)
                .fieldIfNotNull(STATUS_TEXT_FIELD, restStatusText)
                .endObject()
        }
    }
}
