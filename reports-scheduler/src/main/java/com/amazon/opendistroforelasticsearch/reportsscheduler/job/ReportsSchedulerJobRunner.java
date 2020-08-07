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

package com.amazon.opendistroforelasticsearch.reportsscheduler.job;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;

import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.plugins.Plugin;
import org.elasticsearch.threadpool.ThreadPool;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * A sample job runner class.
 *
 * The job runner should be a singleton class if it uses Elasticsearch client or other objects passed
 * from Elasticsearch. Because when registering the job runner to JobScheduler plugin, Elasticsearch has
 * not invoke plugins' createComponents() method. That is saying the plugin is not completely initalized,
 * and the Elasticsearch {@link org.elasticsearch.client.Client}, {@link ClusterService} and other objects
 * are not available to plugin and this job runner.
 *
 * So we have to move this job runner intialization to {@link Plugin} createComponents() method, and using
 * singleton job runner to ensure we register a usable job runner instance to JobScheduler plugin.
 *
 * This sample job runner takes the "indexToWatch" from job parameter and logs that index's shards.
 */
public class ReportsSchedulerJobRunner implements ScheduledJobRunner {

    private static final Logger log = LogManager.getLogger(ScheduledJobRunner.class);
    public static final String JOB_QUEUE_INDEX_NAME = ".reports_scheduler_job_queue";

    private static ReportsSchedulerJobRunner INSTANCE;

    public static ReportsSchedulerJobRunner getJobRunnerInstance() {
        if(INSTANCE != null) {
            return INSTANCE;
        }
        synchronized (ReportsSchedulerJobRunner.class) {
            if(INSTANCE != null) {
                return INSTANCE;
            }
            INSTANCE = new ReportsSchedulerJobRunner();
            return INSTANCE;
        }
    }

    private ClusterService clusterService;
    private ThreadPool threadPool;
    private Client client;

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
        if(!(jobParameter instanceof JobParameter)) {
            throw new IllegalStateException("Job parameter is not instance of JobParameter, type: "
                    + jobParameter.getClass().getCanonicalName());
        }

        if(this.clusterService == null) {
            throw new IllegalStateException("ClusterService is not initialized.");
        }

        if (this.threadPool == null) {
            throw new IllegalStateException("ThreadPool is not initialized.");
        }

        Runnable runnable = () -> {

            JobParameter parameter = (JobParameter) jobParameter;
            String reportDefId = parameter.getReportDefinitionId();

            // compose json
            Map<String, Object> jsonMap = new HashMap<>();
            jsonMap.put("report_definition_id", reportDefId);
            jsonMap.put("enqueue_time", Instant.now().toEpochMilli());

            IndexRequest indexRequest = new IndexRequest()
                    .index(JOB_QUEUE_INDEX_NAME)
                    .id(reportDefId) //TODO: think about using job id from jobParameter
                    .source(jsonMap);

            client.index(indexRequest, new ActionListener<IndexResponse>() {
                @Override
                public void onResponse(IndexResponse indexResponse) {
                    log.info("Scheduled job triggered and push to queue, waiting to be picked up by Reporting Core");
                }

                @Override
                public void onFailure(Exception e) {
                    log.error(e.toString());
                }
            });

            //TODO: Save to a new index with report_definition_id


//            UpdateRequest request = new UpdateRequest(JOB_QUEUE_INDEX_NAME, reportDefId)
//                    .doc(jsonMap);
//
//
//            client.update(request, new ActionListener<UpdateResponse>() {
//                @Override
//                public void onResponse(UpdateResponse updateResponse) {
//                    log.info("Existing job triggered and pushed to queue, waiting to be picked up by Kibana");
//                }
//
//                @Override
//                public void onFailure(Exception e) {
//                    if (e instanceof ElasticsearchException) {
//                        if (((ElasticsearchException) e).status() == RestStatus.NOT_FOUND) {
//                            jsonMap.put("report_definition_id", reportDefId);
//                            jsonMap.put("is_locked", false);
//                            IndexRequest indexRequest = new IndexRequest()
//                                    .index(JOB_QUEUE_INDEX_NAME)
//                                    .id(reportDefId)
//                                    .source(jsonMap);
//
//                            client.index(indexRequest, new ActionListener<IndexResponse>() {
//                                @Override
//                                public void onResponse(IndexResponse indexResponse) {
//                                    log.info("New job created and push to queue, waiting to be picked up by Kibana"); // TODO: better log message
//                                }
//
//                                @Override
//                                public void onFailure(Exception e) {
//                                    log.error(e.toString());
//                                }
//                            });
//                        } else {
//                            log.error(e.toString());
//                        }
//                    } else {
//                        log.error(e.toString());
//                    }
//                }
//            });

        };

        threadPool.generic().submit(runnable);
    }
}
