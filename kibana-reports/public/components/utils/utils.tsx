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

import React from "react";

export const permissionsMissingToast = (action: string) => {
  return {
    title: 'Error ' + action,
    color: 'danger',
    iconType: 'alert',
    id: 'permissionsMissingErrorToast' + action.replace(' ', ''),
    text: (
      <p>Insufficient permissions. Reach out to your Kibana administrator.</p>
    ),
  };
};

export const permissionsMissingActions = {
  CHANGE_SCHEDULE_STATUS: 'changing schedule status.',
  DELETE_REPORT_DEFINITION: 'deleting report definition.',
  GENERATING_REPORT: 'generating report.',
  LOADING_REPORTS_TABLE: 'loading reports table.',
  LOADING_DEFINITIONS_TABLE: 'loading report definitions table.',
  VIEWING_EDIT_PAGE: 'viewing edit page.',
  UPDATING_DEFINITION: 'updating report definition',
  CREATING_REPORT_DEFINITION: 'creating new report definition.'
}