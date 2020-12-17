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

export const getMenuItem = (name) => {
  return `
  <div class="euiFlexItem euiFlexItem--flexGrowZero">
    <button class="euiButtonEmpty euiButtonEmpty--primary euiButtonEmpty--xSmall" type="button" id="downloadReport">
      <span class="euiButtonEmpty__content"><span class="euiButtonEmpty__text">${name}</span>
      </span>
    </button>
  </div>
  `
}

export const popoverMenu = () => {
    return `
    <div>
      <div data-focus-guard="true" tabindex="-1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;">
    </div>
      <div data-focus-guard="true" tabindex="-1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;">
    </div>
    <div data-focus-lock-disabled="disabled">
       <div class="euiPanel euiPopover__panel euiPopover__panel--bottom euiPopover__panel-isOpen euiPopover__panel-withTitle" aria-live="assertive" role="dialog" aria-modal="true" aria-describedby="i199c7fc0-f92e-11ea-a40d-395bfe9dc89a" style="top: 97px; left: 255.583px; z-index: 2000;" id="reportPopover">
          <div class="euiPopover__panelArrow euiPopover__panelArrow--bottom" style="left: 15.9417px; top: 0px;">
        </div>
          <div>
             <div class="euiContextMenu" data-test-subj="shareContextMenu" style="height: 305px; width: 235px;">
                <div class="euiContextMenuPanel euiContextMenu__panel" tabindex="0">
                   <div class="euiPopoverTitle">
                      <span class="euiContextMenu__itemLayout">
                      Generate report
                      </span>
                   </div>
                   <div>
                    <span class="euiContextMenuItem__text" style="padding-left: 10px; padding-right: 10px; margin-top: 10px; box-decoration-break: clone; display: inline-block;">
                      Files can take a minute or two 
                      to generate depending on the 
                      size of your source data
                    </span>
                   </div>
                   <div>
                      <div>
                         <button class="euiContextMenuItem" type="button" data-test-subj="downloadPanel-GeneratePDF" id="generatePDF">
                            <span class="euiContextMenu__itemLayout">
                              <svg id="reports-icon" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon">
                                  <g transform="translate(1.000000, 0.000000)" fill="currentColor">
                                    <path d="M9.8,0 L1,0 C0.448,0 0,0.448 0,1 L0,15 C0,15.552 0.448,16 1,16 L13,16 C13.552,16 14,15.552 14,15 L14,4.429 C14,4.173 13.902,3.926 13.726,3.74 L10.526,0.312 C10.337,0.113 10.074,0 9.8,0 M9,1 L9,4.5 C9,4.776 9.224,5 9.5,5 L9.5,5 L13,5 L13,15 L1,15 L1,1 L9,1 Z M11.5,13 L2.5,13 L2.5,14 L11.5,14 L11.5,13 Z M10.8553858,6.66036578 L7.924,9.827 L5.42565136,8.13939866 L2.63423628,11.1343544 L3.36576372,11.8161664 L5.574,9.446 L8.07559521,11.1358573 L11.5892757,7.33963422 L10.8553858,6.66036578 Z M7.5,4 L2.5,4 L2.5,5 L7.5,5 L7.5,4 Z M7.5,2 L2.5,2 L2.5,3 L7.5,3 L7.5,2 Z"></path>
                                  </g>
                              </svg>
                               <span class="euiContextMenuItem__text">Download PDF</span>
                               </svg>
                            </span>
                         </button>
                         <button class="euiContextMenuItem" type="button" data-test-subj="downloadPanel-GeneratePNG" id="generatePNG">
                            <span class="euiContextMenu__itemLayout">
                              <svg id="reports-icon" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon">
                                <g transform="translate(1.000000, 0.000000)" fill="currentColor">
                                  <path d="M9.8,0 L1,0 C0.448,0 0,0.448 0,1 L0,15 C0,15.552 0.448,16 1,16 L13,16 C13.552,16 14,15.552 14,15 L14,4.429 C14,4.173 13.902,3.926 13.726,3.74 L10.526,0.312 C10.337,0.113 10.074,0 9.8,0 M9,1 L9,4.5 C9,4.776 9.224,5 9.5,5 L9.5,5 L13,5 L13,15 L1,15 L1,1 L9,1 Z M11.5,13 L2.5,13 L2.5,14 L11.5,14 L11.5,13 Z M10.8553858,6.66036578 L7.924,9.827 L5.42565136,8.13939866 L2.63423628,11.1343544 L3.36576372,11.8161664 L5.574,9.446 L8.07559521,11.1358573 L11.5892757,7.33963422 L10.8553858,6.66036578 Z M7.5,4 L2.5,4 L2.5,5 L7.5,5 L7.5,4 Z M7.5,2 L2.5,2 L2.5,3 L7.5,3 L7.5,2 Z"></path>
                                </g>
                              </svg>
                               <span class="euiContextMenuItem__text">Download PNG</span>
                            </span>
                         </button>
                      </div>
                   </div>
                   <div hidden class="euiPopoverTitle">
                    <span class="euiContextMenu__itemLayout">
                      Report definition
                    </span>
                  </div>
                  <div hidden>
                    <button class="euiContextMenuItem" type="button" data-test-subj="downloadPanel-GeneratePDF" id="createReportDefinition">
                      <span class="euiContextMenu__itemLayout">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon" focusable="false" role="img" aria-hidden="true"><path d="M14 4v-.994C14 2.45 13.55 2 12.994 2H11v1h-1V2H6v1H5V2H3.006C2.45 2 2 2.45 2 3.006v9.988C2 13.55 2.45 14 3.006 14h9.988C13.55 14 14 13.55 14 12.994V5H2V4h12zm-3-3h1.994C14.102 1 15 1.897 15 3.006v9.988A2.005 2.005 0 0112.994 15H3.006A2.005 2.005 0 011 12.994V3.006C1 1.898 1.897 1 3.006 1H5V0h1v1h4V0h1v1zM4 7h2v1H4V7zm3 0h2v1H7V7zm3 0h2v1h-2V7zM4 9h2v1H4V9zm3 0h2v1H7V9zm3 0h2v1h-2V9zm-6 2h2v1H4v-1zm3 0h2v1H7v-1zm3 0h2v1h-2v-1z" fill-rule="evenodd"></path></svg>
                        <span class="euiContextMenuItem__text">Create report definition</span>
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div class="euiPopoverTitle">
                    <span class="euiContextMenu__itemLayout">
                      View
                    </span>
                  </div>
                  <div>
                    <button class="euiContextMenuItem" type="button" data-test-subj="downloadPanel-GeneratePDF" id="viewReports">
                      <span class="euiContextMenu__itemLayout">
                        <svg id="reports-icon" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon">
                            <g transform="translate(1.000000, 0.000000)" fill="currentColor">
                              <path d="M9.8,0 L1,0 C0.448,0 0,0.448 0,1 L0,15 C0,15.552 0.448,16 1,16 L13,16 C13.552,16 14,15.552 14,15 L14,4.429 C14,4.173 13.902,3.926 13.726,3.74 L10.526,0.312 C10.337,0.113 10.074,0 9.8,0 M9,1 L9,4.5 C9,4.776 9.224,5 9.5,5 L9.5,5 L13,5 L13,15 L1,15 L1,1 L9,1 Z M11.5,13 L2.5,13 L2.5,14 L11.5,14 L11.5,13 Z M10.8553858,6.66036578 L7.924,9.827 L5.42565136,8.13939866 L2.63423628,11.1343544 L3.36576372,11.8161664 L5.574,9.446 L8.07559521,11.1358573 L11.5892757,7.33963422 L10.8553858,6.66036578 Z M7.5,4 L2.5,4 L2.5,5 L7.5,5 L7.5,4 Z M7.5,2 L2.5,2 L2.5,3 L7.5,3 L7.5,2 Z"></path>
                            </g>
                        </svg>
                          <span class="euiContextMenuItem__text">View reports</span>
                          </svg>
                      </span>
                    </button>
                  </div>
                </div>
             </div>
          </div>
       </div>
    </div>
    <div data-focus-guard="true" tabindex="-1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;"></div>
    `
   }

export const popoverMenuDiscover = (savedSearchAvailable) => {
  const buttonClass = savedSearchAvailable ? 'euiContextMenuItem' : 'euiContextMenuItem euiContextMenuItem-isDisabled';
  const button = savedSearchAvailable ? 'button' : 'button disabled';
  const popoverHeight = savedSearchAvailable ? '265px' : '235px';
  const message = savedSearchAvailable ?
    `Files can take a minute or two to generate depending on the size of your source data.` :
    `Save this search to enable CSV reports.`;

  return `
    <div>
      <div data-focus-guard="true" tabindex="-1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;">
    </div>
      <div data-focus-guard="true" tabindex="-1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;">
    </div>
    <div data-focus-lock-disabled="disabled">
       <div class="euiPanel euiPopover__panel euiPopover__panel--bottom euiPopover__panel-isOpen euiPopover__panel-withTitle" aria-live="assertive" role="dialog" aria-modal="true" aria-describedby="i199c7fc0-f92e-11ea-a40d-395bfe9dc89a" style="top: 97px; left: 255.583px; z-index: 2000;" id="reportPopover">
          <div class="euiPopover__panelArrow euiPopover__panelArrow--bottom" style="left: 15.9417px; top: 0px;">
        </div>
          <div>
             <div class="euiContextMenu" data-test-subj="shareContextMenu" style="height: ${popoverHeight}; width: 235px;">
                <div class="euiContextMenuPanel euiContextMenu__panel" tabindex="0">
                   <div class="euiPopoverTitle">
                      <span class="euiContextMenu__itemLayout">
                      Generate and download
                      </span>
                   </div>
                   <div>
                    <span class="euiContextMenuItem__text" style="padding-left: 10px; padding-right: 10px; margin-top: 10px; box-decoration-break: clone; display: inline-block;">
                      ${message}
                    </span>
                   </div>
                  <div>
                    <${button} class="${buttonClass}" type="button" data-test-subj="downloadPanel-GeneratePDF" id="generateCSV">
                      <span class="euiContextMenu__itemLayout">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon" focusable="false" role="img" aria-hidden="true"><path d="M9 9.114l1.85-1.943a.52.52 0 01.77 0c.214.228.214.6 0 .829l-1.95 2.05a1.552 1.552 0 01-2.31 0L5.41 8a.617.617 0 010-.829.52.52 0 01.77 0L8 9.082V.556C8 .249 8.224 0 8.5 0s.5.249.5.556v8.558z"></path><path d="M16 13.006V10h-1v3.006a.995.995 0 01-.994.994H3.01a.995.995 0 01-.994-.994V10h-1v3.006c0 1.1.892 1.994 1.994 1.994h10.996c1.1 0 1.994-.893 1.994-1.994z"></path></svg>
                        <span class="euiContextMenuItem__text">Generate CSV</span>
                        </svg>
                      </span>
                    </button>
                  </div>
                   <div hidden class="euiPopoverTitle">
                    <span class="euiContextMenu__itemLayout">
                      Schedule and share
                    </span>
                  </div>
                  <div hidden>
                    <${button} class="${buttonClass}" type="button" data-test-subj="downloadPanel-GeneratePDF" id="createReportDefinition">
                      <span class="euiContextMenu__itemLayout">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon" focusable="false" role="img" aria-hidden="true"><path d="M14 4v-.994C14 2.45 13.55 2 12.994 2H11v1h-1V2H6v1H5V2H3.006C2.45 2 2 2.45 2 3.006v9.988C2 13.55 2.45 14 3.006 14h9.988C13.55 14 14 13.55 14 12.994V5H2V4h12zm-3-3h1.994C14.102 1 15 1.897 15 3.006v9.988A2.005 2.005 0 0112.994 15H3.006A2.005 2.005 0 011 12.994V3.006C1 1.898 1.897 1 3.006 1H5V0h1v1h4V0h1v1zM4 7h2v1H4V7zm3 0h2v1H7V7zm3 0h2v1h-2V7zM4 9h2v1H4V9zm3 0h2v1H7V9zm3 0h2v1h-2V9zm-6 2h2v1H4v-1zm3 0h2v1H7v-1zm3 0h2v1h-2v-1z" fill-rule="evenodd"></path></svg>
                        <span class="euiContextMenuItem__text">Create report definition</span>
                        </svg>
                      </span>
                    </button>
                  </div>
                   <div class="euiPopoverTitle">
                    <span class="euiContextMenu__itemLayout">
                      View
                    </span>
                  </div>
                  <div>
                    <button class="euiContextMenuItem" type="button" data-test-subj="downloadPanel-GeneratePDF" id="viewReports">
                      <span class="euiContextMenu__itemLayout">
                        <svg id="reports-icon" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="euiIcon euiIcon--medium euiIcon-isLoaded euiContextMenu__icon">
                            <g transform="translate(1.000000, 0.000000)" fill="currentColor">
                              <path d="M9.8,0 L1,0 C0.448,0 0,0.448 0,1 L0,15 C0,15.552 0.448,16 1,16 L13,16 C13.552,16 14,15.552 14,15 L14,4.429 C14,4.173 13.902,3.926 13.726,3.74 L10.526,0.312 C10.337,0.113 10.074,0 9.8,0 M9,1 L9,4.5 C9,4.776 9.224,5 9.5,5 L9.5,5 L13,5 L13,15 L1,15 L1,1 L9,1 Z M11.5,13 L2.5,13 L2.5,14 L11.5,14 L11.5,13 Z M10.8553858,6.66036578 L7.924,9.827 L5.42565136,8.13939866 L2.63423628,11.1343544 L3.36576372,11.8161664 L5.574,9.446 L8.07559521,11.1358573 L11.5892757,7.33963422 L10.8553858,6.66036578 Z M7.5,4 L2.5,4 L2.5,5 L7.5,5 L7.5,4 Z M7.5,2 L2.5,2 L2.5,3 L7.5,3 L7.5,2 Z"></path>
                            </g>
                        </svg>
                          <span class="euiContextMenuItem__text">View Reports</span>
                          </svg>
                      </span>
                    </button>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
    <div data-focus-guard="true" tabindex="-1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;"></div>
    `
};

export const permissionsMissingOnGeneration = () => {
  return `
  <div class="euiToast euiToast--danger" id="permissionsMissingErrorToast">
  <p class="euiScreenReaderOnly">A new notification appears</p>
  <div class="euiToastHeader euiToastHeader--withBody" aria-label="Notification" data-test-subj="euiToastHeader">
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="euiIcon euiIcon--medium euiToastHeader__icon" focusable="false" role="img" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.59 10.059L7.35 5.18h1.3L8.4 10.06h-.81zm.394 1.901a.61.61 0 01-.448-.186.606.606 0 01-.186-.444c0-.174.062-.323.186-.446a.614.614 0 01.448-.184c.169 0 .315.06.44.182.124.122.186.27.186.448a.6.6 0 01-.189.446.607.607 0 01-.437.184zM2 14a1 1 0 01-.878-1.479l6-11a1 1 0 011.756 0l6 11A1 1 0 0114 14H2zm0-1h12L8 2 2 13z"></path>
    </svg>
    <span class="euiToastHeader__title">Error generating report.</span>
  </div>
  <button type="button" class="euiToast__closeButton" aria-label="Dismiss toast" data-test-subj="toastCloseButton">
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="euiIcon euiIcon--medium euiIcon-isLoaded" focusable="false" role="img" aria-hidden="true">
        <path d="M7.293 8L3.146 3.854a.5.5 0 11.708-.708L8 7.293l4.146-4.147a.5.5 0 01.708.708L8.707 8l4.147 4.146a.5.5 0 01-.708.708L8 8.707l-4.146 4.147a.5.5 0 01-.708-.708L7.293 8z"></path>
    </svg>
  </button>
  <div class="euiText euiText--small euiToastBody">
    <p>Insufficient permissions. Reach out to your Kibana administrator.</p>
  </div>
  </div>
  `
}

export const reportGenerationSuccess = () => {
  return `
  <div class="euiToast euiToast--success" id="reportSuccessToast">
    <p class="euiScreenReaderOnly">A new notification appears</p>
    <div class="euiToastHeader euiToastHeader--withBody"
    aria-label="Notification" data-test-subj="euiToastHeader">
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
      class="euiIcon euiIcon--medium euiToastHeader__icon" focusable="false"
      role="img" aria-hidden="true">
        <path fill-rule="evenodd" d="M6.5 12a.502.502 0 01-.354-.146l-4-4a.502.502 0 01.708-.708L6.5 10.793l6.646-6.647a.502.502 0 01.708.708l-7 7A.502.502 0 016.5 12"></path>
      </svg>
      <span class="euiToastHeader__title">Successfully generated report.</span>
    </div>
    <button type="button" class="euiToast__closeButton" aria-label="Dismiss toast" id="closeReportSuccessToast"
    data-test-subj="toastCloseButton">
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
      class="euiIcon euiIcon--medium" focusable="false" role="img" aria-hidden="true">
        <path d="M7.293 8L3.146 3.854a.5.5 0 11.708-.708L8 7.293l4.146-4.147a.5.5 0 01.708.708L8.707 8l4.147 4.146a.5.5 0 01-.708.708L8 8.707l-4.146 4.147a.5.5 0 01-.708-.708L7.293 8z"></path>
      </svg>
    </button>
    <div class="euiText euiText--small euiToastBody">
      <p>View 
        <a class="euiLink euiLink--primary"
        href="opendistro_kibana_reports#/" rel="noreferrer">Reports</a>.</p>
    </div>
  </div>
  `
}

export const reportGenerationFailure = () => {
  return `
  <div class="euiToast euiToast--danger" id="reportFailureToast">
    <p class="euiScreenReaderOnly">A new notification appears</p>
    <div class="euiToastHeader euiToastHeader--withBody"
    aria-label="Notification" data-test-subj="euiToastHeader">
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
      class="euiIcon euiIcon--medium euiToastHeader__icon" focusable="false"
      role="img" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.59 10.059L7.35 5.18h1.3L8.4 10.06h-.81zm.394 1.901a.61.61 0 01-.448-.186.606.606 0 01-.186-.444c0-.174.062-.323.186-.446a.614.614 0 01.448-.184c.169 0 .315.06.44.182.124.122.186.27.186.448a.6.6 0 01-.189.446.607.607 0 01-.437.184zM2 14a1 1 0 01-.878-1.479l6-11a1 1 0 011.756 0l6 11A1 1 0 0114 14H2zm0-1h12L8 2 2 13z"></path>
      </svg>
      <span class="euiToastHeader__title">Download error</span>
    </div>
    <button type="button" class="euiToast__closeButton" aria-label="Dismiss toast" id="closeReportFailureToast"
    data-test-subj="toastCloseButton">
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
      class="euiIcon euiIcon--medium" focusable="false" role="img" aria-hidden="true">
        <path d="M7.293 8L3.146 3.854a.5.5 0 11.708-.708L8 7.293l4.146-4.147a.5.5 0 01.708.708L8.707 8l4.147 4.146a.5.5 0 01-.708.708L8 8.707l-4.146 4.147a.5.5 0 01-.708-.708L7.293 8z"></path>
      </svg>
    </button>
    <div class="euiText euiText--small euiToastBody">
      <p>There was an error generating this report.</p>
    </div>
  </div>
  `
}

export const reportGenerationInProgressModal = () => {
  return `
  <div class="euiOverlayMask" id="reportGenerationProgressModal">
  <div data-focus-guard="true" tabindex="0" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;"></div>
  <div data-focus-guard="true" tabindex="1" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;"></div>
  <div data-focus-lock-disabled="false">
     <div class="euiModal euiModal--maxWidth-default" tabindex="0" style="max-width: 350px; min-width: 300px;">
        <button class="euiButtonIcon euiButtonIcon--text euiModal__closeIcon" type="button" aria-label="Closes this modal window" id="closeReportGenerationModal">
           <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="euiIcon euiIcon--medium euiIcon-isLoaded euiButtonIcon__icon" focusable="false" role="img" aria-hidden="true">
              <path d="M7.293 8L3.146 3.854a.5.5 0 11.708-.708L8 7.293l4.146-4.147a.5.5 0 01.708.708L8.707 8l4.147 4.146a.5.5 0 01-.708.708L8 8.707l-4.146 4.147a.5.5 0 01-.708-.708L7.293 8z"></path>
           </svg>
        </button>
        <div class="euiModal__flex">
           <div class="euiModalHeader">
              <div class="euiText euiText--medium euiTitle euiTitle--medium">
                 <div class="euiTextAlign euiTextAlign--right">
                    <h2>Generating report</h2>
                 </div>
              </div>
           </div>
           <div class="euiModalBody">
              <div class="euiModalBody__overflow">
                 <div class="euiText euiText--medium">Preparing your file for download.</div>
                 <div class="euiText euiText--medium">You can close this dialog while we continue in the background.</div>
                 <div class="euiSpacer euiSpacer--l"></div>
                 <div class="euiFlexGroup euiFlexGroup--gutterLarge euiFlexGroup--alignItemsCenter euiFlexGroup--justifyContentCenter euiFlexGroup--directionRow euiFlexGroup--responsive">
                    <div class="euiFlexItem euiFlexItem--flexGrowZero"><span class="euiLoadingSpinner euiLoadingSpinner--xLarge" style="min-width: 75px; min-height: 75px;"></span></div>
                 </div>
                 <div class="euiSpacer euiSpacer--l"></div>
                 <div class="euiFlexGroup euiFlexGroup--gutterLarge euiFlexGroup--alignItemsFlexEnd euiFlexGroup--justifyContentFlexEnd euiFlexGroup--directionRow euiFlexGroup--responsive">
                    <div class="euiFlexItem euiFlexItem--flexGrowZero"><button class="euiButton euiButton--primary" type="button" id="closeReportGenerationModalButton"><span class="euiButton__content"><span class="euiButton__text">Close</span></span></button></div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </div>
  <div data-focus-guard="true" tabindex="0" style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;"></div>
</div>
  `
}
