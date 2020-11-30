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

import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.REPORT_INSTANCE_LIST_FIELD
import org.apache.lucene.search.TotalHits
import org.elasticsearch.action.search.SearchResponse
import org.elasticsearch.common.xcontent.XContentParser

/**
 * ReportInstances search results
 */
internal class ReportInstanceSearchResults : SearchResults<ReportInstance> {
    constructor(
        startIndex: Long,
        totalHits: Long,
        totalHitRelation: TotalHits.Relation,
        objectList: List<ReportInstance>
    ) : super(startIndex, totalHits, totalHitRelation, objectList, REPORT_INSTANCE_LIST_FIELD)

    constructor(parser: XContentParser) : super(parser, REPORT_INSTANCE_LIST_FIELD)

    constructor(from: Long, response: SearchResponse) : super(from, response, REPORT_INSTANCE_LIST_FIELD)

    /**
     * {@inheritDoc}
     */
    override fun parseItem(parser: XContentParser, useId: String?): ReportInstance {
        return ReportInstance.parse(parser, useId)
    }
}
