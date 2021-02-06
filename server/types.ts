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
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpendistroKibanaReportsPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpendistroKibanaReportsPluginStart {}



// This will be used for proxy config
// Example using a local NGINX to hold Authentification for chromium
// http://127.0.0.1:8080/kbn_report/
export interface KibanaConfig {
    proxy_enabled: boolean,
    proxy_port: number;
    proxy_protocol: 'http' | 'https' | 'socket';
    proxy_host: string;
    proxy_basePath: string;
    security_auth_cookie_name: string,
  }