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

import com.amazon.opendistroforelasticsearch.reportsscheduler.util.createJsonParser
import org.elasticsearch.common.io.stream.StreamInput
import org.elasticsearch.common.io.stream.StreamOutput
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentFactory
import org.elasticsearch.common.xcontent.XContentParser
import java.io.IOException

/**
 * Get all report definitions response.
 * <pre> JSON format
 * {@code
 * {
 *   "startIndex":"0",
 *   "totalHits":"100",
 *   "totalHitRelation":"eq",
 *   "reportDefinitionDetailsList":[
 *      // refer [com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails]
 *   ]
 * }
 * }</pre>
 */
internal class GetAllReportDefinitionsResponse : BaseResponse {
    val reportDefinitionList: ReportDefinitionDetailsSearchResults

    constructor(reportDefinitionList: ReportDefinitionDetailsSearchResults) : super() {
        this.reportDefinitionList = reportDefinitionList
    }

    @Throws(IOException::class)
    constructor(input: StreamInput) : this(input.createJsonParser())

    /**
     * Parse the data from parser and create [GetAllReportDefinitionsResponse] object
     * @param parser data referenced at parser
     */
    constructor(parser: XContentParser) : super() {
        reportDefinitionList = ReportDefinitionDetailsSearchResults(parser)
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
        return reportDefinitionList.toXContent(builder, params)
    }
}
