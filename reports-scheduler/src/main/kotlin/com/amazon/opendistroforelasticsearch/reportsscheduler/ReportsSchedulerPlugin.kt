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
package com.amazon.opendistroforelasticsearch.reportsscheduler

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobSchedulerExtension
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParser
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner
import com.amazon.opendistroforelasticsearch.reportsscheduler.index.IndexManager
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.ReportsSchedulerJobRunnerProxy
import com.amazon.opendistroforelasticsearch.reportsscheduler.job.ScheduledReportJobParser
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.OnDemandReportRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportDefinitionListRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportDefinitionRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportInstanceListRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportInstancePollRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportInstanceRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportsJobRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.resthandler.ReportsScheduleRestHandler
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.google.common.collect.ImmutableList
import org.elasticsearch.client.Client
import org.elasticsearch.cluster.metadata.IndexNameExpressionResolver
import org.elasticsearch.cluster.node.DiscoveryNodes
import org.elasticsearch.cluster.service.ClusterService
import org.elasticsearch.common.io.stream.NamedWriteableRegistry
import org.elasticsearch.common.settings.ClusterSettings
import org.elasticsearch.common.settings.IndexScopedSettings
import org.elasticsearch.common.settings.Setting
import org.elasticsearch.common.settings.Settings
import org.elasticsearch.common.settings.SettingsFilter
import org.elasticsearch.common.xcontent.NamedXContentRegistry
import org.elasticsearch.env.Environment
import org.elasticsearch.env.NodeEnvironment
import org.elasticsearch.plugins.ActionPlugin
import org.elasticsearch.plugins.Plugin
import org.elasticsearch.repositories.RepositoriesService
import org.elasticsearch.rest.RestController
import org.elasticsearch.rest.RestHandler
import org.elasticsearch.script.ScriptService
import org.elasticsearch.threadpool.ThreadPool
import org.elasticsearch.watcher.ResourceWatcherService
import java.util.function.Supplier

/**
 * Entry point of the OpenDistro for Elasticsearch Reports scheduler plugin.
 * This class initializes the rest handlers.
 */
class ReportsSchedulerPlugin : Plugin(), ActionPlugin, JobSchedulerExtension {

    companion object {
        const val PLUGIN_NAME = "opendistro-reports-scheduler"
        const val LOG_PREFIX = "reports"
        const val BASE_SCHEDULER_URI = "/_opendistro/reports_scheduler"
        const val BASE_REPORTS_URI = "/_opendistro/_reports"
        const val JOB_INDEX_NAME = ".reports_scheduler"
        const val JOB_QUEUE_INDEX_NAME = ".reports_scheduler_job_queue"
        const val LOCK_DURATION_SECONDS = 300L
    }

    private val jobRunner = ReportsSchedulerJobRunnerProxy.getJobRunnerInstance()
    private lateinit var clusterService: ClusterService // initialized in createComponents()

    /**
     * {@inheritDoc}
     */
    override fun getSettings(): List<Setting<*>> {
        return PluginSettings.getAllSettings()
    }

    /**
     * {@inheritDoc}
     */
    override fun createComponents(
        client: Client,
        clusterService: ClusterService,
        threadPool: ThreadPool,
        resourceWatcherService: ResourceWatcherService,
        scriptService: ScriptService,
        xContentRegistry: NamedXContentRegistry,
        environment: Environment,
        nodeEnvironment: NodeEnvironment,
        namedWriteableRegistry: NamedWriteableRegistry,
        indexNameExpressionResolver: IndexNameExpressionResolver,
        repositoriesServiceSupplier: Supplier<RepositoriesService>
    ): Collection<Any> {
        this.clusterService = clusterService
        PluginSettings.addSettingsUpdateConsumer(clusterService)
        IndexManager.initialize(client, clusterService)
        jobRunner.createRunnerInstance(clusterService, threadPool, client)
        return emptyList()
    }

    /**
     * {@inheritDoc}
     */
    override fun getJobType(): String {
        return "reports-scheduler"
    }

    /**
     * {@inheritDoc}
     */
    override fun getJobIndex(): String {
        return JOB_INDEX_NAME // return ReportDefinitionsIndex.REPORT_DEFINITIONS_INDEX_NAME
    }

    /**
     * {@inheritDoc}
     */
    override fun getJobRunner(): ScheduledJobRunner {
        return jobRunner // TODO return ReportDefinitionJobRunner
    }

    /**
     * {@inheritDoc}
     */
    override fun getJobParser(): ScheduledJobParser {
        return ScheduledReportJobParser() // TODO return ReportDefinitionJobParser
    }

    /**
     * {@inheritDoc}
     */
    override fun getRestHandlers(
        settings: Settings,
        restController: RestController,
        clusterSettings: ClusterSettings,
        indexScopedSettings: IndexScopedSettings,
        settingsFilter: SettingsFilter,
        indexNameExpressionResolver: IndexNameExpressionResolver,
        nodesInCluster: Supplier<DiscoveryNodes>
    ): List<RestHandler> {
        return ImmutableList.of<RestHandler>(
            ReportDefinitionRestHandler(),
            ReportDefinitionListRestHandler(),
            ReportInstanceRestHandler(),
            ReportInstanceListRestHandler(),
            OnDemandReportRestHandler(),
            ReportsScheduleRestHandler(),
            ReportInstancePollRestHandler(),
            ReportsJobRestHandler(clusterService)
        )
    }
}
