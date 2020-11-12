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

package com.amazon.opendistroforelasticsearch.reportsscheduler.security

import com.amazon.opendistroforelasticsearch.commons.authuser.User
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings
import com.amazon.opendistroforelasticsearch.reportsscheduler.settings.PluginSettings.FilterBy
import org.elasticsearch.ElasticsearchStatusException
import org.elasticsearch.rest.RestStatus

/**
 * Class for checking/filtering user access.
 */
internal object UserAccessManager {
    const val USER_TAG = "User:"
    const val ROLE_TAG = "Role:"
    const val BACKEND_ROLE_TAG = "BERole:"
    const val ALL_ACCESS_ROLE = "all_access"
    const val KIBANA_SERVER_USER = "kibanaserver"

    /**
     * Validate User if eligible to do operation
     * If filterBy == NoFilter
     *  -> No validation
     * If filterBy == User
     *  -> User name should be present
     * If filterBy == BackendRoles
     *  -> backend roles should be present
     */
    fun validateUser(user: User?) {
        when (PluginSettings.filterBy) {
            FilterBy.NoFilter -> { // No validation
            }
            FilterBy.User -> { // User name must be present
                user?.name
                    ?: throw ElasticsearchStatusException("Filter-by enabled with security disabled",
                        RestStatus.FORBIDDEN)
            }
            FilterBy.BackendRoles -> { // backend roles must be present
                if (user?.backendRoles.isNullOrEmpty()) {
                    throw ElasticsearchStatusException("User doesn't have backend roles configured. Contact administrator.",
                        RestStatus.FORBIDDEN)
                }
            }
        }
    }

    /**
     * validate if user has access to polling actions
     */
    fun validatePollingUser(user: User?) {
        if (user != null) { // Check only if security is enabled
            if (user.name != KIBANA_SERVER_USER) {
                throw ElasticsearchStatusException("Permission denied", RestStatus.FORBIDDEN)
            }
        }
    }

    /**
     * Get all user access info from user object.
     */
    fun getAllAccessInfo(user: User?): List<String> {
        if (user == null) { // Security is disabled
            return listOf()
        }
        val retList: MutableList<String> = mutableListOf()
        if (user.name != null) {
            retList.add("$USER_TAG${user.name}")
        }
        user.roles.forEach { retList.add("$ROLE_TAG$it") }
        user.backendRoles.forEach { retList.add("$BACKEND_ROLE_TAG$it") }
        return retList
    }

    /**
     * Get access info for search filtering
     */
    fun getSearchAccessInfo(user: User?): List<String> {
        if (user == null) {
            return listOf()
        }
        if (PluginSettings.adminAccess == PluginSettings.AdminAccess.AllReports && user.roles.contains(ALL_ACCESS_ROLE)) {
            return listOf()
        }
        return when (PluginSettings.filterBy) {
            FilterBy.NoFilter -> listOf()
            FilterBy.User -> listOf("$USER_TAG${user.name}")
            FilterBy.BackendRoles -> user.backendRoles.map { "$BACKEND_ROLE_TAG$it" }
        }
    }

    /**
     * validate if user has access based on given access list
     */
    fun doesUserHasAccess(user: User?, access: List<String>): Boolean {
        if (user == null) {
            return true
        }
        if (PluginSettings.adminAccess == PluginSettings.AdminAccess.AllReports && user.roles.contains(ALL_ACCESS_ROLE)) {
            return true
        }
        return when (PluginSettings.filterBy) {
            FilterBy.NoFilter -> true
            FilterBy.User -> access.contains("$USER_TAG${user.name}")
            FilterBy.BackendRoles -> user.backendRoles.map { "$BACKEND_ROLE_TAG$it" }.any { it in access }
        }
    }
}
