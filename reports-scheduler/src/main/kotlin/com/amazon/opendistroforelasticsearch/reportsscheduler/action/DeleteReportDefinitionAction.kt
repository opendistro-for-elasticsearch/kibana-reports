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

package com.amazon.opendistroforelasticsearch.reportsscheduler.action

import com.amazon.opendistroforelasticsearch.commons.authuser.User
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionRequest
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.DeleteReportDefinitionResponse
import org.elasticsearch.action.ActionType
import org.elasticsearch.action.support.ActionFilters
import org.elasticsearch.client.Client
import org.elasticsearch.common.inject.Inject
import org.elasticsearch.common.xcontent.NamedXContentRegistry
import org.elasticsearch.transport.TransportService

/**
 * Delete reportDefinition transport action
 */
internal class DeleteReportDefinitionAction @Inject constructor(
    transportService: TransportService,
    client: Client,
    actionFilters: ActionFilters,
    val xContentRegistry: NamedXContentRegistry
) : PluginBaseAction<DeleteReportDefinitionRequest, DeleteReportDefinitionResponse>(NAME,
    transportService,
    client,
    actionFilters,
    ::DeleteReportDefinitionRequest) {
    companion object {
        private const val NAME = "cluster:admin/opendistro/reports/definition/delete"
        internal val ACTION_TYPE = ActionType(NAME, ::DeleteReportDefinitionResponse)
    }

    /**
     * {@inheritDoc}
     */
    override fun executeRequest(request: DeleteReportDefinitionRequest, user: User?): DeleteReportDefinitionResponse {
        return ReportDefinitionActions.delete(request, user)
    }
}
