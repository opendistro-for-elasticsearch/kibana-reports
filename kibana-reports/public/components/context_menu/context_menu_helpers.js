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
  reportGenerationFailure
} from './context_menu_ui';

const getReportSourceURL = (baseURI) => {
  let url = baseURI.substr(0, baseURI.indexOf("?"));
  const reportSourceId = url.substr(url.lastIndexOf("/") + 1, url.length);
  return reportSourceId;
}

export const contextMenuCreateReportDefinition = (baseURI) => {
  const reportSourceId = getReportSourceURL(baseURI);
  let reportSource = "";
  let timeRanges = getTimeFieldsFromUrl();

  // check report source
  if (baseURI.includes('dashboard')) {
    reportSource = 'dashboard:';
  }
  else if (baseURI.includes('visualize')) {
    reportSource = 'visualize:'
  }
  reportSource += reportSourceId.toString();
  window.location.assign(
    `opendistro_kibana_reports#/create?previous=${reportSource}?timeFrom=${timeRanges.time_from.toISOString()}?timeTo=${timeRanges.time_to.toISOString()}`
    )
}

export const getTimeFieldsFromUrl = () => {
  let url = window.location.href;
  let timeString = url.substring(
    url.lastIndexOf("time:"),
    url.lastIndexOf("))")
  );  
  if (url.includes("visualize")) {
    timeString = url.substring(
      url.lastIndexOf("time:"),
      url.indexOf("))")
    );
  }

  let fromDateString = timeString.substring(
    timeString.lastIndexOf("from:") + 5,
    timeString.lastIndexOf(",")
  );
    
  // remove extra quotes if the 'from' date is absolute time
  fromDateString = fromDateString.replace(/[']+/g, '');
  
  // convert time range to from date format in case time range is relative
  let fromDateFormat = dateMath.parse(fromDateString);

  let toDateString = timeString.substring(
    timeString.lastIndexOf("to:") + 3,
    timeString.length
  );
  
  toDateString = toDateString.replace(/[']+/g, '');
  let toDateFormat = dateMath.parse(toDateString);

  const timeDuration = moment.duration(
    dateMath.parse(fromDateString).diff(dateMath.parse(toDateString))
  );

  return {
    time_from: fromDateFormat,
    time_to: toDateFormat,
    time_duration: timeDuration.toISOString()
  }
}

export const displayLoadingModal = () => {
  const kibanaBody = document.getElementById("kibana-app");
  if (kibanaBody) {
    try {
      const loadingModal = document.createElement("div");
      loadingModal.innerHTML = reportGenerationInProgressModal();
      kibanaBody.appendChild(loadingModal.children[0]);
    } catch (e) {
      console.log("error displaying loading modal:", e);
    }
  }
}

export const addSuccessOrFailureToast = (status) => {
  const generateToast = document.querySelectorAll(".euiGlobalToastList");
  if (generateToast) {
    try {
      const generateInProgressToast = document.createElement("div");
      if (status === "success") {
        generateInProgressToast.innerHTML = reportGenerationSuccess();
      }
      else if (status === "failure") {
        generateInProgressToast.innerHTML = reportGenerationFailure()
      }
      generateToast[0].appendChild(generateInProgressToast.children[0]);
    } catch (e) {
      console.log("error displaying toast", e);
    }
  }
}