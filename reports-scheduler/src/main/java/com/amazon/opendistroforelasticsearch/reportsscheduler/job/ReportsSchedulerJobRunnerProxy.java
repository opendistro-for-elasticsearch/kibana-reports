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

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.plugins.Plugin;
import org.elasticsearch.threadpool.ThreadPool;

/**
 * Reports scheduler job runner proxy class.
 *
 * <p>The job runner should be a singleton class if it uses Elasticsearch client or other objects
 * passed from Elasticsearch. Because when registering the job runner to JobScheduler plugin,
 * Elasticsearch has not invoke plugins' createComponents() method. That is saying the plugin is not
 * completely initialized, and the Elasticsearch {@link Client}, {@link ClusterService} and other
 * objects are not available to plugin and this job runner.
 *
 * <p>So we have to move this job runner initialization to {@link Plugin} createComponents() method,
 * and using singleton job runner to ensure we register a usable job runner instance to JobScheduler
 * plugin.
 *
 */
public class ReportsSchedulerJobRunnerProxy implements ScheduledJobRunner {
  private static final Logger log = LogManager.getLogger(ScheduledJobRunner.class);
  private static ReportsSchedulerJobRunnerProxy INSTANCE;
  private ReportsSchedulerJobRunner implementation;

  public static ReportsSchedulerJobRunnerProxy getJobRunnerInstance() {
    if (INSTANCE != null) {
      return INSTANCE;
    }
    synchronized (ReportsSchedulerJobRunnerProxy.class) {
      if (INSTANCE != null) {
        return INSTANCE;
      }
      INSTANCE = new ReportsSchedulerJobRunnerProxy();
      return INSTANCE;
    }
  }

  public void createRunnerInstance(
      ClusterService clusterClient, ThreadPool threadPool, Client client) {
    if (implementation != null) {
      return;
    }
    synchronized (ReportsSchedulerJobRunnerProxy.class) {
      if (implementation != null) {
        return;
      }
      implementation = new ReportsSchedulerJobRunner(clusterClient, threadPool, client);
    }
  }

  private ReportsSchedulerJobRunnerProxy() {
    // Singleton class, use getJobRunner method instead of constructor
  }

  @Override
  public void runJob(ScheduledJobParameter jobParameter, JobExecutionContext context) {
    final ReportsSchedulerJobRunner local;
    synchronized (ReportsSchedulerJobRunnerProxy.class) {
      local = implementation;
    }

    if (local != null) {
      local.runJob(jobParameter, context);
    } else {
      log.error("Job runner is called before creating instance");
    }
  }
}
