/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter;

import java.io.IOException;
import java.time.Instant;

import org.elasticsearch.common.xcontent.XContentBuilder;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.Schedule;

/**
 * A report scheduled job parameter.
 *
 * <p>It adds an additional "reportDefinition" field to {@link ScheduledJobParameter}, which stores
 * the index the job runner will watch.
 */
public class JobParameter implements ScheduledJobParameter {

  private final String jobName;
  private final Instant enabledTime;
  private final String reportDefinitionId;
  private final boolean isEnabled;
  private final Schedule schedule;
  private final Instant lastUpdateTime;
  private final Long lockDurationSeconds;

  public JobParameter(
      String jobName,
      Instant enabledTime,
      String reportDefinitionId,
      boolean isEnabled,
      Schedule schedule,
      Instant lastUpdateTime,
      Long lockDurationSeconds) {
    this.jobName = jobName;
    this.enabledTime = enabledTime;
    this.reportDefinitionId = reportDefinitionId;
    this.isEnabled = isEnabled;
    this.schedule = schedule;
    this.lastUpdateTime = lastUpdateTime;
    this.lockDurationSeconds = lockDurationSeconds;
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

  public String getReportDefinitionId() {
    return this.reportDefinitionId;
  }

  @Override
  public XContentBuilder toXContent(XContentBuilder builder, Params params) throws IOException {
    builder.startObject();
    builder
        .field(JobConstant.NAME_FIELD, this.jobName)
        .field(JobConstant.ENABLED_FILED, this.isEnabled)
        .field(JobConstant.SCHEDULE_FIELD, this.schedule)
        .field(JobConstant.REPORT_DEFINITION_ID, this.reportDefinitionId);
    if (this.enabledTime != null) {
      builder.timeField(
          JobConstant.ENABLED_TIME_FILED,
          JobConstant.ENABLED_TIME_FILED,
          this.enabledTime.toEpochMilli());
    }
    builder.endObject();
    return builder;
  }
}
