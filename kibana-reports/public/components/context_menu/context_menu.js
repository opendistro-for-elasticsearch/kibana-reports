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
 
 /* eslint-disable no-restricted-globals */
 import $ from 'jquery';
 import dateMath from '@elastic/datemath';
 import { readStreamToFile } from '../main/main_utils';
 import { 
  contextMenuCreateReportDefinition,
  getTimeFieldsFromUrl,
  displayLoadingModal,
  addSuccessOrFailureToast
} from './context_menu_helpers';
import { 
  popoverMenu,
  getMenuItem, 
} from './context_menu_ui';

 const replaceQueryURL = () => {
  let url = window.location.href;
  let timeString = url.substring(
    url.lastIndexOf("time:"),
    url.lastIndexOf("))")
  );

  let fromDateString = timeString.substring(
    timeString.lastIndexOf("from:") + 5,
    timeString.lastIndexOf(",")
  );

  fromDateString = fromDateString.replace(/[']+/g, '');
  let fromDateFormat = dateMath.parse(fromDateString);

  let toDateString = timeString.substring(
    timeString.lastIndexOf("to:") + 3,
    timeString.length
  );
  toDateString = toDateString.replace(/[']+/g, '');
  let toDateFormat = dateMath.parse(toDateString);

  // replace to and from dates with absolute date

  url = url.replace(
    fromDateString + "))",
    '\'' + fromDateFormat.toISOString() + "\'"
  );

  url = url.replace(
    toDateString + "))", 
    '\'' + toDateFormat.toISOString() + "\'))"
  );
  return url;
 }

 const generateInContextReport = (timeRanges, queryUrl, fileFormat) => {
  displayLoadingModal();
  let baseUrl = window.location.href.substr(0, window.location.href.indexOf('?'));
  let reportSource = "";
  if (window.location.href.includes('dashboard')) {
    reportSource = "Dashboard";
  }
  else if (window.location.href.includes('visualize')) {
    reportSource = "Visualization";
  }

  // create query body
  let contextMenuOnDemandReport = {
    query_url: queryUrl,
    time_from: timeRanges.time_from.valueOf(),
    time_to: timeRanges.time_to.valueOf(),
    report_definition: {
      report_params: {
        report_name: "On_demand_report",
        report_source: reportSource,
        description: "In-context report download",
        core_params: {
          base_url: baseUrl,
          report_format: fileFormat,
          time_duration: timeRanges.time_duration
        }
      },
      trigger: {
        trigger_type: "On demand"
      }
    }
  };

  fetch('/api/reporting/generateReport', {
    headers: {
      "Content-Type": "application/json",
      "kbn-version": "7.8.0",
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    method: 'POST',
    body: JSON.stringify(contextMenuOnDemandReport),      
    "referrerPolicy": "strict-origin-when-cross-origin",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => {
    if (response.status === 200) {
      $('#reportGenerationProgressModal').remove();
      addSuccessOrFailureToast("success");
    }
    else {
      addSuccessOrFailureToast("failure");
    }
    return response.json();
  })
  .then(async (data) => {
    await readStreamToFile(data.data, fileFormat, data.filename);
  })
 }

 // open Download drop-down
 $(function(){
  $(document).on('click', '#downloadReport', function() {
    const popoverScreen = document.querySelectorAll("#kibana-app");
    if (popoverScreen) {
      try {
        const reportPopover = document.createElement("div");
        reportPopover.innerHTML = popoverMenu();
        popoverScreen[0].appendChild(reportPopover.children[0]);
        $('#reportPopover').show();
      } catch (e) {
        console.log("error displaying menu:", e);
      } 
    }
  })

  // generate PDF onclick
  $(document).on('click', '#generatePDF', function() {
    const timeRanges = getTimeFieldsFromUrl();
    const queryUrl = replaceQueryURL();
    generateInContextReport(timeRanges, queryUrl, 'pdf');
  })

  // generate PNG onclick
  $(document).on('click', '#generatePNG', function() {
    const timeRanges = getTimeFieldsFromUrl();
    const queryUrl = replaceQueryURL();
    generateInContextReport(timeRanges, queryUrl, 'png');
  })

  // navigate to Create report definition page with report source and pre-set time range
  $(document).on('click', '#createReportDefinition', function() {
    contextMenuCreateReportDefinition(this.baseURI);
  })

  // close popover menu on click outside
  $('body').on('click', function(e) {
    if ($(e.target).data('toggle') !== '#downloadReport') {
      $('#reportPopover').remove();
    }
  })

  // close modal/toast 
  $(function() {
    // close modal with 'x' in upper-right modal
    $(document).on('click', '#closeReportGenerationModal', function() {
      $('#reportGenerationProgressModal').remove();
    }); 

    // close modal with the close EuiButton
    $(document).on('click', '#closeReportGenerationModalButton', function() {
      $('#reportGenerationProgressModal').remove();
    })

    // close the toast that appears upon successful report generation
    $(document).on('click', '#closeReportSuccessToast', function() {
      $('#reportSuccessToast').remove();
    })

    // close the toast that apepars upon failure of report generation
    $(document).on('click', '#closeReportFailureToast', function() {
      $('#reportFailureToast').remove();
    })
  });

  // do not render the Reporting menu on "Discover"
  if (window.location.href.includes('discover') === -1) {
    locationHashChanged();
  }
 })

 function locationHashChanged() {
  const observer = new MutationObserver(function (mutations) {
 
    const navMenu = document.querySelectorAll("span.kbnTopNavMenu__wrapper > div.euiFlexGroup");
    if(navMenu && navMenu.length && navMenu[0].children.length > 1) {
      try {
        const menuItem = document.createElement("div");
        if ($("#downloadReport").length) {
          return;
        }
        menuItem.innerHTML = getMenuItem("Reporting");
        navMenu[0].appendChild(menuItem.children[0])
        
      } catch (e) {
        console.log(e);
      } finally {
        observer.disconnect();
      }
    }
   });
 
   // Start observing
   observer.observe(document.body, { //document.body is node target to observe
     childList: true, //This is a must have for the observer with subtree
     subtree: true //Set to true if changes must also be observed in descendants.
   });
 }

 window.onhashchange = locationHashChanged;