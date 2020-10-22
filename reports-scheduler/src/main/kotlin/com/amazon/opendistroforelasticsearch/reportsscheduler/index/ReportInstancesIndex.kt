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
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.LAST_UPDATED_TIME_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.USER_ID_FIELD
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
import java.util.concurrent.TimeUnit

/**
 * Class for doing ES index operation to maintain report instances in cluster.
 */
internal class ReportInstancesIndex(client: Client, private val clusterService: ClusterService) : IReportInstancesIndex {
    private val client: Client

    init {
        this.client = SecureIndexClient(client)
    }

    companion object {
        private val log by logger(ReportInstancesIndex::class.java)
        private const val REPORT_INSTANCES_INDEX_NAME = ".opendistro-reports-instances"
        private const val REPORT_INSTANCES_MAPPING_FILE_NAME = "report-instances-mapping.yml"
        private const val REPORT_INSTANCES_SETTINGS_FILE_NAME = "report-instances-settings.yml"
        private const val MAPPING_TYPE = "_doc"
        private const val MAX_ITEMS_TO_QUERY = 10000
    }

    /**
     * {@inheritDoc}
     */
    @Suppress("TooGenericExceptionCaught")
    override fun createIndex() {
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
     * {@inheritDoc}
     */
    override fun isIndexExists(): Boolean {
        val clusterState = clusterService.state()
        return clusterState.routingTable.hasIndex(REPORT_INSTANCES_INDEX_NAME)
    }

    /**
     * {@inheritDoc}
     */
    override fun createReportInstance(reportInstance: ReportInstance): String? {
        val indexRequest = IndexRequest(REPORT_INSTANCES_INDEX_NAME)
            .source(reportInstance.toXContent(false))
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
     * {@inheritDoc}
     */
    override fun getReportInstance(id: String): ReportInstance? {
        val getRequest = GetRequest(REPORT_INSTANCES_INDEX_NAME).id(id)
        val actionFuture = client.get(getRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        return if (response.sourceAsString == null) {
            log.warn("$LOG_PREFIX:getReportInstance - item not found; response:$response")
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
     * {@inheritDoc}
     */
    override fun getAllReportInstances(ownerId: String, from: Int): List<ReportInstance> {
        val query = QueryBuilders.matchQuery(USER_ID_FIELD, ownerId)
        val sourceBuilder = SearchSourceBuilder()
            .timeout(TimeValue(PluginSettings.operationTimeoutMs, TimeUnit.MILLISECONDS))
            .sort(LAST_UPDATED_TIME_FIELD)
            .size(MAX_ITEMS_TO_QUERY)
            .from(from)
            .query(query)
        val searchRequest = SearchRequest()
            .indices(REPORT_INSTANCES_INDEX_NAME)
            .source(sourceBuilder)
        val actionFuture = client.search(searchRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        val mutableList: MutableList<ReportInstance> = mutableListOf()
        response.hits.forEach {
            val parser = XContentType.JSON.xContent().createParser(NamedXContentRegistry.EMPTY,
                LoggingDeprecationHandler.INSTANCE,
                it.sourceAsString)
            parser.nextToken()
            mutableList.add(ReportInstance.parse(parser, it.id))
        }
        return mutableList
    }

    /**
     * {@inheritDoc}
     */
    override fun updateReportInstance(id: String, reportInstance: ReportInstance): Boolean {
        val updateRequest = UpdateRequest()
            .index(REPORT_INSTANCES_INDEX_NAME)
            .id(id)
            .doc(reportInstance.toXContent(false))
            .fetchSource(true)
        val actionFuture = client.update(updateRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.UPDATED) {
            log.warn("$LOG_PREFIX:updateReportInstance failed; response:$response")
        }
        return response.result == DocWriteResponse.Result.UPDATED
    }

    /**
     * {@inheritDoc}
     */
    override fun deleteReportInstance(id: String): Boolean {
        val deleteRequest = DeleteRequest()
            .index(REPORT_INSTANCES_INDEX_NAME)
            .id(id)
        val actionFuture = client.delete(deleteRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.DELETED) {
            log.warn("$LOG_PREFIX:deleteReportInstance failed; response:$response")
        }
        return response.result == DocWriteResponse.Result.DELETED
    }
}
