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
import org.elasticsearch.client.node.NodeClient
import org.elasticsearch.rest.BaseRestHandler
import org.elasticsearch.rest.RestRequest

abstract class PluginBaseHandler : BaseRestHandler() {

    /**
     * {@inheritDoc}
     */
    override fun prepareRequest(request: RestRequest, client: NodeClient): RestChannelConsumer {
        Metrics.REQUEST_TOTAL.counter.increment()
        Metrics.REQUEST_INTERVAL_COUNT.counter.increment()
        return executeRequest(request, client)
    }

    protected abstract fun executeRequest(request: RestRequest, client: NodeClient): RestChannelConsumer
}
