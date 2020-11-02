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
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.FROM_INDEX_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParser.Token
import org.elasticsearch.common.xcontent.XContentParserUtils

/**
 * Get All report instances info request
 * Data object created from GET request query params
 * <pre> JSON format
 * {@code
 * {
 *   "fromIndex":100
 * }
 * }</pre>
 */
internal data class GetAllReportInstancesRequest(
    val fromIndex: Int
) : ToXContentObject {
    companion object {
        private val log by logger(GetAllReportInstancesRequest::class.java)

        /**
         * Parse the data from parser and create [GetAllReportInstancesRequest] object
         * @param parser data referenced at parser
         * @return created [GetAllReportInstancesRequest] object
         */
        fun parse(parser: XContentParser): GetAllReportInstancesRequest {
            var reportInstanceId = 0
            XContentParserUtils.ensureExpectedToken(Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    FROM_INDEX_FIELD -> reportInstanceId = parser.intValue()
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:Skipping Unknown field $fieldName")
                    }
                }
            }
            return GetAllReportInstancesRequest(reportInstanceId)
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
            .field(FROM_INDEX_FIELD, fromIndex)
            .endObject()
    }
}
