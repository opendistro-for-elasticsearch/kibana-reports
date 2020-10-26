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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstanceDoc
import org.elasticsearch.client.Client
import org.elasticsearch.cluster.service.ClusterService

/**
 * The object class which provides abstraction over all index operations
 */
@Suppress("TooManyFunctions")
internal object IndexManager {
    private var reportInstancesIndex: IReportInstancesIndex = EmptyReportInstancesIndex
    private var reportDefinitionsIndex: IReportDefinitionsIndex = EmptyReportDefinitionsIndex

    /**
     * Initialize the class
     * @param client The ES client
     * @param clusterService The ES cluster service
     */
    fun initialize(client: Client, clusterService: ClusterService) {
        this.reportInstancesIndex = ReportInstancesIndex(client, clusterService)
        this.reportDefinitionsIndex = ReportDefinitionsIndex(client, clusterService)
    }

    /**
     * create a new doc for reportDefinitionDetails
     * @param reportDefinitionDetails the Report definition details
     * @return ReportDefinition.id if successful, null otherwise
     * @throws java.util.concurrent.ExecutionException with a cause
     */
    fun createReportDefinition(reportDefinitionDetails: ReportDefinitionDetails): String? {
        reportDefinitionsIndex.createIndex()
        return reportDefinitionsIndex.createReportDefinition(reportDefinitionDetails)
    }

    /**
     * Query index for report definition ID
     * @param id the id for the document
     * @return Report definition details on success, null otherwise
     */
    fun getReportDefinition(id: String): ReportDefinitionDetails? {
        reportDefinitionsIndex.createIndex()
        return reportDefinitionsIndex.getReportDefinition(id)
    }

    /**
     * Query index for report definition for given ownerId
     * @param ownerId the owner ID
     * @param from the paginated start index
     * @return list of Report definition details
     */
    fun getAllReportDefinitions(ownerId: String, from: Int = 0): List<ReportDefinitionDetails> {
        reportDefinitionsIndex.createIndex()
        return reportDefinitionsIndex.getAllReportDefinitions(ownerId, from)
    }

    /**
     * update Report definition details for given id
     * @param id the id for the document
     * @param reportDefinitionDetails the Report definition details data
     * @return true if successful, false otherwise
     */
    fun updateReportDefinition(id: String, reportDefinitionDetails: ReportDefinitionDetails): Boolean {
        reportDefinitionsIndex.createIndex()
        return reportDefinitionsIndex.updateReportDefinition(id, reportDefinitionDetails)
    }

    /**
     * delete Report definition details for given id
     * @param id the id for the document
     * @return true if successful, false otherwise
     */
    fun deleteReportDefinition(id: String): Boolean {
        reportDefinitionsIndex.createIndex()
        return reportDefinitionsIndex.deleteReportDefinition(id)
    }

    /**
     * create a new doc for reportInstance
     * @param reportInstance the report instance
     * @return ReportInstance.id if successful, null otherwise
     * @throws java.util.concurrent.ExecutionException with a cause
     */
    fun createReportInstance(reportInstance: ReportInstance): String? {
        reportInstancesIndex.createIndex()
        return reportInstancesIndex.createReportInstance(reportInstance)
    }

    /**
     * Query index for report instance ID
     * @param id the id for the document
     * @return Report instance details on success, null otherwise
     */
    fun getReportInstance(id: String): ReportInstance? {
        reportInstancesIndex.createIndex()
        return reportInstancesIndex.getReportInstance(id)
    }

    /**
     * Query index for report instance for given ownerId
     * @param ownerId the owner ID
     * @param from the paginated start index
     * @return list of Report instance details
     */
    fun getAllReportInstances(ownerId: String, from: Int = 0): List<ReportInstance> {
        reportInstancesIndex.createIndex()
        return reportInstancesIndex.getAllReportInstances(ownerId, from)
    }

    /**
     * update Report instance details for given id
     * @param reportInstance the Report instance details data
     * @return true if successful, false otherwise
     */
    fun updateReportInstance(reportInstance: ReportInstance): Boolean {
        reportInstancesIndex.createIndex()
        return reportInstancesIndex.updateReportInstance(reportInstance)
    }

    /**
     * update Report instance details for given id
     * @param reportInstanceDoc the Report instance details doc data
     * @return true if successful, false otherwise
     */
    fun updateReportInstanceDoc(reportInstanceDoc: ReportInstanceDoc): Boolean {
        reportInstancesIndex.createIndex()
        return reportInstancesIndex.updateReportInstanceDoc(reportInstanceDoc)
    }

    /**
     * Get pending report instances
     * @return ReportInstanceDoc list
     */
    fun getPendingReportInstances(): MutableList<ReportInstanceDoc> {
        reportInstancesIndex.createIndex()
        return reportInstancesIndex.getPendingReportInstances()
    }
}
