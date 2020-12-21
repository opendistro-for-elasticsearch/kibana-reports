package com.amazon.opendistroforelasticsearch.reportsscheduler.rest

import com.amazon.opendistroforelasticsearch.reportsscheduler.PluginRestTestCase
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.BASE_REPORTS_URI
import com.amazon.opendistroforelasticsearch.reportsscheduler.jsonify
import org.elasticsearch.rest.RestRequest
import org.junit.Assert

class OnDemandReportGenerationIT : PluginRestTestCase() {
    fun `test create on-deman report definition`() {
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
                    },
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
        val reportDefinitionResponse = executeRequest(
            RestRequest.Method.POST.name,
            "$BASE_REPORTS_URI/definition",
            reportDefinitionRequest,
            200
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
            200
        )
        Assert.assertNotNull("reportInstance should be generated", onDemandResponse)
        Assert.assertEquals(
            reportDefinitionId,
            onDemandResponse.get("reportInstance").asJsonObject
                .get("reportDefinitionDetails").asJsonObject
                .get("id").asString
        )
        Assert.assertEquals(
            jsonify(reportDefinitionRequest)
                .get("reportDefinition").asJsonObject,
            onDemandResponse.get("reportInstance").asJsonObject
                .get("reportDefinitionDetails").asJsonObject
                .get("reportDefinition").asJsonObject
        )
        Assert.assertEquals(
            onDemandResponse.get("reportInstance").asJsonObject
                .get("tenant").asString,
            onDemandResponse.get("reportInstance").asJsonObject
                .get("reportDefinitionDetails").asJsonObject
                .get("tenant").asString
        )
    }
}
