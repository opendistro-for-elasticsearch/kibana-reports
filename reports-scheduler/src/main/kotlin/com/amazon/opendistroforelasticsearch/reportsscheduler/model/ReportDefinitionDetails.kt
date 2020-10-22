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
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.CREATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.LAST_UPDATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.OWNER_ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.REPORT_DEFINITION_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils
import java.time.Instant

/**
 * Wrapper data class over ReportDefinition to add metadata
 */
internal data class ReportDefinitionDetails(
    val id: String,
    val lastUpdatedTime: Instant,
    val createdTime: Instant,
    val ownerId: String,
    val reportDefinition: ReportDefinition
) : ToXContentObject {
    internal companion object {
        private val log by logger(ReportDefinitionDetails::class.java)

        /**
         * Parse the data from parser and create DeliveryInfo object
         * @param parser data referenced at parser
         * @return created DeliveryInfo object
         */
        fun parse(parser: XContentParser, useId: String? = null): ReportDefinitionDetails {
            var id: String? = useId
            var lastUpdatedTime: Instant? = null
            var createdTime: Instant? = null
            var createdBy: String? = null
            var reportDefinition: ReportDefinition? = null
            XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    ID_FIELD -> id = parser.text()
                    LAST_UPDATED_TIME_FIELD -> lastUpdatedTime = Instant.ofEpochMilli(parser.longValue())
                    CREATED_TIME_FIELD -> createdTime = Instant.ofEpochMilli(parser.longValue())
                    OWNER_ID_FIELD -> createdBy = parser.text()
                    REPORT_DEFINITION_FIELD -> reportDefinition = ReportDefinition.parse(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:ReportDefinitionDetails Skipping Unknown field $fieldName")
                    }
                }
            }
            id ?: throw IllegalArgumentException("$ID_FIELD field absent")
            lastUpdatedTime ?: throw IllegalArgumentException("$LAST_UPDATED_TIME_FIELD field absent")
            createdTime ?: throw IllegalArgumentException("$CREATED_TIME_FIELD field absent")
            createdBy ?: throw IllegalArgumentException("$OWNER_ID_FIELD field absent")
            reportDefinition ?: throw IllegalArgumentException("$REPORT_DEFINITION_FIELD field absent")
            return ReportDefinitionDetails(id,
                lastUpdatedTime,
                createdTime,
                createdBy,
                reportDefinition)
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
        builder.field(LAST_UPDATED_TIME_FIELD, lastUpdatedTime.toEpochMilli())
            .field(CREATED_TIME_FIELD, createdTime.toEpochMilli())
            .field(OWNER_ID_FIELD, ownerId)
        builder.field(REPORT_DEFINITION_FIELD)
        reportDefinition.toXContent(builder, ToXContent.EMPTY_PARAMS)
        builder.endObject()
        return builder
    }
}
