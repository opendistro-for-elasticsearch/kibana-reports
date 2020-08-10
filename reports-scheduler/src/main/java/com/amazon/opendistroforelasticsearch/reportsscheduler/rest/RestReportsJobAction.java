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

import com.amazon.opendistroforelasticsearch.reportsscheduler.rest.handler.ReportsJobActionHandler;
import org.elasticsearch.client.node.NodeClient;
import org.elasticsearch.cluster.service.ClusterService;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.rest.BaseRestHandler;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestRequest;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.ImmutableList;
import org.elasticsearch.rest.RestStatus;

import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.BASE_SCHEDULER_URI;

public class RestReportsJobAction extends BaseRestHandler {
  public static final String SCHEDULER_JOB_ACTION = "reports_scheduler_job_action";
  private final String JOB = "job";
  private final String JOB_ID = "jobId";

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
        new Route(
            RestRequest.Method.POST,
            String.format(Locale.ROOT, "%s/%s/{%s}", BASE_SCHEDULER_URI, JOB, JOB_ID)),
        new Route(
            RestRequest.Method.GET, String.format(Locale.ROOT, "%s/%s", BASE_SCHEDULER_URI, JOB)));
  }

  @Override
  protected RestChannelConsumer prepareRequest(RestRequest request, NodeClient client) {
    String jobId = request.param(JOB_ID);

    return channel -> {
      ReportsJobActionHandler handler =
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
