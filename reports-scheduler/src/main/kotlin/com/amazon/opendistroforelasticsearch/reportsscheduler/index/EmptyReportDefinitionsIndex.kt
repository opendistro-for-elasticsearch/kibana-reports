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

package com.amazon.opendistroforelasticsearch.reportsscheduler.index

import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails

/**
 * Empty implementation of the ReportDefinitionsIndex which responds with IllegalStateException all operations.
 */
internal object EmptyReportDefinitionsIndex : IReportDefinitionsIndex {
    /**
     * {@inheritDoc}
     */
    override fun createReportDefinition(reportDefinitionDetails: ReportDefinitionDetails): String? {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun getReportDefinition(id: String): ReportDefinitionDetails? {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun getAllReportDefinitions(roles: List<String>, from: Int): List<ReportDefinitionDetails> {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun updateReportDefinition(id: String, reportDefinitionDetails: ReportDefinitionDetails): Boolean {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun deleteReportDefinition(id: String): Boolean {
        notInitializedError()
    }

    /**
     * throws IllegalStateException with not initialized message
     */
    private fun notInitializedError(): Nothing = throw IllegalStateException("ReportDefinitionsIndex not initialized")
}
