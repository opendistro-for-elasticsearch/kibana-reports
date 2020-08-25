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
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.rest.BaseRestHandler;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestRequest;
import org.elasticsearch.rest.RestStatus;

import com.amazon.opendistroforelasticsearch.reportsscheduler.rest.handler.ReportsScheduleActionHandler;
import com.google.common.collect.ImmutableList;

public class RestReportsScheduleAction extends BaseRestHandler {
  public static final String SCHEDULER_SCHEDULE_ACTION = "reports_scheduler_schedule_action";
  private final Settings settings;
  private static final String SCHEDULE = "schedule";
  private static final String JOB_ID = "job_id";
  private static final String SCHEDULE_URL = BASE_SCHEDULER_URI + "/" + SCHEDULE;

  public RestReportsScheduleAction(Settings settings) {
    this.settings = settings;
  }

  @Override
  public String getName() {
    return SCHEDULER_SCHEDULE_ACTION;
  }

  @Override
  public List<Route> routes() {
    return ImmutableList.of(
        // create a scheduled job from report definition
        // POST /_opendistro/reports_scheduler/schedule?job_id=<job_id>
        new Route(RestRequest.Method.POST, SCHEDULE_URL),
        // de-schedule a job
        // DELETE /_opendistro/reports_scheduler/schedule?job_id=<job_id>
        new Route(RestRequest.Method.DELETE, SCHEDULE_URL));
  }

  @Override
  protected RestChannelConsumer prepareRequest(RestRequest request, NodeClient client) {
    final String jobId = request.param(JOB_ID);

    if (jobId == null) {
      throw new IllegalArgumentException("Must specify id");
    }

    return channel -> {
      final ReportsScheduleActionHandler handler =
          new ReportsScheduleActionHandler(client, channel);

      if (request.method().equals(RestRequest.Method.POST)) {
        handler.createSchedule(jobId, request);
      } else if (request.method().equals(RestRequest.Method.DELETE)) {
        handler.deleteSchedule(jobId);
      } else {
        channel.sendResponse(
            new BytesRestResponse(
                RestStatus.METHOD_NOT_ALLOWED, request.method() + " is not allowed."));
      }
    };
  }
}
