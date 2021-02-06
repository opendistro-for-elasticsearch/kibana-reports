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

import registerReportRoute from './report';
import registerReportDefinitionRoute from './reportDefinition';
import registerReportSourceRoute from './reportSource';
import registerMetricRoute from './metric';
import { IRouter, CoreSetup } from '../../../../src/core/server';
import {  KibanaConfig } from '../types';

export default function (router: IRouter, config: KibanaConfig, core: CoreSetup) {
  registerReportRoute(router, config, core);
  registerReportDefinitionRoute(router, config, core);
  registerReportSourceRoute(router, config), core;
  registerMetricRoute(router, config), core;
}
