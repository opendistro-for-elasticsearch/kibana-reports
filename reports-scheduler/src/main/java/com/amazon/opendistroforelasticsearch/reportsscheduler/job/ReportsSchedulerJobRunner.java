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

package com.amazon.opendistroforelasticsearch.reportsscheduler.job;

import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.JOB_QUEUE_INDEX_NAME;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.plugins.Plugin;
import org.elasticsearch.threadpool.ThreadPool;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;

/**
 * Reports scheduler job runner class.
 *
 * <p>The job runner should be a singleton class if it uses Elasticsearch client or other objects
 * passed from Elasticsearch. Because when registering the job runner to JobScheduler plugin,
 * Elasticsearch has not invoke plugins' createComponents() method. That is saying the plugin is not
 * completely initalized, and the Elasticsearch {@link org.elasticsearch.client.Client}, {@link
 * ClusterService} and other objects are not available to plugin and this job runner.
 *
 * <p>So we have to move this job runner intialization to {@link Plugin} createComponents() method,
 * and using singleton job runner to ensure we register a usable job runner instance to JobScheduler
 * plugin.
 *
 * <p>This reports scheduler job runner will write the report_definition_id
 */
public class ReportsSchedulerJobRunner implements ScheduledJobRunner {
  private static final Logger log = LogManager.getLogger(ScheduledJobRunner.class);
  private static ReportsSchedulerJobRunner INSTANCE;

  private ClusterService clusterService;
  private ThreadPool threadPool;
  private Client client;

  public static ReportsSchedulerJobRunner getJobRunnerInstance() {
    if (INSTANCE != null) {
      return INSTANCE;
    }
    synchronized (ReportsSchedulerJobRunner.class) {
      if (INSTANCE != null) {
        return INSTANCE;
      }
      INSTANCE = new ReportsSchedulerJobRunner();
      return INSTANCE;
    }
  }

  private ReportsSchedulerJobRunner() {
    // Singleton class, use getJobRunner method instead of constructor
  }

  public void setClient(Client client) {
    this.client = client;
  }

  public void setClusterService(ClusterService clusterService) {
    this.clusterService = clusterService;
  }

  public void setThreadPool(ThreadPool threadPool) {
    this.threadPool = threadPool;
  }

  @Override
  public void runJob(ScheduledJobParameter jobParameter, JobExecutionContext context) {
    if (!(jobParameter instanceof JobParameter)) {
      throw new IllegalStateException(
          "Job parameter is not instance of JobParameter, type: "
              + jobParameter.getClass().getCanonicalName());
    }

    if (this.clusterService == null) {
      throw new IllegalStateException("ClusterService is not initialized.");
    }

    if (this.threadPool == null) {
      throw new IllegalStateException("ThreadPool is not initialized.");
    }

    Runnable runnable =
        () -> {
          final JobParameter parameter = (JobParameter) jobParameter;
          final String reportDefinitionId = parameter.getReportDefinitionId();

          // compose json and save into job queue index
          final Map<String, Object> jsonMap = new HashMap<>();
          jsonMap.put("report_definition_id", reportDefinitionId);
          jsonMap.put("enqueue_time", Instant.now().toEpochMilli());

          final IndexRequest indexRequest =
              new IndexRequest().index(JOB_QUEUE_INDEX_NAME).id(reportDefinitionId).source(jsonMap);

          client.index(
              indexRequest,
              new ActionListener<IndexResponse>() {
                @Override
                public void onResponse(IndexResponse indexResponse) {
                  log.info(
                      "Scheduled job triggered and add to job queue index, waiting to be picked up by reporting core poller");
                }

                @Override
                public void onFailure(Exception e) {
                  log.error(
                      "Scheduled job gets triggered but fail to add to job queue index "
                          + e.toString());
                }
              });
        };
    threadPool.generic().submit(runnable);
  }
}
