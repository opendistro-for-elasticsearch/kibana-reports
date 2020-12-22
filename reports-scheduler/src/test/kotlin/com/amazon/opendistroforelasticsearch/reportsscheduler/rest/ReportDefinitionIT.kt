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
import com.amazon.opendistroforelasticsearch.reportsscheduler.validateErrorResponse
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus
import org.junit.Assert

class ReportDefinitionIT : PluginRestTestCase() {
    private fun constructReportDefinitionRequest(
        trigger: String = """
            "trigger":{
                "triggerType":"OnDemand"
            },
        """.trimIndent(),
        name: String = "report_definition"
    ): String {
        return """
            {
                "reportDefinition":{
                    "name":"$name",
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
                    $trigger
                    "delivery":{
                        "recipients":["banantha@amazon.com"],
                        "deliveryFormat":"LinkOnly",
                        "title":"title",
                        "textDescription":"textDescription",
                        "htmlDescription":"optional htmlDescription",
                        "channelIds":["optional_channelIds"]
                    }
                }
            }
            """.trimIndent()
    }

    fun `test create, get, update, delete report definition`() {
        var reportDefinitionRequest = constructReportDefinitionRequest()
        var reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        var reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)

        reportDefinitionRequest = constructReportDefinitionRequest(
            """
                "trigger":{
                    "triggerType":"Download"
                },
            """.trimIndent()
        )
        reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(3000)

        val reportDefinitionsResponse = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/definitions",
            "",
            RestStatus.OK.status
        )
        Assert.assertEquals(2, reportDefinitionsResponse.get("totalHits").asInt)
        Thread.sleep(100)

        val newName = "updated_report"
        reportDefinitionRequest = constructReportDefinitionRequest(name = newName)
        reportDefinitionResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/definition/$reportDefinitionId",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        Assert.assertEquals(reportDefinitionId, reportDefinitionResponse.get("reportDefinitionId").asString)
        Thread.sleep(100)

        reportDefinitionResponse = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/definition/$reportDefinitionId",
            "",
            RestStatus.OK.status
        )
        Assert.assertEquals(
            reportDefinitionId,
            reportDefinitionResponse.get("reportDefinitionDetails").asJsonObject.get("id").asString
        )
        Assert.assertEquals(
            newName,
            reportDefinitionResponse.get("reportDefinitionDetails").asJsonObject.get("reportDefinition").asJsonObject.get(
                "name"
            ).asString
        )
        Thread.sleep(100)

        reportDefinitionResponse = executeRequest(
            RestRequest.Method.DELETE.name,
            "$BASE_REPORTS_URI/definition/$reportDefinitionId",
            "",
            RestStatus.OK.status
        )
        Assert.assertEquals(reportDefinitionId, reportDefinitionResponse.get("reportDefinitionId").asString)
        Thread.sleep(100)

        reportDefinitionResponse = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/definition/$reportDefinitionId",
            "",
            RestStatus.NOT_FOUND.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.NOT_FOUND.status)
        Thread.sleep(100)
    }

    fun `test invalid get, update, delete report definition`() {
        var reportDefinitionResponse = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/definition/invalid-id",
            "",
            RestStatus.NOT_FOUND.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.NOT_FOUND.status)
        Thread.sleep(100)

        reportDefinitionResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/definition/invalid-id",
            constructReportDefinitionRequest(),
            RestStatus.NOT_FOUND.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.NOT_FOUND.status)
        Thread.sleep(100)

        reportDefinitionResponse = executeRequest(
            RestRequest.Method.DELETE.name,
            "$BASE_REPORTS_URI/definition/invalid-id",
            "",
            RestStatus.NOT_FOUND.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.NOT_FOUND.status)
        Thread.sleep(100)
    }

    fun `test create cron scheduled report definition`() {
        val trigger = """
            "trigger":{
                "triggerType":"CronSchedule",
                "schedule":{
                    "cron":{
                        "expression":"0 * * * *",
                        "timezone":"America/Los_Angeles"
                    }
                }
            },
        """.trimIndent()
        val reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)
    }

    fun `test create interval scheduled report definition`() {
        val trigger = """
            "trigger":{
                "triggerType":"IntervalSchedule",
                "schedule":{
                    "interval":{
                        "start_time":1603506908773,
                        "period":"10",
                        "unit":"Minutes"
                    }
                }
            },
        """.trimIndent()
        val reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.OK.status
        )
        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)
    }

    fun `test create invalid cron scheduled report definition`() {
        var trigger = """
            "trigger":{
                "triggerType":"CronSchedule"
            },
        """.trimIndent()
        var reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        var reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
        Thread.sleep(100)

        trigger = """
            "trigger":{
                "triggerType":"CronSchedule",
                "schedule":{
                    "cron":{
                        "expression":"1234567",
                        "timezone":"America/Los_Angeles"
                    }
                }
            },
        """.trimIndent()
        reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
        Thread.sleep(100)
    }

    fun `test create invalid interval scheduled report definition`() {
        var trigger = """
            "trigger":{
                "triggerType":"IntervalSchedule"
            },
        """.trimIndent()
        var reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        var reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
        Thread.sleep(100)

        trigger = """
            "trigger":{
                "triggerType":"IntervalSchedule",
                "schedule":{
                    "interval":{
                    }
                }
            },
        """.trimIndent()
        reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(reportDefinitionResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
        Thread.sleep(100)
    }
}
