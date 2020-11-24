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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.ACCESS_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.BEGIN_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.CREATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.END_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.ID_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.INSTANCE_INDEX_PARAMS
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.IN_CONTEXT_DOWNLOAD_URL_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_DEFINITION_DETAILS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.STATUS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.STATUS_TEXT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.TENANT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.UPDATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.security.UserAccessManager.DEFAULT_TENANT
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.stringList
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.ToXContentObject
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils
import java.time.Instant

/**
 * Report instance main data class contains ReportDefinitionDetails.
 * <pre> JSON format
 * {@code
 * {
 *   "id":"id",
 *   "lastUpdatedTimeMs":1603506908773,
 *   "createdTimeMs":1603506908773,
 *   "beginTimeMs":1603506908773,
 *   "endTimeMs":1603506908773,
 *   "tenant":"__user__",
 *   "access":["User:user", "Role:sample_role", "BERole:sample_backend_role"]
 *   "reportDefinitionDetails":{
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.reportDefinitionDetails]
 *   },
 *   "status":"Success", // Scheduled, Executing, Success, Failed
 *   "statusText":"Success",
 *   "inContextDownloadUrlPath":"/app/dashboard#view/dashboard-id",
 * }
 * }</pre>
 */
internal data class ReportInstance(
    val id: String,
    val updatedTime: Instant,
    val createdTime: Instant,
    val beginTime: Instant,
    val endTime: Instant,
    val tenant: String,
    val access: List<String>,
    val reportDefinitionDetails: ReportDefinitionDetails?,
    val status: Status,
    val statusText: String? = null,
    val inContextDownloadUrlPath: String? = null
) : ToXContentObject {
    internal enum class Status { Scheduled, Executing, Success, Failed }
    companion object {
        private val log by logger(ReportInstance::class.java)

        /**
         * Parse the data from parser and create ReportInstance object
         * @param parser data referenced at parser
         * @return created ReportInstance object
         */
        @Suppress("ComplexMethod")
        fun parse(parser: XContentParser, useId: String? = null): ReportInstance {
            var id: String? = useId
            var updatedTime: Instant? = null
            var createdTime: Instant? = null
            var beginTime: Instant? = null
            var endTime: Instant? = null
            var tenant: String? = null
            var access: List<String> = listOf()
            var reportDefinitionDetails: ReportDefinitionDetails? = null
            var status: Status? = null
            var statusText: String? = null
            var inContextDownloadUrlPath: String? = null
            XContentParserUtils.ensureExpectedToken(XContentParser.Token.START_OBJECT, parser.currentToken(), parser::getTokenLocation)
            while (XContentParser.Token.END_OBJECT != parser.nextToken()) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    ID_FIELD -> id = parser.text()
                    UPDATED_TIME_FIELD -> updatedTime = Instant.ofEpochMilli(parser.longValue())
                    CREATED_TIME_FIELD -> createdTime = Instant.ofEpochMilli(parser.longValue())
                    BEGIN_TIME_FIELD -> beginTime = Instant.ofEpochMilli(parser.longValue())
                    END_TIME_FIELD -> endTime = Instant.ofEpochMilli(parser.longValue())
                    TENANT_FIELD -> tenant = parser.text()
                    ACCESS_LIST_FIELD -> access = parser.stringList()
                    REPORT_DEFINITION_DETAILS_FIELD -> reportDefinitionDetails = ReportDefinitionDetails.parse(parser)
                    STATUS_FIELD -> status = Status.valueOf(parser.text())
                    STATUS_TEXT_FIELD -> statusText = parser.text()
                    IN_CONTEXT_DOWNLOAD_URL_FIELD -> inContextDownloadUrlPath = parser.text()
                    else -> {
                        parser.skipChildren()
                        log.info("$LOG_PREFIX:ReportInstance Skipping Unknown field $fieldName")
                    }
                }
            }
            id ?: throw IllegalArgumentException("$ID_FIELD field absent")
            updatedTime ?: throw IllegalArgumentException("$UPDATED_TIME_FIELD field absent")
            createdTime ?: throw IllegalArgumentException("$CREATED_TIME_FIELD field absent")
            beginTime ?: throw IllegalArgumentException("$BEGIN_TIME_FIELD field absent")
            endTime ?: throw IllegalArgumentException("$END_TIME_FIELD field absent")
            tenant = tenant ?: DEFAULT_TENANT
            status ?: throw IllegalArgumentException("$STATUS_FIELD field absent")
            return ReportInstance(id,
                updatedTime,
                createdTime,
                beginTime,
                endTime,
                tenant,
                access,
                reportDefinitionDetails,
                status,
                statusText,
                inContextDownloadUrlPath)
        }
    }

    /**
     * create XContentBuilder from this object using [XContentFactory.jsonBuilder()]
     * @param params XContent parameters
     * @return created XContentBuilder object
     */
    fun toXContent(params: ToXContent.Params = ToXContent.EMPTY_PARAMS): XContentBuilder? {
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
            .field(BEGIN_TIME_FIELD, beginTime.toEpochMilli())
            .field(END_TIME_FIELD, endTime.toEpochMilli())
            .field(TENANT_FIELD, tenant)
        if (params?.paramAsBoolean(ACCESS_LIST_FIELD, true) == true && access.isNotEmpty()) {
            builder.field(ACCESS_LIST_FIELD, access)
        }
        if (reportDefinitionDetails != null) {
            builder.field(REPORT_DEFINITION_DETAILS_FIELD)
            val passingParams = if (params?.param(ID_FIELD) == null) { // If called from index operation
                INSTANCE_INDEX_PARAMS
            } else {
                params
            }
            reportDefinitionDetails.toXContent(builder, passingParams)
        }
        builder.field(STATUS_FIELD, status.name)
        if (statusText != null) {
            builder.field(STATUS_TEXT_FIELD, statusText)
        }
        if (inContextDownloadUrlPath != null) {
            builder.field(IN_CONTEXT_DOWNLOAD_URL_FIELD, inContextDownloadUrlPath)
        }
        builder.endObject()
        return builder
    }
}
