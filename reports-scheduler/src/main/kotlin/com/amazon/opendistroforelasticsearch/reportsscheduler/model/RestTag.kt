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
package com.amazon.opendistroforelasticsearch.reportsscheduler.model

/**
 * Plugin Rest common Tags.
 */
internal object RestTag {
    const val ID_FIELD = "id"
    const val STATUS_FIELD = "status"
    const val STATUS_TEXT_FIELD = "statusText"
    const val UPDATED_TIME_FIELD = "lastUpdatedTimeMs"
    const val CREATED_TIME_FIELD = "createdTimeMs"
    const val ROLE_LIST_FIELD = "roles"
    const val REPORT_DEFINITION_LIST_FIELD = "reportDefinitionDetailsList"
    const val REPORT_INSTANCE_LIST_FIELD = "reportInstanceList"
    const val REPORT_INSTANCE_FIELD = "reportInstance"
    const val REPORT_INSTANCE_ID_FIELD = "reportDefinitionId"
    const val IN_CONTEXT_DOWNLOAD_URL_FIELD = "inContextDownloadUrlPath"
    const val BEGIN_TIME_FIELD = "beginTimeMs"
    const val END_TIME_FIELD = "endTimeMs"
    const val REPORT_DEFINITION_FIELD = "reportDefinition"
    const val REPORT_DEFINITION_ID_FIELD = "reportDefinitionId"
    const val REPORT_DEFINITION_DETAILS_FIELD = "reportDefinitionDetails"
    const val FROM_INDEX_FIELD = "fromIndex"
    const val RETRY_AFTER_FIELD = "retryAfter"
}
