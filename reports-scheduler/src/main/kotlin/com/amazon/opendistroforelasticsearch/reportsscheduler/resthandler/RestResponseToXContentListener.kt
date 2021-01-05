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
import com.amazon.opendistroforelasticsearch.reportsscheduler.metrics.MetricName
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.SUCCESS_END_STATUS_CODE
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.SUCCESS_START_STATUS_CODE
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.CLIENT_END_STATUS_CODE
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.CLIENT_START_STATUS_CODE
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.BaseResponse
import org.elasticsearch.rest.RestChannel
import org.elasticsearch.rest.RestStatus
import org.elasticsearch.rest.action.RestToXContentListener

/**
 * Overrides RestToXContentListener REST based action listener that assumes the response is of type
 * {@link ToXContent} and automatically builds an XContent based response
 * (wrapping the toXContent in startObject/endObject).
 */
internal class RestResponseToXContentListener<Response : BaseResponse>(channel: RestChannel) : RestToXContentListener<Response>(channel) {
    /**
     * {@inheritDoc}
     */
    override fun getStatus(response: Response): RestStatus {
        val restStatus = response.getStatus()
        when (restStatus.status) {
            in SUCCESS_START_STATUS_CODE..SUCCESS_END_STATUS_CODE -> Metrics.getInstance().getNumericalMetric(MetricName.REQUEST_SUCCESS).increment()
            RestStatus.FORBIDDEN.status -> Metrics.getInstance().getNumericalMetric(MetricName.REPORT_SECURITY_PERMISSION_ERROR).increment()
            in CLIENT_START_STATUS_CODE..CLIENT_END_STATUS_CODE -> Metrics.getInstance().getNumericalMetric(MetricName.REQUEST_USER_ERROR).increment()
            else -> Metrics.getInstance().getNumericalMetric(MetricName.REQUEST_SYSTEM_ERROR).increment()
        }

        return restStatus
    }
}
