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

package com.amazon.opendistroforelasticsearch.reportsscheduler;

import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.JOB_INDEX_NAME;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.Schedule;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.ReportsSchedulerJobRunnerProxy;
import java.io.IOException;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.function.Supplier;

import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.metadata.IndexNameExpressionResolver;
import org.elasticsearch.cluster.node.DiscoveryNodes;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.common.io.stream.NamedWriteableRegistry;
import org.elasticsearch.common.settings.ClusterSettings;
import org.elasticsearch.common.settings.IndexScopedSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.settings.SettingsFilter;
import org.elasticsearch.common.xcontent.NamedXContentRegistry;
import org.elasticsearch.common.xcontent.XContentParser;
import org.elasticsearch.common.xcontent.XContentParserUtils;
import org.elasticsearch.env.Environment;
import org.elasticsearch.env.NodeEnvironment;
import org.elasticsearch.plugins.ActionPlugin;
import org.elasticsearch.plugins.Plugin;
import org.elasticsearch.repositories.RepositoriesService;
import org.elasticsearch.rest.RestController;
import org.elasticsearch.rest.RestHandler;
import org.elasticsearch.script.ScriptService;
import org.elasticsearch.threadpool.ThreadPool;
import org.elasticsearch.watcher.ResourceWatcherService;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobSchedulerExtension;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParser;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.ScheduleParser;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobConstant;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;
import com.amazon.opendistroforelasticsearch.reportsscheduler.rest.RestReportsJobAction;
import com.amazon.opendistroforelasticsearch.reportsscheduler.rest.RestReportsScheduleAction;
import com.google.common.collect.ImmutableList;

/**
 * Reports scheduler plugin.
 *
 * <p>It use ".reports_scheduler" index to manage its scheduled jobs, and exposes a REST API
 * endpoint using {@link RestReportsJobAction} and {@link RestReportsScheduleAction}.
 */
public class ReportsSchedulerPlugin extends Plugin implements ActionPlugin, JobSchedulerExtension {
  private final ReportsSchedulerJobRunnerProxy jobRunner =
      ReportsSchedulerJobRunnerProxy.getJobRunnerInstance();
  private ClusterService clusterService;

  @Override
  public Collection<Object> createComponents(
      Client client,
      ClusterService clusterService,
      ThreadPool threadPool,
      ResourceWatcherService resourceWatcherService,
      ScriptService scriptService,
      NamedXContentRegistry xContentRegistry,
      Environment environment,
      NodeEnvironment nodeEnvironment,
      NamedWriteableRegistry namedWriteableRegistry,
      IndexNameExpressionResolver indexNameExpressionResolver,
      Supplier<RepositoriesService> repositoriesServiceSupplier) {
    jobRunner.createRunnerInstance(clusterService, threadPool, client);
    this.clusterService = clusterService;

    return Collections.emptyList();
  }

  @Override
  public String getJobType() {
    return "reports-scheduler";
  }

  @Override
  public String getJobIndex() {
    return JOB_INDEX_NAME;
  }

  @Override
  public ScheduledJobRunner getJobRunner() {
    return jobRunner;
  }

  @Override
  public ScheduledJobParser getJobParser() {
    return (parser, id, jobDocVersion) -> {
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
    };
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

  @Override
  public List<RestHandler> getRestHandlers(
      Settings settings,
      RestController restController,
      ClusterSettings clusterSettings,
      IndexScopedSettings indexScopedSettings,
      SettingsFilter settingsFilter,
      IndexNameExpressionResolver indexNameExpressionResolver,
      Supplier<DiscoveryNodes> nodesInCluster) {
    return ImmutableList.of(
        new RestReportsScheduleAction(settings),
        new RestReportsJobAction(settings, clusterService));
  }
}
