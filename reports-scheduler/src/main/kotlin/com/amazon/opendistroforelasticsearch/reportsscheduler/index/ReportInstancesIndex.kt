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

import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance.Status
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstanceDoc
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstanceSearchResults
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.ACCESS_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.STATUS_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.TENANT_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.RestTag.UPDATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.SecureIndexClient
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import org.elasticsearch.ResourceAlreadyExistsException
import org.elasticsearch.action.DocWriteResponse
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest
import org.elasticsearch.action.delete.DeleteRequest
import org.elasticsearch.action.get.GetRequest
import org.elasticsearch.action.index.IndexRequest
import org.elasticsearch.action.search.SearchRequest
import org.elasticsearch.action.update.UpdateRequest
import org.elasticsearch.client.Client
import org.elasticsearch.cluster.service.ClusterService
import org.elasticsearch.common.unit.TimeValue
import org.elasticsearch.common.xcontent.LoggingDeprecationHandler
import org.elasticsearch.common.xcontent.NamedXContentRegistry
import org.elasticsearch.common.xcontent.XContentType
import org.elasticsearch.index.query.QueryBuilders
import org.elasticsearch.search.builder.SearchSourceBuilder
import java.time.Instant
import java.util.concurrent.TimeUnit

/**
 * Class for doing ES index operation to maintain report instances in cluster.
 */
internal object ReportInstancesIndex {
    private val log by logger(ReportInstancesIndex::class.java)
    private const val REPORT_INSTANCES_INDEX_NAME = ".opendistro-reports-instances"
    private const val REPORT_INSTANCES_MAPPING_FILE_NAME = "report-instances-mapping.yml"
    private const val REPORT_INSTANCES_SETTINGS_FILE_NAME = "report-instances-settings.yml"
    private const val MAPPING_TYPE = "_doc"

    private lateinit var client: Client
    private lateinit var clusterService: ClusterService

    /**
     * Initialize the class
     * @param client The ES client
     * @param clusterService The ES cluster service
     */
    fun initialize(client: Client, clusterService: ClusterService) {
        this.client = SecureIndexClient(client)
        this.clusterService = clusterService
    }

    /**
     * Create index using the mapping and settings defined in resource
     */
    @Suppress("TooGenericExceptionCaught")
    private fun createIndex() {
        if (!isIndexExists()) {
            val classLoader = ReportInstancesIndex::class.java.classLoader
            val indexMappingSource = classLoader.getResource(REPORT_INSTANCES_MAPPING_FILE_NAME)?.readText()!!
            val indexSettingsSource = classLoader.getResource(REPORT_INSTANCES_SETTINGS_FILE_NAME)?.readText()!!
            val request = CreateIndexRequest(REPORT_INSTANCES_INDEX_NAME)
                .mapping(MAPPING_TYPE, indexMappingSource, XContentType.YAML)
                .settings(indexSettingsSource, XContentType.YAML)
            try {
                val actionFuture = client.admin().indices().create(request)
                val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
                if (response.isAcknowledged) {
                    log.info("$LOG_PREFIX:Index $REPORT_INSTANCES_INDEX_NAME creation Acknowledged")
                } else {
                    throw IllegalStateException("$LOG_PREFIX:Index $REPORT_INSTANCES_INDEX_NAME creation not Acknowledged")
                }
            } catch (exception: Exception) {
                if (exception !is ResourceAlreadyExistsException && exception.cause !is ResourceAlreadyExistsException) {
                    throw exception
                }
            }
        }
    }

    /**
     * Check if the index is created and available.
     * @return true if index is available, false otherwise
     */
    private fun isIndexExists(): Boolean {
        val clusterState = clusterService.state()
        return clusterState.routingTable.hasIndex(REPORT_INSTANCES_INDEX_NAME)
    }

    /**
     * create a new doc for reportInstance
     * @param reportInstance the report instance
     * @return ReportInstance.id if successful, null otherwise
     * @throws java.util.concurrent.ExecutionException with a cause
     */
    fun createReportInstance(reportInstance: ReportInstance): String? {
        createIndex()
        val indexRequest = IndexRequest(REPORT_INSTANCES_INDEX_NAME)
            .source(reportInstance.toXContent())
            .create(true)
        val actionFuture = client.index(indexRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        return if (response.result != DocWriteResponse.Result.CREATED) {
            log.warn("$LOG_PREFIX:createReportInstance - response:$response")
            null
        } else {
            response.id
        }
    }

    /**
     * Query index for report instance ID
     * @param id the id for the document
     * @return Report instance details on success, null otherwise
     */
    fun getReportInstance(id: String): ReportInstance? {
        createIndex()
        val getRequest = GetRequest(REPORT_INSTANCES_INDEX_NAME).id(id)
        val actionFuture = client.get(getRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        return if (response.sourceAsString == null) {
            log.warn("$LOG_PREFIX:getReportInstance - $id not found; response:$response")
            null
        } else {
            val parser = XContentType.JSON.xContent().createParser(NamedXContentRegistry.EMPTY,
                LoggingDeprecationHandler.INSTANCE,
                response.sourceAsString)
            parser.nextToken()
            ReportInstance.parse(parser, id)
        }
    }

    /**
     * Query index for report instance for given access details
     * @param tenant the tenant of the user
     * @param access the list of access details to search reports for.
     * @param from the paginated start index
     * @param maxItems the max items to query
     * @return search result of Report instance details
     */
    fun getAllReportInstances(tenant: String, access: List<String>, from: Int, maxItems: Int): ReportInstanceSearchResults {
        createIndex()
        val sourceBuilder = SearchSourceBuilder()
            .timeout(TimeValue(PluginSettings.operationTimeoutMs, TimeUnit.MILLISECONDS))
            .sort(UPDATED_TIME_FIELD)
            .size(maxItems)
            .from(from)
        val tenantQuery = QueryBuilders.termsQuery(TENANT_FIELD, tenant)
        if (access.isNotEmpty()) {
            val accessQuery = QueryBuilders.termsQuery(ACCESS_LIST_FIELD, access)
            val query = QueryBuilders.boolQuery()
            query.filter(tenantQuery)
            query.filter(accessQuery)
            sourceBuilder.query(query)
        } else {
            sourceBuilder.query(tenantQuery)
        }
        val searchRequest = SearchRequest()
            .indices(REPORT_INSTANCES_INDEX_NAME)
            .source(sourceBuilder)
        val actionFuture = client.search(searchRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        val result = ReportInstanceSearchResults(from.toLong(), response)
        log.info("$LOG_PREFIX:getAllReportInstances from:$from, maxItems:$maxItems," +
            " retCount:${result.objectList.size}, totalCount:${result.totalHits}")
        return result
    }

    /**
     * update Report instance details for given id
     * @param reportInstance the Report instance details data
     * @return true if successful, false otherwise
     */
    fun updateReportInstance(reportInstance: ReportInstance): Boolean {
        createIndex()
        val updateRequest = UpdateRequest()
            .index(REPORT_INSTANCES_INDEX_NAME)
            .id(reportInstance.id)
            .doc(reportInstance.toXContent())
            .fetchSource(true)
        val actionFuture = client.update(updateRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.UPDATED) {
            log.warn("$LOG_PREFIX:updateReportInstance failed for ${reportInstance.id}; response:$response")
        }
        return response.result == DocWriteResponse.Result.UPDATED
    }

    /**
     * update Report instance details for given id
     * @param reportInstanceDoc the Report instance details doc data
     * @return true if successful, false otherwise
     */
    fun updateReportInstanceDoc(reportInstanceDoc: ReportInstanceDoc): Boolean {
        createIndex()
        val updateRequest = UpdateRequest()
            .index(REPORT_INSTANCES_INDEX_NAME)
            .id(reportInstanceDoc.reportInstance.id)
            .setIfSeqNo(reportInstanceDoc.seqNo)
            .setIfPrimaryTerm(reportInstanceDoc.primaryTerm)
            .doc(reportInstanceDoc.reportInstance.toXContent())
            .fetchSource(true)
        val actionFuture = client.update(updateRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.UPDATED) {
            log.warn("$LOG_PREFIX:updateReportInstanceDoc failed for ${reportInstanceDoc.reportInstance.id}; response:$response")
        }
        return response.result == DocWriteResponse.Result.UPDATED
    }

    /**
     * delete Report instance details for given id
     * @param id the id for the document
     * @return true if successful, false otherwise
     */
    fun deleteReportInstance(id: String): Boolean {
        createIndex()
        val deleteRequest = DeleteRequest()
            .index(REPORT_INSTANCES_INDEX_NAME)
            .id(id)
        val actionFuture = client.delete(deleteRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.DELETED) {
            log.warn("$LOG_PREFIX:deleteReportInstance failed for $id; response:$response")
        }
        return response.result == DocWriteResponse.Result.DELETED
    }

    /**
     * Get pending report instances
     * @return ReportInstanceDoc list
     */
    fun getPendingReportInstances(): MutableList<ReportInstanceDoc> {
        createIndex()
        val query = QueryBuilders.termsQuery(STATUS_FIELD,
            Status.Scheduled.name,
            Status.Executing.name
        )
        val sourceBuilder = SearchSourceBuilder()
            .timeout(TimeValue(PluginSettings.operationTimeoutMs, TimeUnit.MILLISECONDS))
            .size(PluginSettings.defaultItemsQueryCount)
            .query(query)
        val searchRequest = SearchRequest()
            .indices(REPORT_INSTANCES_INDEX_NAME)
            .source(sourceBuilder)
        val actionFuture = client.search(searchRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        val hits = response.hits
        log.info("$LOG_PREFIX:getPendingReportInstances; totalHits:${hits.totalHits}, retHits:${hits.hits.size}")
        val mutableList: MutableList<ReportInstanceDoc> = mutableListOf()
        val currentTime = Instant.now()
        val refTime = currentTime.minusSeconds(PluginSettings.jobLockDurationSeconds.toLong())
        hits.forEach {
            val parser = XContentType.JSON.xContent().createParser(NamedXContentRegistry.EMPTY,
                LoggingDeprecationHandler.INSTANCE,
                it.sourceAsString)
            parser.nextToken()
            val reportInstance = ReportInstance.parse(parser, it.id)
            if (reportInstance.status == Status.Scheduled || // If still in Scheduled state
                reportInstance.updatedTime.isBefore(refTime)) { // or when timeout happened
                mutableList.add(ReportInstanceDoc(reportInstance, it.seqNo, it.primaryTerm))
            }
        }
        return mutableList
    }
}
