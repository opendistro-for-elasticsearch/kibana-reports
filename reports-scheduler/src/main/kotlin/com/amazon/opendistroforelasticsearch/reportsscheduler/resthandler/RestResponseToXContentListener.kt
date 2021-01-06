/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler

import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.Metrics
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.BaseResponse
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.rest.BytesRestResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestResponse
import org.elasticsearch.rest.RestStatus
import org.elasticsearch.rest.action.RestToXContentListener

/**
 * Overrides RestToXContentListener REST based action listener that assumes the response is of type
 * {@link ToXContent} and automatically builds an XContent based response
 * (wrapping the toXContent in startObject/endObject).
 */
internal class RestResponseToXContentListener<Response : BaseResponse>(channel: RestChannel) : RestToXContentListener<Response>(
    channel
) {
    override fun buildResponse(response: Response, builder: XContentBuilder?): RestResponse? {
        super.buildResponse(response, builder)

        Metrics.REQUEST_TOTAL.counter.increment()
        Metrics.REQUEST_INTERVAL_COUNT.counter.increment()

        when (response.getStatus()) {
            in RestStatus.OK..RestStatus.MULTI_STATUS -> Metrics.REQUEST_SUCCESS.counter.increment()
            RestStatus.FORBIDDEN -> Metrics.REPORT_SECURITY_PERMISSION_ERROR.counter.increment()
            in RestStatus.UNAUTHORIZED..RestStatus.TOO_MANY_REQUESTS -> Metrics.REQUEST_USER_ERROR.counter.increment()
            else -> Metrics.REQUEST_SYSTEM_ERROR.counter.increment()
        }
        return BytesRestResponse(getStatus(response), builder)
    }

    /**
     * {@inheritDoc}
     */
    override fun getStatus(response: Response): RestStatus {
        return response.getStatus()
    }
}
