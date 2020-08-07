package com.amazon.opendistroforelasticsearch.reportsscheduler.rest.handler;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.utils.LockService;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.ReportsSchedulerJobRunner;
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
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Queue;

public class ReportsJobActionHandler extends AbstractActionHandler {
    private final LockService lockService;
    private static final Logger log = LogManager.getLogger(ReportsJobActionHandler.class);
    private final Long LOCK_DURATION_SECONDS = 300L;

    /**
     * Constructor function.
     *
     * @param client         ES node client that executes actions on the local node
     * @param channel        ES channel used to construct bytes / builder based outputs, and send responses
     * @param clusterService ES cluster service
     */
    public ReportsJobActionHandler(NodeClient client, RestChannel channel, ClusterService clusterService) {
        super(client, channel);
        this.lockService = new LockService(client, clusterService);
    }


    public void getJob() {
        // get all jobs from job_queue index
        SearchRequest searchRequest = new SearchRequest(ReportsSchedulerJobRunner.JOB_QUEUE_INDEX_NAME);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());

        // sort the document by enqueued time
        searchSourceBuilder.sort(new FieldSortBuilder("enqueue_time").order(SortOrder.DESC));
        searchRequest.source(searchSourceBuilder);
        client.search(searchRequest, ActionListener.wrap(response -> onSearchJobResponse(response), exception -> onFailure(exception)));
    }

    private void onSearchJobResponse(SearchResponse response) {
        SearchHits hits = response.getHits();
        SearchHit[] searchHits = hits.getHits();
        List<SearchHit> searchHitslist = Arrays.asList(searchHits);
        // randomize the jobs from job_queue index, for possible faster job retrieval from reporting core
        Collections.shuffle(searchHitslist);
        // Convert list of randomized search hits to queue
        Queue<SearchHit> searchHitsQueue = new LinkedList<>(searchHitslist);

        log.info("original queue size(before findFirstLock): " + searchHitsQueue.size());

        findFirstAvaliableJob(searchHitsQueue);
    }

    private void findFirstAvaliableJob(Queue<SearchHit> searchHitsQueue) {
        SearchHit hit = searchHitsQueue.poll();
        log.info("queue size after poll: " + searchHitsQueue.size());

        if (hit != null) {
            String jobId = hit.getId();
            // set up lock service required parameters
            JobParameter jobParameter = new JobParameter();
            jobParameter.setLockDurationSeconds(LOCK_DURATION_SECONDS);
            JobExecutionContext ctx = new JobExecutionContext(null, null, null, ReportsSchedulerJobRunner.JOB_QUEUE_INDEX_NAME, jobId);

            lockService.acquireLock(jobParameter, ctx, ActionListener.wrap(
                    lock -> {
                        if (lock == null) {
                            findFirstAvaliableJob(searchHitsQueue);
                        } else {
                            log.info("send job data(report_definition_id) to reporting core for execution");

                            RestResponse restResponse = new BytesRestResponse(RestStatus.OK, hit.toXContent(JsonXContent.contentBuilder(), null));
                            channel.sendResponse(restResponse);
                        }
                    },
                    exception -> {
                        throw new IllegalStateException("Failed to acquire lock.");
                    }
            ));
        } else {
            // return 404 if no jobs in the queue or all jobs are being executed now(being locked)
            channel.sendResponse(new BytesRestResponse(RestStatus.NOT_FOUND, "No jobs to execute"));
        }
    }

    public void updateJob(String jobId) {
        JobParameter p = new JobParameter();
        p.setLockDurationSeconds(LOCK_DURATION_SECONDS);
        JobExecutionContext cxt = new JobExecutionContext(null, null, null, ReportsSchedulerJobRunner.JOB_QUEUE_INDEX_NAME, jobId);

        String lockId = ReportsSchedulerJobRunner.JOB_QUEUE_INDEX_NAME + "-" + jobId;

        //remove job from queue
        DeleteRequest deleteRequest = new DeleteRequest()
                .index(ReportsSchedulerJobRunner.JOB_QUEUE_INDEX_NAME)
                .id(jobId);

        client.delete(deleteRequest, new ActionListener<DeleteResponse>() {
            @Override
            public void onResponse(DeleteResponse deleteResponse) {
                if (deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND) {
                    channel.sendResponse(new BytesRestResponse(RestStatus.NOT_FOUND, String.format(Locale.ROOT,"Job id %s doesn't exist", jobId)));
                } else if (deleteResponse.getResult() == DocWriteResponse.Result.DELETED) {
                    //delete lock
                    lockService.deleteLock(lockId, ActionListener.wrap(
                            deleted -> {
                                log.debug("Deleted lock: {}", deleted);
                                channel.sendResponse(new BytesRestResponse(RestStatus.OK, String.format(Locale.ROOT,
                                        "Job deleted from jobs queue. Job id: {%s}", jobId)));
                            },
                            exception -> log.debug("Failed to delete lock", exception)
                    ));
                }
            }

            @Override
            public void onFailure(Exception e) {
                channel.sendResponse(new BytesRestResponse(RestStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
            }
        });
    }
}
