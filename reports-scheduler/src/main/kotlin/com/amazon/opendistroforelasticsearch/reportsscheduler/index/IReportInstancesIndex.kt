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
 * Interface for Report instance index operations.
 */
internal interface IReportInstancesIndex {
    /**
     * create a new doc for reportInstance
     * @param reportInstance the report instance
     * @return ReportInstance.id if successful, null otherwise
     * @throws java.util.concurrent.ExecutionException with a cause
     */
    fun createReportInstance(reportInstance: ReportInstance): String?

    /**
     * Query index for report instance ID
     * @param id the id for the document
     * @return Report instance details on success, null otherwise
     */
    fun getReportInstance(id: String): ReportInstance?

    /**
     * Query index for report instance for given roles
     * @param roles the list of roles to search reports for.
     * @param from the paginated start index
     * @return list of Report instance details
     */
    fun getAllReportInstances(roles: List<String>, from: Int = 0): List<ReportInstance>

    /**
     * update Report instance details for given id
     * @param reportInstance the Report instance details data
     * @return true if successful, false otherwise
     */
    fun updateReportInstance(reportInstance: ReportInstance): Boolean

    /**
     * update Report instance details for given id
     * @param reportInstanceDoc the Report instance details doc data
     * @return true if successful, false otherwise
     */
    fun updateReportInstanceDoc(reportInstanceDoc: ReportInstanceDoc): Boolean

    /**
     * delete Report instance details for given id
     * @param id the id for the document
     * @return true if successful, false otherwise
     */
    fun deleteReportInstance(id: String): Boolean

    /**
     * Get pending report instances
     * @return ReportInstanceDoc list
     */
    fun getPendingReportInstances(): MutableList<ReportInstanceDoc>
}
