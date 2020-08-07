package com.amazon.opendistroforelasticsearch.reportsscheduler.rest;

import com.amazon.opendistroforelasticsearch.reportsscheduler.rest.handler.ReportsScheduleActionHandler;
import org.elasticsearch.client.node.NodeClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.rest.BaseRestHandler;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestRequest;

import java.util.List;
import java.util.Locale;
import com.google.common.collect.ImmutableList;
import org.elasticsearch.rest.RestStatus;
import static com.amazon.opendistroforelasticsearch.reportsscheduler.common.Constants.BASE_SCHEDULER_URI;


public class RestReportsScheduleAction extends BaseRestHandler {
    public static final String SCHEDULER_SCHEDULE_ACTION = "reports_scheduler_schedule_action";

    private final Settings settings;

    private final String SCHEDULE = "schedule";


    public RestReportsScheduleAction(Settings settings) {
        this.settings = settings;
    }

    @Override
    public String getName() {
        return SCHEDULER_SCHEDULE_ACTION;
    }

    @Override
    public List<Route> routes() {
        return ImmutableList
            .of(
                new Route(
                    RestRequest.Method.POST,
                    String.format(Locale.ROOT, "%s/%s", BASE_SCHEDULER_URI, SCHEDULE)
                ),
                new Route(
                    RestRequest.Method.DELETE,
                    String.format(Locale.ROOT, "%s/%s", BASE_SCHEDULER_URI, SCHEDULE)
                )
            );
    }


    @Override
    protected RestChannelConsumer prepareRequest(RestRequest request, NodeClient client) {
        String jobId = request.param("id");

        if(jobId == null) {
            throw new IllegalArgumentException("Must specify id");
        }

        return channel -> {
            ReportsScheduleActionHandler handler = new ReportsScheduleActionHandler(client, channel);

            if (request.method().equals(RestRequest.Method.POST)) {
                handler.createSchedule(jobId, request);
            } else if (request.method().equals(RestRequest.Method.DELETE)) {
                handler.deleteSchedule(jobId);
            } else {
                channel.sendResponse(new BytesRestResponse(RestStatus.METHOD_NOT_ALLOWED, request.method() + " is not allowed."));
            }
        };
    }
}
