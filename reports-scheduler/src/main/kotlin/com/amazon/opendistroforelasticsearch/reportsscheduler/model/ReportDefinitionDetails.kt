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

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.Schedule
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinition.TriggerType
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.ACCESS_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.CREATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_DEFINITION_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.UPDATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.stringList
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContent.EMPTY_PARAMS
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils
import java.time.Instant

/**
 * Wrapper data class over ReportDefinition to add metadata
 * <pre> JSON format
 * {@code
 * {
 *   "id":"id",
 *   "lastUpdatedTimeMs":1603506908773,
 *   "createdTimeMs":1603506908773,
 *   "access":["u:user", "r:sample_role", "ber:sample_backend_role"]
 *   "reportDefinition":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinition]
 *   }
 * }
 * }</pre>
 */
internal data class ReportDefinitionDetails(
    val id: String,
    val updatedTime: Instant,
    val createdTime: Instant,
    val access: List<String>,
    val reportDefinition: ReportDefinition
) : ScheduledJobParameter {
    internal companion object {
        private val log by logger(ReportDefinitionDetails::class.java)

        /**
         * Parse the data from parser and create ReportDefinitionDetails object
         * @param parser data referenced at parser
         * @param useId use this id if not available in the json
         * @return created ReportDefinitionDetails object
         */
        fun parse(parser: XContentParser, useId: String? = null): ReportDefinitionDetails {
            var id: String? = useId
            var updatedTime: Instant? = null
            var createdTime: Instant? = null
            var access: List<String> = listOf()
            var reportDefinition: ReportDefinition? = null
            XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser)
            while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    ID_FIELD -> id = parser.text()
                    UPDATED_TIME_FIELD -> updatedTime = Instant.ofEpochMilli(parser.longValue())
                    CREATED_TIME_FIELD -> createdTime = Instant.ofEpochMilli(parser.longValue())
                    ACCESS_LIST_FIELD -> access = parser.stringList()
                    REPORT_DEFINITION_FIELD -> reportDefinition = ReportDefinition.parse(parser)
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:ReportDefinitionDetails Skipping Unknown field $fieldName")
                    }
                }
            }
            id ?: throw IllegalArgumentException("$ID_FIELD field absent")
            updatedTime ?: throw IllegalArgumentException("$UPDATED_TIME_FIELD field absent")
            createdTime ?: throw IllegalArgumentException("$CREATED_TIME_FIELD field absent")
            reportDefinition ?: throw IllegalArgumentException("$REPORT_DEFINITION_FIELD field absent")
            return ReportDefinitionDetails(id,
                updatedTime,
                createdTime,
                access,
                reportDefinition)
        }
    }

    /**
     * create XContentBuilder from this object using [XContentFactory.jsonBuilder()]
     * @param params XContent parameters
     * @return created XContentBuilder object
     */
    fun toXContent(params: ToXContent.Params = EMPTY_PARAMS): XContentBuilder? {
        return toXContent(XContentFactory.jsonBuilder(), params)
    }

    /**
     * {ref toXContent}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        builder!!
        builder.startObject()
        if (params?.paramAsBoolean(ID_FIELD, false) == true) {
            builder.field(ID_FIELD, id)
        }
        builder.field(UPDATED_TIME_FIELD, updatedTime.toEpochMilli())
            .field(CREATED_TIME_FIELD, createdTime.toEpochMilli())
        if (params?.paramAsBoolean(ACCESS_LIST_FIELD, true) == true && access.isNotEmpty()) {
            builder.field(ACCESS_LIST_FIELD, access)
        }
        builder.field(REPORT_DEFINITION_FIELD)
        reportDefinition.toXContent(builder, params)
        builder.endObject()
        return builder
    }

    /**
     * {@inheritDoc}
     */
    override fun getName(): String {
        return reportDefinition.name
    }

    /**
     * {@inheritDoc}
     */
    override fun getLastUpdateTime(): Instant {
        return updatedTime
    }

    /**
     * {@inheritDoc}
     */
    override fun getEnabledTime(): Instant {
        return createdTime
    }

    /**
     * {@inheritDoc}
     */
    override fun getLockDurationSeconds(): Long? {
        return PluginSettings.jobLockDurationSeconds.toLong()
    }

    override fun getSchedule(): Schedule {
        return reportDefinition.trigger.schedule!!
    }

    override fun isEnabled(): Boolean {
        val trigger = reportDefinition.trigger
        return (reportDefinition.isEnabled &&
            (reportDefinition.trigger.schedule != null) &&
            (trigger.triggerType == TriggerType.IntervalSchedule || trigger.triggerType == TriggerType.CronSchedule))
    }
}
