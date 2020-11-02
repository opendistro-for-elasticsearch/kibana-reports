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
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.ROLE_LIST_FIELD
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.PluginRestHandler.Companion.UPDATED_TIME_FIELD
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
 * Class for doing ES index operation to maintain report definitions in cluster.
 */
internal class ReportDefinitionsIndex(client: Client, private val clusterService: ClusterService) : IReportDefinitionsIndex {
    private val client: Client

    init {
        this.client = SecureIndexClient(client)
    }

    companion object {
        private val log by logger(ReportDefinitionsIndex::class.java)
        const val REPORT_DEFINITIONS_INDEX_NAME = ".opendistro-reports-definitions"
        private const val REPORT_DEFINITIONS_MAPPING_FILE_NAME = "report-definitions-mapping.yml"
        private const val REPORT_DEFINITIONS_SETTINGS_FILE_NAME = "report-definitions-settings.yml"
        private const val MAPPING_TYPE = "_doc"
        private const val MAX_ITEMS_TO_QUERY = 10000
    }

    /**
     * Create index using the mapping and settings defined in resource
     */
    @Suppress("TooGenericExceptionCaught")
    private fun createIndex() {
        if (!isIndexExists()) {
            val classLoader = ReportDefinitionsIndex::class.java.classLoader
            val indexMappingSource = classLoader.getResource(REPORT_DEFINITIONS_MAPPING_FILE_NAME)?.readText()!!
            val indexSettingsSource = classLoader.getResource(REPORT_DEFINITIONS_SETTINGS_FILE_NAME)?.readText()!!
            val request = CreateIndexRequest(REPORT_DEFINITIONS_INDEX_NAME)
                .mapping(MAPPING_TYPE, indexMappingSource, XContentType.YAML)
                .settings(indexSettingsSource, XContentType.YAML)
            try {
                val actionFuture = client.admin().indices().create(request)
                val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
                if (response.isAcknowledged) {
                    log.info("$LOG_PREFIX:Index $REPORT_DEFINITIONS_INDEX_NAME creation Acknowledged")
                } else {
                    throw IllegalStateException("$LOG_PREFIX:Index $REPORT_DEFINITIONS_INDEX_NAME creation not Acknowledged")
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
        return clusterState.routingTable.hasIndex(REPORT_DEFINITIONS_INDEX_NAME)
    }

    /**
     * {@inheritDoc}
     */
    override fun createReportDefinition(reportDefinitionDetails: ReportDefinitionDetails): String? {
        createIndex()
        val indexRequest = IndexRequest(REPORT_DEFINITIONS_INDEX_NAME)
            .source(reportDefinitionDetails.toXContent(false))
            .create(true)
        val actionFuture = client.index(indexRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        return if (response.result != DocWriteResponse.Result.CREATED) {
            log.warn("$LOG_PREFIX:createReportDefinition - response:$response")
            null
        } else {
            response.id
        }
    }

    /**
     * {@inheritDoc}
     */
    override fun getReportDefinition(id: String): ReportDefinitionDetails? {
        createIndex()
        val getRequest = GetRequest(REPORT_DEFINITIONS_INDEX_NAME).id(id)
        val actionFuture = client.get(getRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        return if (response.sourceAsString == null) {
            log.warn("$LOG_PREFIX:getReportDefinition - item not found; response:$response")
            null
        } else {
            val parser = XContentType.JSON.xContent().createParser(NamedXContentRegistry.EMPTY,
                LoggingDeprecationHandler.INSTANCE,
                response.sourceAsString)
            parser.nextToken()
            ReportDefinitionDetails.parse(parser, id)
        }
    }

    /**
     * {@inheritDoc}
     */
    override fun getAllReportDefinitions(roles: List<String>, from: Int): List<ReportDefinitionDetails> {
        createIndex()
        val query = QueryBuilders.termsQuery(ROLE_LIST_FIELD, roles)
        val sourceBuilder = SearchSourceBuilder()
            .timeout(TimeValue(PluginSettings.operationTimeoutMs, TimeUnit.MILLISECONDS))
            .sort(UPDATED_TIME_FIELD)
            .size(MAX_ITEMS_TO_QUERY)
            .from(from)
            .query(query)
        val searchRequest = SearchRequest()
            .indices(REPORT_DEFINITIONS_INDEX_NAME)
            .source(sourceBuilder)
        val actionFuture = client.search(searchRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        val mutableList: MutableList<ReportDefinitionDetails> = mutableListOf()
        response.hits.forEach {
            val parser = XContentType.JSON.xContent().createParser(NamedXContentRegistry.EMPTY,
                LoggingDeprecationHandler.INSTANCE,
                it.sourceAsString)
            parser.nextToken()
            mutableList.add(ReportDefinitionDetails.parse(parser, it.id))
        }
        return mutableList
    }

    /**
     * {@inheritDoc}
     */
    override fun updateReportDefinition(id: String, reportDefinitionDetails: ReportDefinitionDetails): Boolean {
        createIndex()
        val updateRequest = UpdateRequest()
            .index(REPORT_DEFINITIONS_INDEX_NAME)
            .id(id)
            .doc(reportDefinitionDetails.toXContent(false))
            .fetchSource(true)
        val actionFuture = client.update(updateRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.UPDATED) {
            log.warn("$LOG_PREFIX:updateReportDefinition failed; response:$response")
        }
        return response.result == DocWriteResponse.Result.UPDATED
    }

    /**
     * {@inheritDoc}
     */
    override fun deleteReportDefinition(id: String): Boolean {
        createIndex()
        val deleteRequest = DeleteRequest()
            .index(REPORT_DEFINITIONS_INDEX_NAME)
            .id(id)
        val actionFuture = client.delete(deleteRequest)
        val response = actionFuture.actionGet(PluginSettings.operationTimeoutMs)
        if (response.result != DocWriteResponse.Result.DELETED) {
            log.warn("$LOG_PREFIX:deleteReportDefinition failed; response:$response")
        }
        return response.result == DocWriteResponse.Result.DELETED
    }
}
