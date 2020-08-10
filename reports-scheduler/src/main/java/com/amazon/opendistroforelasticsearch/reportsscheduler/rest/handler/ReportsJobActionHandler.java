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

package com.amazon.opendistroforelasticsearch.reportsscheduler.rest.handler;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.utils.LockService;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.node.NodeClient;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.common.xcontent.json.JsonXContent;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestChannel;
import org.elasticsearch.rest.RestResponse;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.common.Randomness;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Queue;

import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.JOB_QUEUE_INDEX_NAME;
import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.LOCK_DURATION_SECONDS;

public class ReportsJobActionHandler extends AbstractActionHandler {
  private final LockService lockService;
  private static final Logger log = LogManager.getLogger(ReportsJobActionHandler.class);

  /**
   * Constructor function.
   *
   * @param client ES node client that executes actions on the local node
   * @param channel ES channel used to construct bytes / builder based outputs, and send responses
   * @param clusterService ES cluster service
   */
  public ReportsJobActionHandler(
      NodeClient client, RestChannel channel, ClusterService clusterService) {
    super(client, channel);
    this.lockService = new LockService(client, clusterService);
  }

  public void getJob() {
    // get all jobs from job_queue index
    SearchRequest searchRequest = new SearchRequest(JOB_QUEUE_INDEX_NAME);
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.query(QueryBuilders.matchAllQuery());

    //    // sort the document by enqueue_time
    //    searchSourceBuilder.sort(new FieldSortBuilder("enqueue_time").order(SortOrder.DESC));
    searchRequest.source(searchSourceBuilder);
    client.search(
        searchRequest,
        ActionListener.wrap(
            response -> onSearchJobResponse(response), exception -> onFailure(exception)));
  }

  private void onSearchJobResponse(SearchResponse response) {
    SearchHits hits = response.getHits();
    SearchHit[] searchHits = hits.getHits();
    List<SearchHit> searchHitsList = Arrays.asList(searchHits);
    // randomize the jobs, for possible faster job retrieval
    Randomness.shuffle(searchHitsList);
    Queue<SearchHit> searchHitsQueue = new LinkedList<>(searchHitsList);

    log.info("original queue size: " + searchHitsQueue.size());

    findFirstAvailableJob(searchHitsQueue);
  }

  /**
   * Attempt to find single jobs that is not being locked, and send the job information back to
   * reporting core for job execution.
   *
   * @param searchHitsQueue a queue which saves all jobs from .reports_scheduler_job_queue index
   */
  private void findFirstAvailableJob(Queue<SearchHit> searchHitsQueue) {
    SearchHit hit = searchHitsQueue.poll();
    log.info("queue size after poll: " + searchHitsQueue.size());

    if (hit != null) {
      String jobId = hit.getId();
      // set up jobParamater and jobContext that is required by lockService
      JobParameter jobParameter = new JobParameter();
      jobParameter.setLockDurationSeconds(LOCK_DURATION_SECONDS);
      JobExecutionContext ctx =
          new JobExecutionContext(null, null, null, JOB_QUEUE_INDEX_NAME, jobId);

      lockService.acquireLock(
          jobParameter,
          ctx,
          ActionListener.wrap(
              lock -> {
                if (lock == null) {
                  findFirstAvailableJob(searchHitsQueue);
                } else {
                  log.info("send job data(report_definition_id) to reporting core for execution");

                  RestResponse restResponse =
                      new BytesRestResponse(
                          RestStatus.OK, hit.toXContent(JsonXContent.contentBuilder(), null));
                  channel.sendResponse(restResponse);
                }
              },
              exception -> {
                channel.sendResponse(
                    new BytesRestResponse(
                        RestStatus.INTERNAL_SERVER_ERROR, "Failed to acquire lock"));
                throw new IllegalStateException("Failed to acquire lock.");
              }));
    } else {
      log.info("No jobs to execute");
      channel.sendResponse(new BytesRestResponse(RestStatus.NO_CONTENT, "No jobs to execute"));
    }
  }

  /**
   * Once the report core(Kibana side) is done executing job, this function will be called to
   * delete/release the lock, remove the job from job queue(ES index) TODO: update the .report index
   *
   * @param jobId the id of the scheduled job
   */
  public void updateJob(String jobId) {
    // the lockId format is required by lockService to avoid conflict
    String lockId = JOB_QUEUE_INDEX_NAME + "-" + jobId;

    // remove job from queue
    DeleteRequest deleteRequest = new DeleteRequest().index(JOB_QUEUE_INDEX_NAME).id(jobId);

    client.delete(
        deleteRequest,
        new ActionListener<DeleteResponse>() {
          @Override
          public void onResponse(DeleteResponse deleteResponse) {
            if (deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND) {
              channel.sendResponse(
                  new BytesRestResponse(
                      RestStatus.NOT_FOUND,
                      String.format(Locale.ROOT, "Job id %s doesn't exist", jobId)));
            } else if (deleteResponse.getResult() == DocWriteResponse.Result.DELETED) {
              // delete lock of that job
              lockService.deleteLock(
                  lockId,
                  ActionListener.wrap(
                      deleted -> {
                        log.debug("Deleted lock: {}", deleted);
                        channel.sendResponse(
                            new BytesRestResponse(
                                RestStatus.OK,
                                String.format(
                                    Locale.ROOT,
                                    "Job deleted from jobs queue. Job id: %s",
                                    jobId)));
                      },
                      exception -> log.debug("Failed to delete lock", exception)));
            }
          }

          @Override
          public void onFailure(Exception e) {
            channel.sendResponse(
                new BytesRestResponse(RestStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
          }
        });
  }
}
