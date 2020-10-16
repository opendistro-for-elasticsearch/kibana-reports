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

package com.amazon.opendistroforelasticsearch.reportsscheduler.job;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobDocVersion;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParser;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.Schedule;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.ScheduleParser;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobConstant;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;
import org.elasticsearch.common.xcontent.XContentParser;
import org.elasticsearch.common.xcontent.XContentParserUtils;

import java.io.IOException;
import java.time.Instant;

public class ScheduledReportJobParser implements ScheduledJobParser {

    @Override
    public ScheduledJobParameter parse(XContentParser parser, String id, JobDocVersion jobDocVersion) throws IOException {
        String jobName = null;
        Instant enabledTime = null;
        String reportDefinitionId = null;
        boolean isEnabled = false;
        Schedule schedule = null;
        Instant lastUpdateTime = null;
        Long lockDurationSeconds = null;

        XContentParserUtils.ensureExpectedToken(
            XContentParser.Token.START_OBJECT, parser.nextToken(), parser::getTokenLocation);

        while (!parser.nextToken().equals(XContentParser.Token.END_OBJECT)) {
            String fieldName = parser.currentName();
            parser.nextToken();
            switch (fieldName) {
                case JobConstant.NAME_FIELD:
                    jobName = parser.text();
                    break;
                case JobConstant.ENABLED_FILED:
                    isEnabled = parser.booleanValue();
                    break;
                case JobConstant.ENABLED_TIME_FILED:
                    enabledTime = parseInstantValue(parser);
                    break;
                case JobConstant.LAST_UPDATE_TIME_FIELD:
                    lastUpdateTime = parseInstantValue(parser);
                    break;
                case JobConstant.SCHEDULE_FIELD:
                    schedule = ScheduleParser.parse(parser);
                    break;
                case JobConstant.REPORT_DEFINITION_ID:
                    reportDefinitionId = parser.text();
                    break;
                default:
                    XContentParserUtils.throwUnknownToken(parser.currentToken(), parser.getTokenLocation());
            }
        }
        return new JobParameter(
            jobName,
            enabledTime,
            reportDefinitionId,
            isEnabled,
            schedule,
            lastUpdateTime,
            lockDurationSeconds);
    }

    private Instant parseInstantValue(XContentParser parser) throws IOException {
        if (XContentParser.Token.VALUE_NULL.equals(parser.currentToken())) {
            return null;
        }
        if (parser.currentToken().isValue()) {
            return Instant.ofEpochMilli(parser.longValue());
        }
        XContentParserUtils.throwUnknownToken(parser.currentToken(), parser.getTokenLocation());
        return null;
    }
}
