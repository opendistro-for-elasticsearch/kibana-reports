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

import path from 'path';

export const isValidRelativeUrl = (relativeUrl: string) => {
  const normalizedRelativeUrl = path.posix.normalize(relativeUrl);
  // check pattern
  // ODFE pattern: /app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g
  // AES pattern: /_plugin/kibana/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g
  const isValid = regexRelativeUrl.test(normalizedRelativeUrl);

  return isValid;
};

/**
 * moment.js isValid() API fails to validate time duration, so use regex
 * https://github.com/moment/moment/issues/1805
 **/
export const regexDuration = /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
export const regexEmailAddress = /\S+@\S+\.\S+/;
export const regexReportName = /^[\w\-\s\(\)\[\]\,\_\-+]+$/;
export const regexRelativeUrl = /^\/(_plugin\/kibana\/app|app)\/(dashboards|visualize|discover)#\/(view|edit)\/([a-f0-9-]+)($|\?\S+$)/;
