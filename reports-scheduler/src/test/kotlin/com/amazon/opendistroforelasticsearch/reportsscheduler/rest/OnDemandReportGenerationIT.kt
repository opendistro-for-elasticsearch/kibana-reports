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

package com.amazon.opendistroforelasticsearch.reportsscheduler.rest

import com.amazon.opendistroforelasticsearch.reportsscheduler.PluginRestTestCase
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.BASE_REPORTS_URI
import com.amazon.opendistroforelasticsearch.reportsscheduler.jsonify
import com.amazon.opendistroforelasticsearch.reportsscheduler.validateErrorResponse
import com.amazon.opendistroforelasticsearch.reportsscheduler.validateTimeNearRefTime
import com.amazon.opendistroforelasticsearch.reportsscheduler.validateTimeRecency
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus
import org.junit.Assert
import java.time.Duration
import java.time.Instant

class OnDemandReportGenerationIT : PluginRestTestCase() {
    fun `test create on-demand report from definition`() {
        val reportDefinitionRequest = """
            {
                "reportDefinition":{
                    "name":"report_definition",
                    "isEnabled":true,
                    "source":{
                        "description":"description",
                        "type":"Dashboard",
                        "origin":"localhost:5601",
                        "id":"id"
                    },
                    "format":{
                        "duration":"PT1H",
                        "fileFormat":"Pdf",
                        "limit":1000,
                        "header":"optional header",
                        "footer":"optional footer"
                    },
                    "trigger":{
                        "triggerType":"OnDemand"
                    }
                }
            }
        """.trimIndent()
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)
        val onDemandRequest = """
            {}
        """.trimIndent()
        val onDemandResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/on_demand/$reportDefinitionId",
            onDemandRequest,
            RestStatus.OK.status
        )
        Assert.assertNotNull("reportInstance should be generated", onDemandResponse)
        val reportInstance = onDemandResponse.get("reportInstance").asJsonObject
        val reportDefinitionDetails = reportInstance.get("reportDefinitionDetails").asJsonObject
        val reportDefinition = reportDefinitionDetails.get("reportDefinition").asJsonObject
        Assert.assertEquals(
            reportDefinitionId,
            reportDefinitionDetails.get("id").asString
        )
        Assert.assertEquals(
            jsonify(reportDefinitionRequest)
                .get("reportDefinition").asJsonObject,
            reportDefinition
        )
        validateTimeRecency(Instant.ofEpochMilli(reportInstance.get("lastUpdatedTimeMs").asLong))
        validateTimeRecency(Instant.ofEpochMilli(reportInstance.get("createdTimeMs").asLong))
        validateTimeRecency(Instant.ofEpochMilli(reportInstance.get("endTimeMs").asLong))
        validateTimeNearRefTime(
            Instant.ofEpochMilli(reportInstance.get("beginTimeMs").asLong),
            Instant.now().minus(Duration.parse(reportDefinition.get("format").asJsonObject.get("duration").asString)),
            1
        )
        Assert.assertEquals(
            reportInstance.get("tenant").asString,
            reportDefinitionDetails.get("tenant").asString
        )
        Assert.assertEquals(reportInstance.get("status").asString, "Success")
        Assert.assertNull(reportInstance.get("statusText"))
        Assert.assertNull(reportInstance.get("inContextDownloadUrlPath"))
    }

    fun `test create on-demand report from invalid definition id`() {
        val reportDefinitionRequest = """
            {
                "reportDefinition":{
                    "name":"report_definition",
                    "isEnabled":true,
                    "source":{
                        "description":"description",
                        "type":"Dashboard",
                        "origin":"localhost:5601",
                        "id":"id"
                    },
                    "format":{
                        "duration":"PT1H",
                        "fileFormat":"Pdf",
                        "limit":1000,
                        "header":"optional header",
                        "footer":"optional footer"
                    },
                    "trigger":{
                        "triggerType":"OnDemand"
                    }
                }
            }
        """.trimIndent()
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString + "invalid"
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)
        val onDemandRequest = """
            {}
        """.trimIndent()
        val onDemandResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/on_demand/$reportDefinitionId",
            onDemandRequest,
            RestStatus.NOT_FOUND.status
        )
        validateErrorResponse(onDemandResponse, RestStatus.NOT_FOUND.status)
    }
}
