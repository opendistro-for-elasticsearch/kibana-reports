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

import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstanceDoc

/**
 * Empty implementation of the ReportInstancesIndex which responds with IllegalStateException all operations.
 */
internal object EmptyReportInstancesIndex : IReportInstancesIndex {
    /**
     * {@inheritDoc}
     */
    override fun createReportInstance(reportInstance: ReportInstance): String? {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun getReportInstance(id: String): ReportInstance? {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun getAllReportInstances(roles: List<String>, from: Int): List<ReportInstance> {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun updateReportInstance(reportInstance: ReportInstance): Boolean {
        notInitializedError()
    }

    override fun updateReportInstanceDoc(reportInstanceDoc: ReportInstanceDoc): Boolean {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun deleteReportInstance(id: String): Boolean {
        notInitializedError()
    }

    /**
     * {@inheritDoc}
     */
    override fun getPendingReportInstances(): MutableList<ReportInstanceDoc> {
        notInitializedError()
    }

    /**
     * throws IllegalStateException with not initialized message
     */
    private fun notInitializedError(): Nothing = throw IllegalStateException("ReportInstancesIndex not initialized")
}
