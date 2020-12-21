package com.amazon.opendistroforelasticsearch.reportsscheduler.rest

import com.amazon.opendistroforelasticsearch.reportsscheduler.PluginRestTestCase
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.BASE_REPORTS_URI
import org.elasticsearch.rest.RestRequest
import org.junit.Assert

class ReportDefinitionIT : PluginRestTestCase() {
    private fun constructReportDefinitionRequest(
        trigger: String,
        type: String = "Dashboard",
        origin: String = "localhost:5601"
    ): String {
        return """
            {
                "reportDefinition":{
                    "name":"report_definition",
                    "isEnabled":true,
                    "source":{
                        "description":"description",
                        "type":"$type",
                        "origin":"$origin",
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

    fun `test create and get on-demand report definition`() {
        val trigger = """
            "trigger":{
                "triggerType":"OnDemand"
            },
        """.trimIndent()
        val createReportDefinitionRequest = constructReportDefinitionRequest(trigger)
        val createReportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            createReportDefinitionRequest,
            200
        )
        val reportDefinitionId = createReportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)

        val getReportDefinitionResponse = executeRequest(
            RestRequest.Method.GET.name,
            "$BASE_REPORTS_URI/definition/$reportDefinitionId",
            "",
            200
        )
        Assert.assertEquals(
            reportDefinitionId,
            getReportDefinitionResponse.get("reportDefinitionDetails").asJsonObject.get("id").asString
        )
        Thread.sleep(100)
    }

    fun `test create download report definition`() {
        val trigger = """
            "trigger":{
                "triggerType":"Download"
            },
        """.trimIndent()
        val reportDefinitionRequest = constructReportDefinitionRequest(trigger)
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            200
        )
        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
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
            200
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
            200
        )
        val reportDefinitionId = reportDefinitionResponse.get("reportDefinitionId").asString
        Assert.assertNotNull("reportDefinitionId should be generated", reportDefinitionId)
        Thread.sleep(100)
    }

//    fun `test create invalid cron scheduled report definition`() {
//        var trigger = """
//            "trigger":{
//                "triggerType":"CronSchedule"
//            },
//        """.trimIndent()
//        var reportDefinitionRequest = constructReportDefinitionRequest(trigger)
//        var reportDefinitionResponse = executeRequest(
//            RestRequest.Method.POST.name,
//            "$BASE_REPORTS_URI/definition",
//            reportDefinitionRequest,
//            400
//        )
//        Assert.assertEquals(
//            "{\"error\":{\"root_cause\":[{\"type\":\"illegal_argument_exception\",\"reason\":\"schedule field absent\"}],\"type\":\"illegal_argument_exception\",\"reason\":\"schedule field absent\"},\"status\":400}",
//            reportDefinitionResponse.toString()
//        )
//        Thread.sleep(100)
//        trigger = """
//            "trigger":{
//                "triggerType":"CronSchedule",
//                "schedule":{
//                    "cron":{
//                        "expression":"0 ",
//                        "timezone":"PST"
//                    },
//                },
//            },
//        """.trimIndent()
//        reportDefinitionRequest = constructReportDefinitionRequest(trigger)
//        reportDefinitionResponse = executeRequest(
//            RestRequest.Method.POST.name,
//            "$BASE_REPORTS_URI/definition",
//            reportDefinitionRequest,
//            500
//        )
//        Assert.assertEquals(
//            "{\"error\":{\"root_cause\":[{\"type\":\"zone_rules_exception\",\"reason\":\"Unknown time-zone ID: PST\"}],\"type\":\"zone_rules_exception\",\"reason\":\"Unknown time-zone ID: PST\"},\"status\":500}",
//            reportDefinitionResponse.toString()
//        )
//    }

}

