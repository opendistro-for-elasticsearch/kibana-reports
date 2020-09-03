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

package com.amazon.opendistroforelasticsearch.notification.resthandler

import org.elasticsearch.rest.RestHandler
import org.elasticsearch.rest.RestRequest.Method.POST
import org.elasticsearch.test.ESTestCase
import org.junit.jupiter.api.Test

internal class SendRestHandlerTests : ESTestCase() {

    @Test
    fun `SendRestHandler name should return send`() {
        val restHandler = SendRestHandler()
        assertEquals("send", restHandler.name)
    }

    @Test
    fun `SendRestHandler routes should return send url`() {
        val restHandler = SendRestHandler()
        val routes = restHandler.routes()
        val actualRouteSize = routes.size
        val actualRoute = routes[0]
        val expectedRoute = RestHandler.Route(POST, "/_opendistro/_notification/send")
        assertEquals(1, actualRouteSize)
        assertEquals(expectedRoute.method, actualRoute.method)
        assertEquals(expectedRoute.path, actualRoute.path)
    }
}
