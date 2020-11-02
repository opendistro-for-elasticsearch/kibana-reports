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
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParser.Token
import org.elasticsearch.common.xcontent.XContentParserUtils

/**
 * Report Definition-create request.
 * <pre> JSON format
 * {@code
 * {
 *   "reportDefinition":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinition]
 *   }
 * }
 * }</pre>
 */
internal data class CreateReportDefinitionRequest(
    val reportDefinition: ReportDefinition
) : ToXContentObject {
    companion object {
        private val log by logger(CreateReportDefinitionRequest::class.java)

        /**
         * Parse the data from parser and create [CreateReportDefinitionRequest] object
         * @param parser data referenced at parser
         * @return created [CreateReportDefinitionRequest] object
         */
        fun parse(parser: XContentParser): CreateReportDefinitionRequest {
            var reportDefinition: ReportDefinition? = null
            XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    REPORT_DEFINITION_FIELD -> reportDefinition = ReportDefinition.parse(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                    }
                }
            }
            reportDefinition ?: throw IllegalArgumentException("$REPORT_DEFINITION_FIELD field absent")
            return CreateReportDefinitionRequest(reportDefinition)
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
        return builder!!.startObject()
            .field(REPORT_DEFINITION_FIELD, reportDefinition)
            .endObject()
    }
}
