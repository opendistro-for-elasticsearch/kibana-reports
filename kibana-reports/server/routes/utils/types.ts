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
type BusinessActionType = 'download';
export type RollingCountersNameType = 'count' | 'system_error' | 'user_error';

export type EntityType = 'report' | 'report_definition';
export type UsageActionType =
  | 'info'
  | 'list'
  | 'delete'
  | 'create'
  | 'download'
  | 'update';

export interface RollingCounters {
  usage: {
    [entity in EntityType]: {
      [action in UsageActionType]?: {
        [counter in RollingCountersNameType]: number;
      };
    };
  };
  business: {
    [source in ReportSourceType]: {
      [format in ReportFormatType]?: {
        [action in BusinessActionType]: {
          [counter in RollingCountersNameType]?: number;
        };
      };
    };
  };
}

export interface BasicCounters {
  usage: {
    [entity in EntityType]: {
      [action in UsageActionType]?: {
        total: number;
      };
    };
  };
  business: {
    [source in ReportSourceType]: {
      [format in ReportFormatType]?: {
        [action in BusinessActionType]: {
          total: number;
        };
      };
    };
  };
}
