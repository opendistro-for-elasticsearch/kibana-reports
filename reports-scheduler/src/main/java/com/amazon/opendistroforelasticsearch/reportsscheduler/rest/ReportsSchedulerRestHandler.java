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

package com.amazon.opendistroforelasticsearch.reportsscheduler.rest;

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParser;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.IntervalSchedule;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.Schedule;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.schedule.ScheduleParser;
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.utils.LockService;
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobConstant;
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.parameter.JobParameter;
import com.amazon.opendistroforelasticsearch.sample.SampleJobParameter;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.node.NodeClient;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.common.xcontent.XContentParser;
import org.elasticsearch.common.xcontent.XContentParserUtils;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.common.xcontent.json.JsonXContent;
import org.elasticsearch.rest.BaseRestHandler;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestRequest;
import org.elasticsearch.rest.RestResponse;
import org.elasticsearch.rest.RestStatus;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * A sample rest handler that supports schedule and deschedule job operation
 *
 * Users need to provide "id", "index", "job_name", and "interval" parameter to schedule
 * a job. e.g.
 * {@code POST /_opendistro/scheduler_sample/watch?id=kibana-job-id&job_name=watch kibana index&index=.kibana_1&interval=1"}
 *
 * creates a job with id "1" and job name "watch kibana index", which logs ".kibana_1" index's shards info
 * every 1 minute
 *
 * Users can remove that job by calling
 * {@code DELETE /_opendistro/scheduler_sample/watch?id=kibana-job-id}
 */
public class ReportsSchedulerRestHandler extends BaseRestHandler {
    public static final String SCHEDULER_URI = "/_opendistro/reports_scheduler/schedule";

    @Override
    public String getName() {
        return "Reports Scheduler Handler";
    }

    @Override
    public List<Route> routes() {
        return Collections.unmodifiableList(Arrays.asList(
                new Route(RestRequest.Method.POST, SCHEDULER_URI),
                new Route(RestRequest.Method.DELETE, SCHEDULER_URI)
        ));
    }

    @Override
    protected RestChannelConsumer prepareRequest(RestRequest request, NodeClient client) {
        if (request.method().equals(RestRequest.Method.POST)) {
            // compose JobParameter object from request
            String id = request.param("id");

            //TODO: add start_time and Time_unit from request params or request body

            //TODO: parse the content not params.
            /**
             * {
             *
             *     "name": "Flights monthly report",
             *     "enabled": true, //boolean, default=true, required by ScheduledJobParameter
             *     "schedule": {
             *         "interval": {
             *             "period": 1,
             *             "unit": "MINUTES",
             *             "start_time": 1553112384
             *         }
             *
             *       },
             *     "report_definition_id":"23dasdfdasdas"
             *  }
             */

            if(id == null) {
                throw new IllegalArgumentException("Must specify id");
            }

            IndexRequest indexRequest = new IndexRequest()
                    .index(ReportsSchedulerPlugin.JOB_INDEX_NAME)
                    .id(id)
                    .source(request.requiredContent(), XContentType.JSON);

            return restChannel -> {
                // index the job parameter
                client.index(indexRequest, new ActionListener<IndexResponse>() {
                    @Override
                    public void onResponse(IndexResponse indexResponse) {
                        try {
                            RestResponse restResponse = new BytesRestResponse(RestStatus.OK,
                                    indexResponse.toXContent(JsonXContent.contentBuilder(), null));
                            restChannel.sendResponse(restResponse);
                        } catch(IOException e) {
                            restChannel.sendResponse(new BytesRestResponse(RestStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
                        }
                    }

                    @Override
                    public void onFailure(Exception e) {
                        restChannel.sendResponse(new BytesRestResponse(RestStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
                    }
                });
            };
        } else if (request.method().equals(RestRequest.Method.DELETE)) {
            // delete job parameter doc from index
            String id = request.param("id");
            DeleteRequest deleteRequest = new DeleteRequest()
                    .index(ReportsSchedulerPlugin.JOB_INDEX_NAME)
                    .id(id);

            return restChannel -> {
                client.delete(deleteRequest, new ActionListener<DeleteResponse>() {
                    @Override
                    public void onResponse(DeleteResponse deleteResponse) {
                        restChannel.sendResponse(new BytesRestResponse(RestStatus.OK, "Job deleted."));
                    }

                    @Override
                    public void onFailure(Exception e) {
                        restChannel.sendResponse(new BytesRestResponse(RestStatus.INTERNAL_SERVER_ERROR, e.getMessage()));
                    }
                });
            };
        } else {
            return restChannel -> {
                restChannel.sendResponse(new BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, request.method() + " is not allowed."));
            };
        }
    }
}
