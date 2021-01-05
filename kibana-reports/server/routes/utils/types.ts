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

export interface CreateReportResultType {
  timeCreated: number;
  dataUrl: string;
  fileName: string;
}

type ReportSourceType = 'dashboard' | 'visualization' | 'saved_search';
type ReportFormatType = 'pdf' | 'png' | 'csv';
type UsageActionType = 'download';
export type EntityType = 'report' | 'report_definition' | 'report_source';

export type CountersNameType =
  | 'count'
  | 'system_error'
  | 'user_error'
  | 'total';
export type ActionType =
  | 'info'
  | 'list'
  | 'delete'
  | 'create'
  | 'download'
  | 'update'
  | 'create_from_definition';

export type CountersType = ActionCountersType & UsageCountersType;

type ActionCountersType = {
  [entity in EntityType]: {
    [action in ActionType]?: {
      [counter in CountersNameType]?: number;
    };
  };
};

type UsageCountersType = {
  [source in ReportSourceType]: {
    [format in ReportFormatType]?: {
      [action in UsageActionType]: {
        [counter in CountersNameType]?: number;
      };
    };
  };
};
