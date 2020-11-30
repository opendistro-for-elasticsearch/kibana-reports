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

package com.amazon.opendistroforelasticsearch.reportsscheduler.scheduler

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobDocVersion
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParser
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails
import org.elasticsearch.common.xcontent.XContentParser

internal object ReportDefinitionJobParser : ScheduledJobParser {
    /**
     * {@inheritDoc}
     */
    override fun parse(xContentParser: XContentParser, id: String, jobDocVersion: JobDocVersion): ScheduledJobParameter {
        xContentParser.nextToken()
        return ReportDefinitionDetails.parse(xContentParser, id)
    }
}
