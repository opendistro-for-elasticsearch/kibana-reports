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

package com.amazon.opendistroforelasticsearch.reportsscheduler.rest;

import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.BASE_SCHEDULER_URI;

import java.util.List;

import org.elasticsearch.client.node.NodeClient;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.rest.BaseRestHandler;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestRequest;
import org.elasticsearch.rest.RestStatus;

import com.amazon.opendistroforelasticsearch.reportsscheduler.rest.handler.ReportsJobActionHandler;
import com.google.common.collect.ImmutableList;

public class RestReportsJobAction extends BaseRestHandler {
  public static final String SCHEDULER_JOB_ACTION = "reports_scheduler_job_action";
  private static final String JOB = "job";
  private static final String JOB_ID = "job_id";
  private static final String JOB_ID_URL = BASE_SCHEDULER_URI + "/" + JOB + "/{" + JOB_ID + "}";
  private static final String JOB_URL = BASE_SCHEDULER_URI + "/" + JOB;

  private final Settings settings;
  private final ClusterService clusterService;

  public RestReportsJobAction(Settings settings, ClusterService clusterService) {
    this.settings = settings;
    this.clusterService = clusterService;
  }

  @Override
  public String getName() {
    return SCHEDULER_JOB_ACTION;
  }

  @Override
  public List<Route> routes() {
    return ImmutableList.of(
        // update job status, release lock and remove job from queue.
        // POST /_opendistro/reports_scheduler/job/{job_id}
        new Route(RestRequest.Method.POST, JOB_ID_URL),
        // get triggered jobs from jobs queue.
        // GET /_opendistro/reports_scheduler/job
        new Route(RestRequest.Method.GET, JOB_URL));
  }

  @Override
  protected RestChannelConsumer prepareRequest(RestRequest request, NodeClient client) {
    final String jobId = request.param(JOB_ID);

    return channel -> {
      final ReportsJobActionHandler handler =
          new ReportsJobActionHandler(client, channel, clusterService);

      if (request.method().equals(RestRequest.Method.POST)) {
        handler.updateJob(jobId);
      } else if (request.method().equals(RestRequest.Method.GET)) {
        handler.getJob();
      } else {
        channel.sendResponse(
            new BytesRestResponse(
                RestStatus.METHOD_NOT_ALLOWED, request.method() + " is not allowed."));
      }
    };
  }
}
