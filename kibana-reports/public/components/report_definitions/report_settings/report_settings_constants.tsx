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

export const REPORT_SOURCE_RADIOS = [
  {
    id: 'dashboardReportSource',
    label: 'Dashboard',
  },
  {
    id: 'visualizationReportSource',
    label: 'Visualization',
  },
  {
    id: 'savedSearchReportSource',
    label: 'Saved search',
  },
];

export const PDF_PNG_FILE_FORMAT_OPTIONS = [
  {
    id: 'pdf',
    label: 'PDF',
  },
  {
    id: 'png',
    label: 'PNG',
  },
];

export const SAVED_SEARCH_FORMAT_OPTIONS = [
  {
    id: 'csvFormat',
    label: 'CSV',
  },
  {
    id: 'xlsFormat',
    label: 'XLS',
  },
];

export const HEADER_FOOTER_CHECKBOX = [
  {
    id: 'header',
    label: 'Header',
  },
  {
    id: 'footer',
    label: 'Footer',
  },
];
export const REPORT_SOURCE_TYPES = {
  dashboard: 'Dashboard',
  visualization: 'Visualization',
  savedSearch: 'Saved search',
};
