/*
 *   Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.Schedule;
import org.elasticsearch.common.xcontent.XContentBuilder;


import java.io.IOException;
import java.time.Instant;

/**
 * A sample job parameter.
 * <p>
 * It adds an additional "indexToWatch" field to {@link ScheduledJobParameter}, which stores the index
 * the job runner will watch.
 */
public class JobParameter implements ScheduledJobParameter {

    private String jobName;
    private Instant enabledTime;
    private String reportDefinitionId;
    private boolean isEnabled;
    private Schedule schedule;
    private Instant lastUpdateTime;
    private Long lockDurationSeconds;
    private Double jitter;

    public JobParameter() {
    }

    public JobParameter(String id, String name, String reportDefinitionId, Schedule schedule) {
        this.jobName = name;
        this.reportDefinitionId = reportDefinitionId;
        this.schedule = schedule;

        Instant now = Instant.now();
        this.isEnabled = true;
        this.enabledTime = now;
    }

    @Override
    public String getName() {
        return this.jobName;
    }

    @Override
    public Instant getLastUpdateTime() {
        return this.lastUpdateTime;
    }

    @Override
    public Instant getEnabledTime() {
        return this.enabledTime;
    }

    @Override
    public Schedule getSchedule() {
        return this.schedule;
    }

    @Override
    public boolean isEnabled() {
        return this.isEnabled;
    }

    @Override
    public Long getLockDurationSeconds() {
        return this.lockDurationSeconds;
    }

    @Override public Double getJitter() {
        return jitter;
    }

    public String getReportDefinitionId() {
        return this.reportDefinitionId;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public void setLastUpdateTime(Instant lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    public void setEnabledTime(Instant enabledTime) {
        this.enabledTime = enabledTime;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public void setReportDefinitionId(String reportDefinitionId) {
        this.reportDefinitionId = reportDefinitionId;
    }

    public void setLockDurationSeconds(Long lockDurationSeconds) {
        this.lockDurationSeconds = lockDurationSeconds;
    }

    public void setJitter(Double jitter) {
        this.jitter = jitter;
    }

    @Override
    public XContentBuilder toXContent(XContentBuilder builder, Params params) throws IOException {
        builder.startObject();
        builder.field(JobConstant.NAME_FIELD, this.jobName)
            .field(JobConstant.ENABLED_FILED, this.isEnabled)
            .field(JobConstant.SCHEDULE_FIELD, this.schedule)
            .field(JobConstant.REPORT_DEFINITION_ID, this.reportDefinitionId);
        if (this.enabledTime != null) {
            builder.timeField(JobConstant.ENABLED_TIME_FILED, JobConstant.ENABLED_TIME_FILED, this.enabledTime.toEpochMilli());
        }
//        if (this.lastUpdateTime != null) {
//            builder.timeField(LAST_UPDATE_TIME_FIELD, LAST_UPDATE_TIME_FIELD, this.lastUpdateTime.toEpochMilli());
//        }
//        if (this.lockDurationSeconds != null) {
//            builder.field(LOCK_DURATION_SECONDS, this.lockDurationSeconds);
//        }
//        if (this.jitter != null) {
//            builder.field(JITTER, this.jitter);
//        }
        builder.endObject();
        return builder;
    }
}
