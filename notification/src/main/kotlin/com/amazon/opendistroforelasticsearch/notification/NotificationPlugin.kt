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

package com.amazon.opendistroforelasticsearch.notification

import com.amazon.opendistroforelasticsearch.notification.resthandler.SendRestHandler
import org.apache.logging.log4j.LogManager
import org.elasticsearch.action.ActionRequest
import org.elasticsearch.action.ActionResponse
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

internal class NotificationPlugin : ActionPlugin, Plugin() {

    private val log = LogManager.getLogger(javaClass)
    lateinit var clusterService: ClusterService

    companion object {
        const val PLUGIN_NAME = "opendistro-notification"
        const val PLUGIN_BASE_URI = "/_opendistro/_notification"
    }

    override fun getRestHandlers(
      settings: Settings,
      restController: RestController,
      clusterSettings: ClusterSettings,
      indexScopedSettings: IndexScopedSettings,
      settingsFilter: SettingsFilter,
      indexNameExpressionResolver: IndexNameExpressionResolver,
      nodesInCluster: Supplier<DiscoveryNodes>
    ): List<RestHandler> {
        log.debug("getRestHandlers called")
        return listOf(
          SendRestHandler()
        )
    }

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
        log.debug("createComponents called")
        this.clusterService = clusterService
        return listOf()
    }

    override fun getSettings(): List<Setting<*>> {
        log.debug("getSettings called")
        return listOf()
    }

    override fun getActions(): List<ActionPlugin.ActionHandler<out ActionRequest, out ActionResponse>> {
        log.debug("getActions called")
        return listOf()
    }
}
