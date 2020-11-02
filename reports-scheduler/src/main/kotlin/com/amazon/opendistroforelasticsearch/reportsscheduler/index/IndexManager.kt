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

import org.elasticsearch.client.Client
import org.elasticsearch.cluster.service.ClusterService

/**
 * The object class which provides abstraction over all index operations
 */
internal object IndexManager : IReportInstancesIndex by IndexContainer.reportInstancesIndex,
    IReportDefinitionsIndex by IndexContainer.reportDefinitionsIndex {

    /**
     * The object class which contains all index operations
     */
    private object IndexContainer {
        var reportInstancesIndex: IReportInstancesIndex = EmptyReportInstancesIndex
        var reportDefinitionsIndex: IReportDefinitionsIndex = EmptyReportDefinitionsIndex

        /**
         * Initialize the class
         * @param client The ES client
         * @param clusterService The ES cluster service
         */
        fun initialize(client: Client, clusterService: ClusterService) {
            reportInstancesIndex = ReportInstancesIndex(client, clusterService)
            reportDefinitionsIndex = ReportDefinitionsIndex(client, clusterService)
        }
    }

    /**
     * Initialize the class
     * @param client The ES client
     * @param clusterService The ES cluster service
     */
    fun initialize(client: Client, clusterService: ClusterService) {
        IndexContainer.initialize(client, clusterService)
    }
}
