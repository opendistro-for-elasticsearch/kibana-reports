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
import com.amazon.opendistroforelasticsearch.reportsscheduler.constructReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.validateErrorResponse
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus
import org.junit.Assert

class ReportInstanceIT : PluginRestTestCase() {
    fun `test update on-demand report definition status to success after creation`() {
        val reportDefinitionRequest = constructReportDefinitionRequest()
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

        val updateStatus = """
            {
                "status":"Success",
                "statusText":"Operation completed"
            }
        """.trimIndent()
        val reportInstance = onDemandResponse.get("reportInstance").asJsonObject
        val reportInstanceId = reportInstance.get("id").asString
        val reportDefinitionUpdateResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/instance/$reportInstanceId",
            updateStatus,
            RestStatus.OK.status
        )
        Assert.assertNotNull("report definition should be updated", reportDefinitionUpdateResponse)
        Assert.assertEquals(
            reportInstanceId,
            reportDefinitionUpdateResponse.get("reportInstanceId").asString
        )
        val reportInstanceInfo = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/instance/$reportInstanceId",
            "",
            RestStatus.OK.status
        )
        val updatedReportInstance = reportInstanceInfo.get("reportInstance").asJsonObject
        val updatedReportInstanceStatus = updatedReportInstance.get("status").asString
        val updatedReportInstanceText = updatedReportInstance.get("statusText").asString
        Assert.assertEquals(
            "Success",
            updatedReportInstanceStatus
        )
        Assert.assertEquals(
            "Operation completed",
            updatedReportInstanceText
        )
    }

    fun `test update report instance status to failed after creation`() {
        val reportDefinitionRequest = constructReportDefinitionRequest()
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

        val updateStatus = """
            {
                "status":"Failed",
                "statusText":"Operation failed"
            }
        """.trimIndent()
        val reportInstance = onDemandResponse.get("reportInstance").asJsonObject
        val reportInstanceId = reportInstance.get("id").asString
        val reportDefinitionUpdateResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/instance/$reportInstanceId",
            updateStatus,
            RestStatus.OK.status
        )
        Assert.assertNotNull("report definition should be updated", reportDefinitionUpdateResponse)
        Assert.assertEquals(
            reportInstanceId,
            reportDefinitionUpdateResponse.get("reportInstanceId").asString
        )
        val reportInstanceInfo = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/instance/$reportInstanceId",
            "",
            RestStatus.OK.status
        )
        val updatedReportInstance = reportInstanceInfo.get("reportInstance").asJsonObject
        val updatedReportInstanceStatus = updatedReportInstance.get("status").asString
        val updatedReportInstanceText = updatedReportInstance.get("statusText").asString
        Assert.assertEquals(
            "Failed",
            updatedReportInstanceStatus
        )
        Assert.assertEquals(
            "Operation failed",
            updatedReportInstanceText
        )
    }

    fun `test update report instance status with invalid instance id`() {
        val reportDefinitionRequest = constructReportDefinitionRequest()
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )

        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)
        val updateStatus = """
            {
                "status":"Success",
                "statusText":"Operation completed"
            }
        """.trimIndent()

        val dummyInstanceId = "abcdefghijk123"
        val reportDefinitionUpdateResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/instance/$dummyInstanceId",
            updateStatus,
            RestStatus.NOT_FOUND.status
        )
        validateErrorResponse(reportDefinitionUpdateResponse, RestStatus.NOT_FOUND.status)
    }

    fun `test update report instance status with invalid update status`() {
        val reportDefinitionRequest = constructReportDefinitionRequest()
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

        val updateStatus = """
            {
                "invalidStatus":"Success",
                "statusText":"Operation completed"
            }
        """.trimIndent()
        val reportInstance = onDemandResponse.get("reportInstance").asJsonObject
        val reportInstanceId = reportInstance.get("id").asString

        val reportDefinitionUpdateResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/instance/$reportInstanceId",
            updateStatus,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(
            reportDefinitionUpdateResponse,
            RestStatus.BAD_REQUEST.status,
            "illegal_argument_exception"
        )
    }

    fun `test listing all report instances`() {
        val reportDefinitionRequest = constructReportDefinitionRequest()
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
        val reportInstance = onDemandResponse.get("reportInstance").asJsonObject
        val reportInstanceId = reportInstance.get("id").asString

        val addReportDefinition = constructReportDefinitionRequest(name = "new definition")
        val addReportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            addReportDefinition,
            RestStatus.OK.status
        )
        val newReportDefinitionId = addReportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", newReportDefinitionId)

        val newOnDemandResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/on_demand/$newReportDefinitionId",
            onDemandRequest,
            RestStatus.OK.status
        )
        val newReportInstance = newOnDemandResponse.get("reportInstance").asJsonObject
        val newReportInstanceId = newReportInstance.get("id").asString
        Thread.sleep(1000)
        val listReportInstancesResponse = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/instances",
            "",
            RestStatus.OK.status
        )
        val totalHits = listReportInstancesResponse.get("totalHits").asInt
        Assert.assertEquals(totalHits, 2)
        val reportInstanceList = listReportInstancesResponse.get("reportInstanceList").asJsonArray
        Assert.assertEquals(
            reportInstanceId, reportInstanceList[0].asJsonObject.get("id").asString
        )
        Assert.assertEquals(
            newReportInstanceId, reportInstanceList[1].asJsonObject.get("id").asString
        )
    }
}
