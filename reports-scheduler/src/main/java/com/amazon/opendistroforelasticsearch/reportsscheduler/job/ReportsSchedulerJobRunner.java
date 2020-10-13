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

import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.threadpool.ThreadPool;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;

import static com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.JOB_QUEUE_INDEX_NAME;

/**
 * This reports scheduler job runner will add a scheduled job to a queue index once it gets
 * triggered.
 */
public class ReportsSchedulerJobRunner implements ScheduledJobRunner {
  private static final Logger log = LogManager.getLogger(ScheduledJobRunner.class);

  private final ClusterService clusterService;
  private final ThreadPool threadPool;
  private final Client client;

  public ReportsSchedulerJobRunner(
      ClusterService clusterService, ThreadPool threadPool, Client client) {
    if (clusterService == null) {
      throw new IllegalArgumentException("ClusterService is not initialized");
    }

    if (threadPool == null) {
      throw new IllegalArgumentException("ThreadPool is not initialized");
    }

    this.clusterService = clusterService;
    this.threadPool = threadPool;
    this.client = client;
  }

  @Override
  public void runJob(ScheduledJobParameter jobParameter, JobExecutionContext context) {
    if (!(jobParameter instanceof JobParameter)) {
      throw new IllegalStateException(
          "Job parameter is not instance of JobParameter, type: "
              + jobParameter.getClass().getCanonicalName());
    }

    Runnable runnable =
        () -> {
          final JobParameter parameter = (JobParameter) jobParameter;
          final String reportDefinitionId = parameter.getReportDefinitionId();

          // compose json and save into job queue index
          final Map<String, Object> jsonMap = new HashMap<>();
          jsonMap.put("report_definition_id", reportDefinitionId);
          jsonMap.put("triggered_time", context.getExpectedExecutionTime().toEpochMilli());

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
