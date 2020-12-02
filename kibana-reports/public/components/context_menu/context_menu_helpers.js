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

import dateMath from '@elastic/datemath';
import moment from 'moment';
import {
  reportGenerationInProgressModal,
  reportGenerationSuccess,
  reportGenerationFailure,
  permissionsMissingOnGeneration,
} from './context_menu_ui';

const getReportSourceURL = (baseURI) => {
  const url = baseURI.substr(0, baseURI.indexOf('?'));
  const reportSourceId = url.substr(url.lastIndexOf('/') + 1, url.length);
  return reportSourceId;
};

export const contextMenuViewReports = () =>
  window.location.assign('opendistro_kibana_reports#/');

export const getTimeFieldsFromUrl = () => {
  const url = window.location.href;

  let [, fromDateString, toDateString] = url.match(
    /time:\(from:(.+),to:(.+?)\)/
  );
  fromDateString = fromDateString.replace(/[']+/g, '');
  // convert time range to from date format in case time range is relative
  const fromDateFormat = dateMath.parse(fromDateString);
  toDateString = toDateString.replace(/[']+/g, '');
  const toDateFormat = dateMath.parse(toDateString);

  const timeDuration = moment.duration(
    dateMath.parse(toDateString).diff(dateMath.parse(fromDateString))
  );

  return {
    time_from: fromDateFormat,
    time_to: toDateFormat,
    time_duration: timeDuration.toISOString(),
  };
};

export const contextMenuCreateReportDefinition = (baseURI) => {
  const reportSourceId = getReportSourceURL(baseURI);
  let reportSource = '';
  const timeRanges = getTimeFieldsFromUrl();

  // check report source
  if (baseURI.includes('dashboard')) {
    reportSource = 'dashboard:';
  } else if (baseURI.includes('visualize')) {
    reportSource = 'visualize:';
  } else if (baseURI.includes('discover')) {
    reportSource = 'discover:';
  }
  reportSource += reportSourceId.toString();
  window.location.assign(
    `opendistro_kibana_reports#/create?previous=${reportSource}?timeFrom=${timeRanges.time_from.toISOString()}?timeTo=${timeRanges.time_to.toISOString()}`
  );
};

export const displayLoadingModal = () => {
  const kibanaBody = document.getElementById('kibana-body');
  if (kibanaBody) {
    try {
      const loadingModal = document.createElement('div');
      loadingModal.innerHTML = reportGenerationInProgressModal();
      kibanaBody.appendChild(loadingModal.children[0]);
    } catch (e) {
      console.log('error displaying loading modal:', e);
    }
  }
};

export const addSuccessOrFailureToast = (status) => {
  const generateToast = document.querySelectorAll('.euiGlobalToastList');
  if (generateToast) {
    try {
      const generateInProgressToast = document.createElement('div');
      if (status === 'success') {
        generateInProgressToast.innerHTML = reportGenerationSuccess();
        setTimeout(function () {
          document.getElementById('reportSuccessToast').style.display = 'none';
        }, 6000); // closes toast automatically after 6s
      } else if (status === 'failure') {
        generateInProgressToast.innerHTML = reportGenerationFailure();
        setTimeout(function () {
          document.getElementById('reportFailureToast').style.display = 'none';
        }, 6000);
      } else if (status === 'permissionsFailure') {
        generateInProgressToast.innerHTML = permissionsMissingOnGeneration();
        setTimeout(function () {
          document.getElementById(
            'permissionsMissingErrorToast'
          ).style.display = 'none';
        }, 6000);
      }
      generateToast[0].appendChild(generateInProgressToast.children[0]);
    } catch (e) {
      console.log('error displaying toast', e);
    }
  }
};
