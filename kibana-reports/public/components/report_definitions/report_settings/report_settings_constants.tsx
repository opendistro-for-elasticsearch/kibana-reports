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

import { i18n } from '@kbn/i18n';

export const REPORT_SOURCE_RADIOS = [
  {
    id: 'dashboardReportSource',
    label: i18n.translate('odfe.reports.settings.constants.reportSourceRadios.dashboard', { defaultMessage:'Dashboard' }),
  },
  {
    id: 'visualizationReportSource',
    label: i18n.translate('odfe.reports.settings.constants.reportSourceRadios.visualization', { defaultMessage:'Visualization' }),
  },
  {
    id: 'savedSearchReportSource',
    label: i18n.translate('odfe.reports.settings.constants.reportSourceRadios.savedSearch', { defaultMessage:'Saved search' }),
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
    label: i18n.translate('odfe.reports.settings.constants.headerFooterCheckbox.addHeader', { defaultMessage:'Add header' }),
  },
  {
    id: 'footer',
    label: i18n.translate('odfe.reports.settings.constants.headerFooterCheckbox.addFooter', { defaultMessage:'Add footer' }),
  },
];
export const REPORT_SOURCE_TYPES = {
  dashboard: 'Dashboard',
  visualization: 'Visualization',
  savedSearch: 'Saved search',
};

export const commonTimeRanges = [
  {
    start: 'now/d',
    end: 'now',
    label: i18n.translate('odfe.reports.settings.constants.commonTimeRanges.todaySoFar', { defaultMessage:'Today so far' })
  },
  {
    start: 'now/w',
    end: 'now',
    label: i18n.translate('odfe.reports.settings.constants.commonTimeRanges.weekToDate', { defaultMessage:'Week to date' })
  },
  {
    start: 'now/M',
    end: 'now',
    label: i18n.translate('odfe.reports.settings.constants.commonTimeRanges.monthToDate', { defaultMessage:'Month to date' })
  },
  {
    start: 'now/y',
    end: 'now',
    label: i18n.translate('odfe.reports.settings.constants.commonTimeRanges.yearToDate', { defaultMessage:'Year to date' })
  }
]
