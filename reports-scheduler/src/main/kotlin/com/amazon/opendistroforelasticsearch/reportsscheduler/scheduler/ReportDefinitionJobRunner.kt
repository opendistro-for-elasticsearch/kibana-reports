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

package com.amazon.opendistroforelasticsearch.reportsscheduler.scheduler

import com.amazon.opendistroforelasticsearch.jobscheduler.spi.JobExecutionContext
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobParameter
import com.amazon.opendistroforelasticsearch.jobscheduler.spi.ScheduledJobRunner
import com.amazon.opendistroforelasticsearch.reportsscheduler.ReportsSchedulerPlugin.Companion.LOG_PREFIX
import com.amazon.opendistroforelasticsearch.reportsscheduler.index.ReportInstancesIndex
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportDefinitionDetails
import com.amazon.opendistroforelasticsearch.reportsscheduler.model.ReportInstance
import com.amazon.opendistroforelasticsearch.reportsscheduler.util.logger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.time.Instant

internal object ReportDefinitionJobRunner : ScheduledJobRunner {
    private val log by logger(ReportDefinitionJobRunner::class.java)
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.IO)

    override fun runJob(job: ScheduledJobParameter, context: JobExecutionContext) {
        if (job !is ReportDefinitionDetails) {
            log.warn("$LOG_PREFIX:job is not of type ReportDefinitionDetails:${job.javaClass.name}")
            throw IllegalArgumentException("job is not of type ReportDefinitionDetails:${job.javaClass.name}")
        }
        scope.launch {
            val reportDefinitionDetails: ReportDefinitionDetails = job
            val currentTime = Instant.now()
            val endTime = context.expectedExecutionTime
            val beginTime = endTime.minus(reportDefinitionDetails.reportDefinition.format.duration)
            val reportInstance = ReportInstance(context.jobId,
                currentTime,
                currentTime,
                beginTime,
                endTime,
                job.access,
                reportDefinitionDetails,
                ReportInstance.Status.Success) // TODO: Revert to Scheduled when background job execution supported
            val id = ReportInstancesIndex.createReportInstance(reportInstance)
            if (id == null) {
                log.warn("$LOG_PREFIX:runJob-job creation failed for $reportInstance")
            } else {
                log.info("$LOG_PREFIX:runJob-created job:$id")
            }
        }
    }
}
