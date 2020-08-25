/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package com.amazon.opendistroforelasticsearch.reportsscheduler;

import java.util.List;

import org.elasticsearch.action.admin.cluster.health.ClusterHealthRequest;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoRequest;
import org.elasticsearch.action.admin.cluster.node.info.NodesInfoResponse;
import org.elasticsearch.action.admin.cluster.node.info.PluginsAndModules;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.plugins.PluginInfo;
import org.elasticsearch.test.ESIntegTestCase;
import org.junit.Assert;

public class ReportsSchedulerPluginIT extends ESIntegTestCase {

  public void testPluginsAreInstalled() {
    final ClusterHealthRequest request = new ClusterHealthRequest();
    final ClusterHealthResponse response =
        ESIntegTestCase.client().admin().cluster().health(request).actionGet();
    Assert.assertEquals(ClusterHealthStatus.GREEN, response.getStatus());

    final NodesInfoRequest nodesInfoRequest = new NodesInfoRequest();
    nodesInfoRequest.addMetric(NodesInfoRequest.Metric.PLUGINS.metricName());
    final NodesInfoResponse nodesInfoResponse =
        ESIntegTestCase.client().admin().cluster().nodesInfo(nodesInfoRequest).actionGet();
    List<PluginInfo> pluginInfos =
        nodesInfoResponse.getNodes().get(0).getInfo(PluginsAndModules.class).getPluginInfos();
    Assert.assertTrue(
        pluginInfos.stream()
            .anyMatch(pluginInfo -> pluginInfo.getName().equals("opendistro-job-scheduler")));
    Assert.assertTrue(
        pluginInfos.stream()
            .anyMatch(pluginInfo -> pluginInfo.getName().equals("opendistro-reports-scheduler")));
  }
}
