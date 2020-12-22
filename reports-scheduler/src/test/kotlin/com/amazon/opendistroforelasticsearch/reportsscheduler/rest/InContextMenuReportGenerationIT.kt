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
import com.amazon.opendistroforelasticsearch.reportsscheduler.validateTimeRecency
import org.elasticsearch.rest.RestRequest
import org.elasticsearch.rest.RestStatus
import org.junit.Assert
import java.time.Instant

class InContextMenuReportGenerationIT : PluginRestTestCase() {
    companion object {
        private const val TEST_REPORT_DEFINITION_ID = "fake-id-123"
    }
    fun `test create in-context-menu report`() {
        val downloadRequest = """
            {
                "beginTimeMs": 1604425466263,
                "endTimeMs": 1604429066263,
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263,
                    "reportDefinition": {
                        "name": "name",
                        "isEnabled": true,
                        "source": {
                            "description": "description",
                            "type": "Dashboard",
                            "origin":"localhost:5601",
                            "id": "id"
                        },
                        "format": {
                            "duration": "PT1H",
                            "fileFormat": "Pdf"
                        },
                        "trigger": {
                            "triggerType": "Download"
                        }
                    }
                },
                "status": "Success",
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.OK.status
        )
        Assert.assertNotNull("reportInstance should be generated", downloadResponse)
        val reportInstance = downloadResponse.get("reportInstance").asJsonObject
        val reportDefinitionDetails = reportInstance.get("reportDefinitionDetails").asJsonObject
        Assert.assertEquals(
            TEST_REPORT_DEFINITION_ID,
            reportDefinitionDetails.get("id").asString
        )
        Assert.assertEquals(
            jsonify(downloadRequest).get("beginTimeMs").asString,
            reportInstance.get("beginTimeMs").asString
        )
        Assert.assertEquals(
            jsonify(downloadRequest).get("endTimeMs").asString,
            reportInstance.get("endTimeMs").asString
        )
        Assert.assertEquals(
            jsonify(downloadRequest).get("status").asString,
            reportInstance.get("status").asString
        )
        Assert.assertEquals(
            jsonify(downloadRequest).get("statusText").asString,
            reportInstance.get("statusText").asString
        )
        Assert.assertEquals(
            jsonify(downloadRequest).get("inContextDownloadUrlPath").asString,
            reportInstance.get("inContextDownloadUrlPath").asString
        )
        validateTimeRecency(Instant.ofEpochMilli(reportInstance.get("lastUpdatedTimeMs").asLong))
        validateTimeRecency(Instant.ofEpochMilli(reportInstance.get("createdTimeMs").asLong))
    }

    fun `test create in-context-menu report from invalid source request`() {
        val downloadRequest = """
            {
                "beginTimeMs": 1604425466263,
                "endTimeMs": 1604429066263,
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263,
                    "reportDefinition": {
                        "name": "name",
                        "isEnabled": true,
                        "source": {
                            "description": "description",
                            "type": "Dashboard-invalid",
                            "origin":"localhost:5601",
                            "id": "id"
                        },
                        "format": {
                            "duration": "PT1H",
                            "fileFormat": "Pdf"
                        },
                        "trigger": {
                            "triggerType": "Download"
                        }
                    }
                },
                "status": "Success",
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(downloadResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
    }

    fun `test create in-context-menu report from invalid trigger request`() {
        val downloadRequest = """
            {
                "beginTimeMs": 1604425466263,
                "endTimeMs": 1604429066263,
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263,
                    "reportDefinition": {
                        "name": "name",
                        "isEnabled": true,
                        "source": {
                            "description": "description",
                            "type": "Dashboard",
                            "origin":"localhost:5601",
                            "id": "id"
                        },
                        "format": {
                            "duration": "PT1H",
                            "fileFormat": "Pdf"
                        },
                        "trigger": {
                            "triggerType": "CronSchedule"
                        }
                    }
                },
                "status": "Success",
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(downloadResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
    }

    fun `test create in-context-menu report from invalid format request`() {
        val downloadRequest = """
            {
                "beginTimeMs": 1604425466263,
                "endTimeMs": 1604429066263,
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263,
                    "reportDefinition": {
                        "name": "name",
                        "isEnabled": true,
                        "source": {
                            "description": "description",
                            "type": "Dashboard",
                            "origin":"localhost:5601",
                            "id": "id"
                        },
                        "format": {
                            "fileFormat": "Pdf"
                        },
                        "trigger": {
                            "triggerType": "Download"
                        }
                    }
                },
                "status": "Success",
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(downloadResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
    }

    fun `test create in-context-menu report without time request`() {
        val downloadRequest = """
            {
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263,
                    "reportDefinition": {
                        "name": "name",
                        "isEnabled": true,
                        "source": {
                            "description": "description",
                            "type": "Dashboard",
                            "origin":"localhost:5601",
                            "id": "id"
                        },
                        "format": {
                            "duration": "PT1H",
                            "fileFormat": "Pdf"
                        },
                        "trigger": {
                            "triggerType": "Download"
                        }
                    }
                },
                "status": "Success",
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(downloadResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
    }

    fun `test create in-context-menu report without status request`() {
        val downloadRequest = """
            {
                "beginTimeMs": 1604425466263,
                "endTimeMs": 1604429066263,
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263,
                    "reportDefinition": {
                        "name": "name",
                        "isEnabled": true,
                        "source": {
                            "description": "description",
                            "type": "Dashboard",
                            "origin":"localhost:5601",
                            "id": "id"
                        },
                        "format": {
                            "duration": "PT1H",
                            "fileFormat": "Pdf"
                        },
                        "trigger": {
                            "triggerType": "Download"
                        }
                    }
                },
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(downloadResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
    }

    fun `test create in-context-menu report without report definition request`() {
        val downloadRequest = """
            {
                "beginTimeMs": 1604425466263,
                "endTimeMs": 1604429066263,
                "reportDefinitionDetails": {
                    "id": "$TEST_REPORT_DEFINITION_ID",
                    "lastUpdatedTimeMs": 1604429066263,
                    "createdTimeMs": 1604429066263
                },
                "status": "Success",
                "statusText":"statusText",
                "inContextDownloadUrlPath": "/app/dashboard#view/dashboard-id"
            }
        """.trimIndent()
        val downloadResponse = executeRequest(
            RestRequest.Method.PUT.name,
            "$BASE_REPORTS_URI/on_demand",
            downloadRequest,
            RestStatus.BAD_REQUEST.status
        )
        validateErrorResponse(downloadResponse, RestStatus.BAD_REQUEST.status, "illegal_argument_exception")
    }
}
