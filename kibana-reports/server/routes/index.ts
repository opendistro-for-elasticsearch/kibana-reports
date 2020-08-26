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

import registerVisualReportRoute from './visualReport';
import registerReportDefinitionRoute from './reportDefinition';
import registerDataReport from './dataReport';
import registerDataReportMetadata from './dataReportMetadata';
import registerDashboardRoute from './getDashboards';
import { IRouter } from '../../../../src/core/server';

export default function (router: IRouter) {
  registerVisualReportRoute(router);
  registerReportDefinitionRoute(router);
  registerDataReportMetadata(router);
  registerDataReport(router);
  registerDashboardRoute(router);
}
