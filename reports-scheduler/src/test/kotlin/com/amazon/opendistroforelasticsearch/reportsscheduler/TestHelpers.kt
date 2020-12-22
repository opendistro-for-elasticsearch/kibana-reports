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

package com.amazon.opendistroforelasticsearch.reportsscheduler

import com.google.gson.JsonObject
import com.google.gson.JsonParser
import org.junit.Assert
import java.time.Instant
import kotlin.test.assertTrue

fun constructReportDefinitionRequest(
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
                        "recipients":["nobody@email.com"],
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

fun jsonify(text: String): JsonObject {
    return JsonParser.parseString(text).asJsonObject
}

fun validateTimeNearRefTime(time: Instant, refTime: Instant, accuracySeconds: Long) {
    assertTrue(time.plusSeconds(accuracySeconds).isAfter(refTime))
    assertTrue(time.minusSeconds(accuracySeconds).isBefore(refTime))
}

fun validateTimeRecency(time: Instant, accuracySeconds: Long) {
    validateTimeNearRefTime(time, Instant.now(), accuracySeconds)
}

fun validateErrorResponse(response: JsonObject, statusCode: Int, errorType: String = "status_exception") {
    Assert.assertNotNull("Error response content should be generated", response)
    val status = response.get("status").asInt
    val error = response.get("error").asJsonObject
    val rootCause = error.get("root_cause").asJsonArray
    val type = error.get("type").asString
    val reason = error.get("reason").asString
    Assert.assertEquals(statusCode, status)
    Assert.assertEquals(errorType, type)
    Assert.assertNotNull(reason)
    Assert.assertNotNull(rootCause)
    Assert.assertTrue(rootCause.size() > 0)
}
