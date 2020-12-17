(window["opendistroKibanaReports_bundle_jsonpfunction"] = window["opendistroKibanaReports_bundle_jsonpfunction"] || []).push([[1],{

/***/ "./public/application.tsx":
/*!********************************!*\
  !*** ./public/application.tsx ***!
  \********************************/
/*! exports provided: renderApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderApp", function() { return renderApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/app */ "./public/components/app.tsx");
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



const renderApp = ({
  notifications,
  http,
  chrome
}, {
  navigation
}, {
  appBasePath,
  element
}) => {
  react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_app__WEBPACK_IMPORTED_MODULE_2__["OpendistroKibanaReportsApp"], {
    basename: appBasePath,
    notifications: notifications,
    http: http,
    navigation: navigation,
    chrome: chrome
  }), element);
  return () => react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.unmountComponentAtNode(element);
};

/***/ }),

/***/ "./public/components/app.tsx":
/*!***********************************!*\
  !*** ./public/components/app.tsx ***!
  \***********************************/
/*! exports provided: OpendistroKibanaReportsApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OpendistroKibanaReportsApp", function() { return OpendistroKibanaReportsApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kbn/i18n/react */ "@kbn/i18n/react");
/* harmony import */ var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _report_definitions_create_create_report_definition__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./report_definitions/create/create_report_definition */ "./public/components/report_definitions/create/create_report_definition.tsx");
/* harmony import */ var _main_main__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./main/main */ "./public/components/main/main.tsx");
/* harmony import */ var _main_report_details_report_details__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./main/report_details/report_details */ "./public/components/main/report_details/report_details.tsx");
/* harmony import */ var _main_report_definition_details_report_definition_details__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./main/report_definition_details/report_definition_details */ "./public/components/main/report_definition_details/report_definition_details.tsx");
/* harmony import */ var _report_definitions_edit_edit_report_definition__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./report_definitions/edit/edit_report_definition */ "./public/components/report_definitions/edit/edit_report_definition.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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









const styles = {
  float: 'left',
  width: '100%',
  maxWidth: '1600px'
};
const OpendistroKibanaReportsApp = ({
  basename,
  notifications,
  http,
  navigation,
  chrome
}) => {
  // Render the application DOM.
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["HashRouter"], {
    basename: '/' + basename
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_1__["I18nProvider"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    style: styles
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageContentHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageContentHeaderSection"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageContentBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Switch"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/report_details/:reportId",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_main_report_details_report_details__WEBPACK_IMPORTED_MODULE_6__["ReportDetails"], _extends({
      title: "Report Details",
      httpClient: http
    }, props, {
      setBreadcrumbs: chrome.setBreadcrumbs
    }))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/report_definition_details/:reportDefinitionId",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_main_report_definition_details_report_definition_details__WEBPACK_IMPORTED_MODULE_7__["ReportDefinitionDetails"], _extends({
      title: "Report Definition Details",
      httpClient: http
    }, props, {
      setBreadcrumbs: chrome.setBreadcrumbs
    }))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/create",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_definitions_create_create_report_definition__WEBPACK_IMPORTED_MODULE_4__["CreateReport"], _extends({
      title: "Create Report",
      httpClient: http
    }, props, {
      setBreadcrumbs: chrome.setBreadcrumbs
    }))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/edit/:reportDefinitionId",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_definitions_edit_edit_report_definition__WEBPACK_IMPORTED_MODULE_8__["EditReportDefinition"], _extends({
      title: "Edit Report Definition",
      httpClient: http
    }, props, {
      setBreadcrumbs: chrome.setBreadcrumbs
    }))
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_main_main__WEBPACK_IMPORTED_MODULE_5__["Main"], _extends({
      title: "Reporting Homepage",
      httpClient: http
    }, props, {
      setBreadcrumbs: chrome.setBreadcrumbs
    }))
  }))))))));
};

/***/ }),

/***/ "./public/components/main/main.tsx":
/*!*****************************************!*\
  !*** ./public/components/main/main.tsx ***!
  \*****************************************/
/*! exports provided: Main */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Main", function() { return Main; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _reports_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reports_table */ "./public/components/main/reports_table.tsx");
/* harmony import */ var _main_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./main_utils */ "./public/components/main/main_utils.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ "./public/components/utils/utils.tsx");
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





const reportCountStyles = {
  color: 'gray',
  display: 'inline'
};
function Main(props) {
  const [reportsTableContent, setReportsTableContent] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [reportDefinitionsTableContent, setReportDefinitionsTableContent] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [toasts, setToasts] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);

  const addPermissionsMissingDownloadToastHandler = () => {
    const toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["permissionsMissingActions"].GENERATING_REPORT);
    setToasts(toasts.concat(toast));
  };

  const handlePermissionsMissingDownloadToast = () => {
    addPermissionsMissingDownloadToastHandler();
  };

  const addReportsTableContentErrorToastHandler = errorType => {
    let toast = {};

    if (errorType === 'permissions') {
      toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["permissionsMissingActions"].LOADING_REPORTS_TABLE);
    } else if (errorType === 'API') {
      toast = {
        title: 'Error generating reports table.',
        color: 'danger',
        iconType: 'alert',
        id: 'reportsTableErrorToast'
      };
    }

    setToasts(toasts.concat(toast));
  };

  const handleReportsTableErrorToast = errorType => {
    addReportsTableContentErrorToastHandler(errorType);
  };

  const addReportDefinitionsTableErrorToastHandler = errorType => {
    let toast = {};

    if (errorType === 'permissions') {
      toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_4__["permissionsMissingActions"].LOADING_DEFINITIONS_TABLE);
    } else if (errorType === 'API') {
      toast = {
        title: 'Error generating report definitions table.',
        color: 'danger',
        iconType: 'alert',
        id: 'reportDefinitionsTableErrorToast'
      };
    }

    setToasts(toasts.concat(toast));
  };

  const handleReportDefinitionsTableErrorToast = errorType => {
    addReportDefinitionsTableErrorToastHandler(errorType);
  };

  const addErrorOnDemandDownloadToastHandler = () => {
    const errorToast = {
      title: 'Error downloading report.',
      color: 'danger',
      iconType: 'alert',
      id: 'onDemandDownloadErrorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleOnDemandDownloadErrorToast = () => {
    addErrorOnDemandDownloadToastHandler();
  };

  const addSuccessOnDemandDownloadToastHandler = () => {
    const successToast = {
      title: 'Successfully downloaded report.',
      color: 'success',
      iconType: 'check',
      id: 'onDemandDownloadSuccessToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const handleOnDemandDownloadSuccessToast = () => {
    addSuccessOnDemandDownloadToastHandler();
  };

  const addCreateReportDefinitionSuccessToastHandler = () => {
    const successToast = {
      title: 'Successfully created report definition.',
      color: 'success',
      iconType: 'check',
      id: 'createReportDefinitionSuccessToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const handleCreateReportDefinitionSuccessToast = () => {
    addCreateReportDefinitionSuccessToastHandler();
  };

  const addEditReportDefinitionSuccessToastHandler = () => {
    const successToast = {
      title: 'Successfully updated report definition.',
      color: 'success',
      iconType: 'check',
      id: 'editReportDefinitionSuccessToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const handleEditReportDefinitionSuccessToast = () => {
    addEditReportDefinitionSuccessToastHandler();
  };

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const pagination = {
    initialPageSize: 10,
    pageSizeOptions: [8, 10, 13]
  };
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    props.setBreadcrumbs([{
      text: 'Reporting',
      href: '#'
    }]);
    refreshReportsTable();
    refreshReportsDefinitionsTable();

    if (window.location.href.includes('create=success')) {
      handleCreateReportDefinitionSuccessToast(); // refresh might not fetch the latest changes when coming from create or edit page
      // workaround to wait 1 second and refresh again

      setTimeout(() => {
        refreshReportsTable();
        refreshReportsDefinitionsTable();
      }, 1000);
    } else if (window.location.href.includes('edit=success')) {
      handleEditReportDefinitionSuccessToast();
      setTimeout(() => {
        refreshReportsTable();
        refreshReportsDefinitionsTable();
      }, 1000);
    }

    window.location.href = 'opendistro_kibana_reports#/';
  }, []);

  const refreshReportsTable = async () => {
    const {
      httpClient
    } = props;
    await httpClient.get('../api/reporting/reports').then(response => {
      setReportsTableContent(Object(_main_utils__WEBPACK_IMPORTED_MODULE_3__["addReportsTableContent"])(response.data));
    }).catch(error => {
      console.log('error when fetching all reports: ', error); // permission denied error

      if (error.body.statusCode === 403) {
        handleReportsTableErrorToast('permissions');
      } else {
        handleReportsTableErrorToast('API');
      }
    });
  };

  const refreshReportsDefinitionsTable = async () => {
    const {
      httpClient
    } = props;
    await httpClient.get('../api/reporting/reportDefinitions').then(response => {
      setReportDefinitionsTableContent(Object(_main_utils__WEBPACK_IMPORTED_MODULE_3__["addReportDefinitionsTableContent"])(response.data));
    }).catch(error => {
      console.log('error when fetching all report definitions: ', error);

      if (error.body.statusCode === 403) {
        handleReportDefinitionsTableErrorToast('permissions');
      } else {
        handleReportDefinitionsTableErrorToast('API');
      }
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], {
    paddingSize: 'l'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    justifyContent: "spaceEvenly"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Reports", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    style: reportCountStyles
  }, " (", reportsTableContent.length, ")")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    component: "span",
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    size: "m",
    onClick: refreshReportsTable,
    iconType: "refresh"
  }, "Refresh"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHorizontalRule"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reports_table__WEBPACK_IMPORTED_MODULE_2__["ReportsTable"], {
    pagination: pagination,
    reportsTableItems: reportsTableContent,
    httpClient: props['httpClient'],
    handleSuccessToast: handleOnDemandDownloadSuccessToast,
    handleErrorToast: handleOnDemandDownloadErrorToast,
    handlePermissionsMissingToast: handlePermissionsMissingDownloadToast
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiGlobalToastList"], {
    toasts: toasts,
    dismissToast: removeToast,
    toastLifeTimeMs: 6000
  }));
}

/***/ }),

/***/ "./public/components/main/report_definition_details/report_definition_details.tsx":
/*!****************************************************************************************!*\
  !*** ./public/components/main/report_definition_details/report_definition_details.tsx ***!
  \****************************************************************************************/
/*! exports provided: ReportDefinitionDetails */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportDefinitionDetails", function() { return ReportDefinitionDetails; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _report_details_report_details__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../report_details/report_details */ "./public/components/main/report_details/report_details.tsx");
/* harmony import */ var _main_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../main_utils */ "./public/components/main/main_utils.tsx");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _report_definitions_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../report_definitions/utils */ "./public/components/report_definitions/utils/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/utils */ "./public/components/utils/utils.tsx");
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







const ON_DEMAND = 'On demand';
function ReportDefinitionDetails(props) {
  const [reportDefinitionDetails, setReportDefinitionDetails] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const [reportDefinitionRawResponse, setReportDefinitionRawResponse] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const [toasts, setToasts] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [showDeleteModal, setShowDeleteModal] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const reportDefinitionId = props.match['params']['reportDefinitionId'];

  const handleShowDeleteModal = e => {
    setShowDeleteModal(e);
  };

  const addPermissionsMissingStatusChangeToastHandler = () => {
    const toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingActions"].CHANGE_SCHEDULE_STATUS);
    setToasts(toasts.concat(toast));
  };

  const addPermissionsMissingDeleteToastHandler = () => {
    const toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingActions"].DELETE_REPORT_DEFINITION);
    setToasts(toasts.concat(toast));
  };

  const handlePermissionsMissingDeleteToast = () => {
    addPermissionsMissingDeleteToastHandler();
  };

  const addPermissionsMissingGenerateReportToastHandler = () => {
    const toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingActions"].GENERATING_REPORT);
    setToasts(toasts.concat(toast));
  };

  const addErrorLoadingDetailsToastHandler = () => {
    const errorToast = {
      title: 'Error loading report definition details.',
      color: 'danger',
      iconType: 'alert',
      id: 'reportDefinitionDetailsErrorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleDetailsErrorToast = () => {
    addErrorLoadingDetailsToastHandler();
  };

  const addSuccessGeneratingReportToastHandler = () => {
    const successToast = {
      title: 'Successfully generated report.',
      color: 'success',
      iconType: 'check',
      id: 'generateReportSuccessToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessGeneratingReportToast = () => {
    addSuccessGeneratingReportToastHandler();
  };

  const addErrorGeneratingReportToastHandler = () => {
    const errorToast = {
      title: 'Error generating report.',
      color: 'danger',
      iconType: 'alert',
      id: 'generateReportErrorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorGeneratingReportToast = errorType => {
    if (errorType === 'permissions') {
      addPermissionsMissingGenerateReportToastHandler();
    } else if (errorType === 'API') {
      addErrorGeneratingReportToastHandler();
    }
  };

  const addSuccessEnablingScheduleToastHandler = () => {
    const successToast = {
      title: 'Successfully enabled schedule.',
      color: 'success',
      iconType: 'check',
      id: 'successEnableToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const addErrorEnablingScheduleToastHandler = () => {
    const errorToast = {
      title: 'Error enabling schedule.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const addSuccessDisablingScheduleToastHandler = () => {
    const successToast = {
      title: 'Successfully disabled schedule.',
      color: 'success',
      iconType: 'check',
      id: 'successDisableToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessChangingScheduleStatusToast = statusChange => {
    if (statusChange === 'enable') {
      addSuccessEnablingScheduleToastHandler();
    } else if (statusChange === 'disable') {
      addSuccessDisablingScheduleToastHandler();
    }
  };

  const addErrorDisablingScheduleToastHandler = () => {
    const errorToast = {
      title: 'Error disabling schedule.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorDisableToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorChangingScheduleStatusToast = statusChange => {
    if (statusChange === 'enable') {
      addErrorEnablingScheduleToastHandler();
    } else if (statusChange === 'disable') {
      addErrorDisablingScheduleToastHandler();
    } else if (statusChange === 'permissions') {
      addPermissionsMissingStatusChangeToastHandler();
    }
  };

  const addErrorDeletingReportDefinitionToastHandler = () => {
    const errorToast = {
      title: 'Error deleting report definition.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorDeleteToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorDeletingReportDefinitionToast = () => {
    addErrorDeletingReportDefinitionToastHandler();
  };

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const handleReportDefinitionDetails = e => {
    setReportDefinitionDetails(e);
  };

  const handleReportDefinitionRawResponse = e => {
    setReportDefinitionRawResponse(e);
  };

  const DeleteConfirmationModal = () => {
    const closeModal = () => {
      setShowDeleteModal(false);
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiOverlayMask"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiConfirmModal"], {
      title: "Delete report definition",
      onCancel: closeModal,
      onConfirm: deleteReportDefinition,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      buttonColor: "danger",
      defaultFocusedButton: "confirm"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Are you sure you want to delete \"", reportDefinitionDetails.name, "\"?"))));
  };

  const humanReadableScheduleDetails = trigger => {
    let scheduleDetails = '';

    if (trigger.trigger_type === 'Schedule') {
      if (trigger.trigger_params.schedule_type === 'Recurring') {
        // Daily
        if (trigger.trigger_params.schedule.interval.unit === 'DAYS' && trigger.trigger_params.schedule.interval.period === 1) {
          const date = new Date(trigger.trigger_params.schedule.interval.start_time);
          scheduleDetails = 'Daily @ ' + date.toTimeString();
        } // By interval
        else {
            const date = new Date(trigger.trigger_params.schedule.interval.start_time);
            scheduleDetails = 'By interval, every ' + trigger.trigger_params.schedule.interval.period + ' ' + trigger.trigger_params.schedule.interval.unit.toLowerCase() + ', starting @ ' + date.toTimeString();
          }
      } // Cron
      else if (trigger.trigger_params.schedule_type === 'Cron based') {
          scheduleDetails = 'Cron based: ' + trigger.trigger_params.schedule.cron.expression + ' (' + trigger.trigger_params.schedule.cron.timezone + ')';
        }
    }

    return scheduleDetails;
  };

  const getReportDefinitionDetailsMetadata = data => {
    const reportDefinition = data.report_definition;
    const {
      report_params: reportParams,
      trigger,
      delivery,
      time_created: timeCreated,
      last_updated: lastUpdated
    } = reportDefinition;
    const {
      trigger_type: triggerType,
      trigger_params: triggerParams
    } = trigger;
    const {
      delivery_type: deliveryType,
      delivery_params: deliveryParams
    } = delivery;
    const {
      core_params: {
        base_url: baseUrl,
        report_format: reportFormat,
        time_duration: timeDuration
      }
    } = reportParams;
    let readableDate = new Date(timeCreated);
    let displayCreatedDate = readableDate.toDateString() + ' ' + readableDate.toLocaleTimeString();
    let readableUpdatedDate = new Date(lastUpdated);
    let displayUpdatedDate = readableUpdatedDate.toDateString() + ' ' + readableUpdatedDate.toLocaleTimeString();
    let reportDefinitionDetails = {
      name: reportParams.report_name,
      description: reportParams.description === '' ? `\u2014` : reportParams.description,
      created: displayCreatedDate,
      lastUpdated: displayUpdatedDate,
      source: reportParams.report_source,
      baseUrl: baseUrl,
      // TODO: need better display
      timePeriod: moment__WEBPACK_IMPORTED_MODULE_4___default.a.duration(timeDuration).humanize(),
      fileFormat: reportFormat,
      reportHeader: reportParams.core_params.hasOwnProperty('header') ? _report_definitions_utils__WEBPACK_IMPORTED_MODULE_5__["converter"].makeMarkdown(reportParams.core_params.header) : `\u2014`,
      reportFooter: reportParams.core_params.hasOwnProperty('footer') ? _report_definitions_utils__WEBPACK_IMPORTED_MODULE_5__["converter"].makeMarkdown(reportParams.core_params.footer) : `\u2014`,
      triggerType: triggerType,
      scheduleDetails: triggerParams ? humanReadableScheduleDetails(data.report_definition.trigger) : `\u2014`,
      channel: deliveryType,
      status: reportDefinition.status,
      kibanaRecipients: deliveryParams.kibana_recipients ? deliveryParams.kibana_recipients : `\u2014`,
      emailRecipients: deliveryType === 'Channel' ? deliveryParams.recipients : `\u2014`,
      emailSubject: deliveryType === 'Channel' ? deliveryParams.title : `\u2014`,
      emailBody: deliveryType === 'Channel' ? deliveryParams.textDescription : `\u2014`
    };
    return reportDefinitionDetails;
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    const {
      httpClient
    } = props;
    httpClient.get(`../api/reporting/reportDefinitions/${reportDefinitionId}`).then(response => {
      handleReportDefinitionRawResponse(response);
      handleReportDefinitionDetails(getReportDefinitionDetailsMetadata(response));
      props.setBreadcrumbs([{
        text: 'Reporting',
        href: '#'
      }, {
        text: `Report definition details: ${response.report_definition.report_params.report_name}`
      }]);
    }).catch(error => {
      console.error('error when getting report definition details:', error);
      handleDetailsErrorToast();
    });
  }, []);

  const fileFormatDownload = data => {
    let formatUpper = data['fileFormat'];
    formatUpper = _main_utils__WEBPACK_IMPORTED_MODULE_3__["fileFormatsUpper"][formatUpper];
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
      onClick: generateReportFromDetails
    }, formatUpper + ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "importAction"
    }));
  };

  const sourceURL = data => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
      href: `${data.baseUrl}`,
      target: "_blank"
    }, data['source']);
  };

  const getRelativeStartDate = duration => {
    duration = moment__WEBPACK_IMPORTED_MODULE_4___default.a.duration(duration);
    let time_difference = moment__WEBPACK_IMPORTED_MODULE_4___default.a.now() - duration;
    return new Date(time_difference);
  };

  const changeScheduledReportDefinitionStatus = statusChange => {
    let updatedReportDefinition = reportDefinitionRawResponse.report_definition;

    if (statusChange === 'Disable') {
      updatedReportDefinition.trigger.trigger_params.enabled = false;
      updatedReportDefinition.status = 'Disabled';
    } else if (statusChange === 'Enable') {
      updatedReportDefinition.trigger.trigger_params.enabled = true;
      updatedReportDefinition.status = 'Active';
    }

    const {
      httpClient
    } = props;
    httpClient.put(`../api/reporting/reportDefinitions/${reportDefinitionId}`, {
      body: JSON.stringify(updatedReportDefinition),
      params: reportDefinitionId.toString()
    }).then(() => {
      const updatedRawResponse = {
        report_definition: {}
      };
      updatedRawResponse.report_definition = updatedReportDefinition;
      handleReportDefinitionRawResponse(updatedRawResponse);
      setReportDefinitionDetails(getReportDefinitionDetailsMetadata(updatedRawResponse));

      if (statusChange === 'Enable') {
        handleSuccessChangingScheduleStatusToast('enable');
      } else if (statusChange === 'Disable') {
        handleSuccessChangingScheduleStatusToast('disable');
      }
    }).catch(error => {
      console.error('error in updating report definition status:', error);

      if (error.body.statusCode === 403) {
        handleErrorChangingScheduleStatusToast('permissions');
      } else {
        if (statusChange === 'Enable') {
          handleErrorChangingScheduleStatusToast('enable');
        } else if (statusChange === 'Disable') {
          handleErrorChangingScheduleStatusToast('disable');
        }
      }
    });
  };

  const ScheduledDefinitionStatus = () => {
    const status = reportDefinitionDetails.status === 'Active' ? 'Disable' : 'Enable';
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
      onClick: () => changeScheduledReportDefinitionStatus(status),
      id: 'changeStatusFromDetailsButton'
    }, status);
  };

  const generateReportFromDetails = async () => {
    let duration = reportDefinitionRawResponse.report_definition.report_params.core_params.time_duration;
    const fromDate = getRelativeStartDate(duration);
    let onDemandDownloadMetadata = {
      query_url: `${reportDefinitionDetails.baseUrl}?_g=(time:(from:'${fromDate.toISOString()}',to:'${moment__WEBPACK_IMPORTED_MODULE_4___default()().toISOString()}'))`,
      time_from: fromDate.valueOf(),
      time_to: moment__WEBPACK_IMPORTED_MODULE_4___default()().valueOf(),
      report_definition: reportDefinitionRawResponse.report_definition
    };
    const {
      httpClient
    } = props;
    let generateReportSuccess = await Object(_main_utils__WEBPACK_IMPORTED_MODULE_3__["generateReport"])(onDemandDownloadMetadata, httpClient);

    if (generateReportSuccess.status) {
      handleSuccessGeneratingReportToast();
    } else {
      if (generateReportSuccess.permissionsError) {
        handleErrorGeneratingReportToast('permissions');
      } else {
        handleErrorGeneratingReportToast('API');
      }
    }
  };

  const deleteReportDefinition = () => {
    const {
      httpClient
    } = props;
    httpClient.delete(`../api/reporting/reportDefinitions/${reportDefinitionId}`).then(() => {
      window.location.assign(`opendistro_kibana_reports#/`);
    }).catch(error => {
      console.log('error when deleting report definition:', error);

      if (error.body.statusCode === 403) {
        handlePermissionsMissingDeleteToast();
      } else {
        handleErrorDeletingReportDefinitionToast();
      }
    });
  };

  const showActionButton = reportDefinitionDetails.triggerType === ON_DEMAND ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    onClick: () => generateReportFromDetails(),
    id: 'generateReportFromDetailsButton'
  }, "Generate report") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ScheduledDefinitionStatus, null);
  const triggerSection = reportDefinitionDetails.triggerType === ON_DEMAND ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Trigger type',
    reportDetailsComponentContent: reportDefinitionDetails.triggerType
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Trigger type',
    reportDetailsComponentContent: reportDefinitionDetails.triggerType
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Schedule details',
    reportDetailsComponentContent: reportDefinitionDetails.scheduleDetails
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Status',
    reportDetailsComponentContent: reportDefinitionDetails.status
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], null));
  const showDeleteConfirmationModal = showDeleteModal ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DeleteConfirmationModal, null) : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Report definition details")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContent"], {
    panelPaddingSize: 'l'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeaderSection"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, reportDefinitionDetails.name))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    justifyContent: "flexEnd",
    alignItems: "flexEnd",
    gutterSize: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    color: 'danger',
    onClick: handleShowDeleteModal,
    id: 'deleteReportDefinitionButton'
  }, "Delete")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, showActionButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    fill: true,
    onClick: () => {
      window.location.assign(`opendistro_kibana_reports#/edit/${reportDefinitionId}`);
    },
    id: 'editReportDefinitionButton'
  }, "Edit")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHorizontalRule"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Report settings")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Name',
    reportDetailsComponentContent: reportDefinitionDetails.name
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Description',
    reportDetailsComponentContent: reportDefinitionDetails.description
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Created',
    reportDetailsComponentContent: reportDefinitionDetails.created
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Last updated',
    reportDetailsComponentContent: reportDefinitionDetails.lastUpdated
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Source',
    reportDetailsComponentContent: sourceURL(reportDefinitionDetails)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Time period',
    reportDetailsComponentContent: `Last ${reportDefinitionDetails.timePeriod}`
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'File format',
    reportDetailsComponentContent: fileFormatDownload(reportDefinitionDetails)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Report header',
    reportDetailsComponentContent: Object(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["trimAndRenderAsText"])(reportDefinitionDetails.reportHeader)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["ReportDetailsComponent"], {
    reportDetailsComponentTitle: 'Report footer',
    reportDetailsComponentContent: Object(_report_details_report_details__WEBPACK_IMPORTED_MODULE_2__["trimAndRenderAsText"])(reportDefinitionDetails.reportFooter)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Report trigger")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), triggerSection, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiGlobalToastList"], {
    toasts: toasts,
    dismissToast: removeToast,
    toastLifeTimeMs: 6000
  }), showDeleteConfirmationModal));
}

/***/ }),

/***/ "./public/components/main/report_details/report_details.tsx":
/*!******************************************************************!*\
  !*** ./public/components/main/report_details/report_details.tsx ***!
  \******************************************************************/
/*! exports provided: ReportDetailsComponent, trimAndRenderAsText, formatEmails, ReportDetails */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportDetailsComponent", function() { return ReportDetailsComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimAndRenderAsText", function() { return trimAndRenderAsText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatEmails", function() { return formatEmails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportDetails", function() { return ReportDetails; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _main_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../main_utils */ "./public/components/main/main_utils.tsx");
/* harmony import */ var _report_definitions_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../report_definitions/utils */ "./public/components/report_definitions/utils/index.ts");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/datemath */ "../../packages/elastic-datemath/target/index.js");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_datemath__WEBPACK_IMPORTED_MODULE_4__);
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





const ReportDetailsComponent = props => {
  const {
    reportDetailsComponentTitle,
    reportDetailsComponentContent
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDescriptionList"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDescriptionListTitle"], null, reportDetailsComponentTitle), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDescriptionListDescription"], null, reportDetailsComponentContent)));
}; // convert markdown to plain text, trim it if it's longer than 3 lines

const trimAndRenderAsText = markdown => {
  if (!markdown) return markdown;
  const lines = markdown.split('\n').filter(line => line);
  const elements = lines.slice(0, 3).map((line, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    key: i
  }, line));
  return lines.length <= 3 ? elements : elements.concat( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    key: 3
  }, "..."));
};
const formatEmails = emails => {
  return Array.isArray(emails) ? emails.join(', ') : emails;
};
function ReportDetails(props) {
  const [reportDetails, setReportDetails] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const [toasts, setToasts] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const reportId = props.match['params']['reportId'];

  const addErrorToastHandler = () => {
    const errorToast = {
      title: 'Error loading report details.',
      color: 'danger',
      iconType: 'alert',
      id: 'reportDetailsErrorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorToast = () => {
    addErrorToastHandler();
  };

  const addSuccessToastHandler = () => {
    const successToast = {
      title: 'Success',
      color: 'success',
      text: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Report successfully downloaded!"),
      id: 'onDemandDownloadSuccessToast'
    };
    setToasts(toasts.concat(successToast));
  };

  const handleSuccessToast = () => {
    addSuccessToastHandler();
  };

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const handleReportDetails = e => {
    setReportDetails(e);
  };

  const convertTimestamp = timestamp => {
    let displayDate = `\u2014`;

    if (timestamp) {
      let readableDate = new Date(timestamp);
      displayDate = readableDate.toLocaleString();
    }

    return displayDate;
  };

  const parseTimePeriod = queryUrl => {
    let [timeStringRegEx, fromDateString, toDateString] = queryUrl.match(/time:\(from:(.+),to:(.+?)\)/);
    fromDateString = fromDateString.replace(/[']+/g, '');
    toDateString = toDateString.replace(/[']+/g, '');
    let fromDateParsed = _elastic_datemath__WEBPACK_IMPORTED_MODULE_4___default.a.parse(fromDateString);
    let toDateParsed = _elastic_datemath__WEBPACK_IMPORTED_MODULE_4___default.a.parse(toDateString);
    const fromTimePeriod = fromDateParsed === null || fromDateParsed === void 0 ? void 0 : fromDateParsed.toDate();
    const toTimePeriod = toDateParsed === null || toDateParsed === void 0 ? void 0 : toDateParsed.toDate();
    return (fromTimePeriod === null || fromTimePeriod === void 0 ? void 0 : fromTimePeriod.toLocaleString()) + ' -> ' + (toTimePeriod === null || toTimePeriod === void 0 ? void 0 : toTimePeriod.toLocaleString());
  };

  const getReportDetailsData = report => {
    const {
      report_definition: reportDefinition,
      last_updated: lastUpdated,
      state,
      query_url: queryUrl
    } = report;
    const {
      report_params: reportParams,
      trigger,
      delivery
    } = reportDefinition;
    const {
      trigger_type: triggerType,
      trigger_params: triggerParams
    } = trigger;
    const {
      delivery_type: deliveryType,
      delivery_params: deliveryParams
    } = delivery;
    const coreParams = reportParams.core_params; // covert timestamp to local date-time string

    let reportDetails = {
      reportName: reportParams.report_name,
      description: reportParams.description === '' ? `\u2014` : reportParams.description,
      created: convertTimestamp(report.time_created),
      lastUpdated: convertTimestamp(report.last_updated),
      source: reportParams.report_source,
      // TODO:  we have all data needed, time_from, time_to, time_duration,
      // think of a way to better display
      time_period: parseTimePeriod(queryUrl),
      defaultFileFormat: coreParams.report_format,
      state: state,
      reportHeader: reportParams.core_params.hasOwnProperty('header') ? _report_definitions_utils__WEBPACK_IMPORTED_MODULE_3__["converter"].makeMarkdown(reportParams.core_params.header) : `\u2014`,
      reportFooter: reportParams.core_params.hasOwnProperty('footer') ? _report_definitions_utils__WEBPACK_IMPORTED_MODULE_3__["converter"].makeMarkdown(reportParams.core_params.footer) : `\u2014`,
      triggerType: triggerType,
      scheduleType: triggerParams ? triggerParams.schedule_type : `\u2014`,
      scheduleDetails: `\u2014`,
      alertDetails: `\u2014`,
      channel: deliveryType,
      emailRecipients: deliveryType === 'Channel' ? deliveryParams.recipients : `\u2014`,
      emailSubject: deliveryType === 'Channel' ? deliveryParams.title : `\u2014`,
      emailBody: deliveryType === 'Channel' ? deliveryParams.textDescription : `\u2014`,
      queryUrl: queryUrl
    };
    return reportDetails;
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    const {
      httpClient
    } = props;
    httpClient.get('../api/reporting/reports/' + reportId).then(response => {
      handleReportDetails(getReportDetailsData(response));
      props.setBreadcrumbs([{
        text: 'Reporting',
        href: '#'
      }, {
        text: 'Report details: ' + response.report_definition.report_params.report_name
      }]);
    }).catch(error => {
      console.log('Error when fetching report details: ', error);
      handleErrorToast();
    });
  }, []);

  const fileFormatDownload = data => {
    let formatUpper = data['defaultFileFormat'];
    formatUpper = _main_utils__WEBPACK_IMPORTED_MODULE_2__["fileFormatsUpper"][formatUpper];
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
      onClick: () => {
        Object(_main_utils__WEBPACK_IMPORTED_MODULE_2__["generateReportById"])(reportId, props.httpClient, handleSuccessToast, handleErrorToast);
      }
    }, formatUpper + ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "importAction"
    }));
  };

  const sourceURL = data => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
      href: `${data.queryUrl}`,
      target: "_blank"
    }, data['source']);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Report details")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContent"], {
    panelPaddingSize: 'l'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeaderSection"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, reportDetails['reportName'])))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHorizontalRule"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Report Settings")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Name',
    reportDetailsComponentContent: reportDetails['reportName']
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Description',
    reportDetailsComponentContent: reportDetails['description']
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Created',
    reportDetailsComponentContent: reportDetails['created']
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Last updated',
    reportDetailsComponentContent: reportDetails['lastUpdated']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Source',
    reportDetailsComponentContent: sourceURL(reportDetails)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Time period',
    reportDetailsComponentContent: reportDetails.time_period
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'File format',
    reportDetailsComponentContent: fileFormatDownload(reportDetails)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'State',
    reportDetailsComponentContent: reportDetails['state']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Report header',
    reportDetailsComponentContent: trimAndRenderAsText(reportDetails['reportHeader'])
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Report footer',
    reportDetailsComponentContent: trimAndRenderAsText(reportDetails['reportFooter'])
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Report trigger")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Report type',
    reportDetailsComponentContent: reportDetails['triggerType']
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Schedule type',
    reportDetailsComponentContent: reportDetails['scheduleType']
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, {
    reportDetailsComponentTitle: 'Schedule details',
    reportDetailsComponentContent: reportDetails['scheduleDetails']
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportDetailsComponent, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiGlobalToastList"], {
    toasts: toasts,
    dismissToast: removeToast,
    toastLifeTimeMs: 6000
  })));
}

/***/ }),

/***/ "./public/components/main/reports_table.tsx":
/*!**************************************************!*\
  !*** ./public/components/main/reports_table.tsx ***!
  \**************************************************/
/*! exports provided: ReportsTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportsTable", function() { return ReportsTable; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _main_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main_utils */ "./public/components/main/main_utils.tsx");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/datemath */ "../../packages/elastic-datemath/target/index.js");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_datemath__WEBPACK_IMPORTED_MODULE_3__);
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




const reportStatusOptions = ['Created', 'Error', 'Pending', 'Shared', 'Archived'];
const reportTypeOptions = ['Schedule', 'On demand'];
const emptyMessageReports = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiEmptyPrompt"], {
  title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "No reports to display"),
  titleSize: "xs",
  body: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, "Create a report definition, or share/download a report from a dashboard, saved search or visualization."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, "To learn more, see", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], null, "Get started with Kibana reporting ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
    type: "popout"
  }))))
});
function ReportsTable(props) {
  const {
    pagination,
    reportsTableItems,
    httpClient,
    handleSuccessToast,
    handleErrorToast,
    handlePermissionsMissingToast
  } = props;
  const [sortField, setSortField] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('timeCreated');
  const [sortDirection, setSortDirection] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('des');
  const [showLoading, setShowLoading] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [message, setMessage] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');

  const handleLoading = e => {
    setShowLoading(e);
  };

  const GenerateReportLoadingModal = () => {
    const [isModalVisible, setIsModalVisible] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(true);

    const closeModal = () => {
      setIsModalVisible(false);
      setShowLoading(false);
    };

    const showModal = () => setIsModalVisible(true);

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiOverlayMask"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiModal"], {
      onClose: closeModal,
      style: {
        maxWidth: 350,
        minWidth: 300
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiModalHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
      textAlign: "right"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Generating report")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiModalBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, "Preparing your file for download."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, "You can close this dialog while we continue in the background."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
      justifyContent: "center",
      alignItems: "center"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLoadingSpinner"], {
      size: "xl",
      style: {
        minWidth: 75,
        minHeight: 75
      }
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "l"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
      alignItems: "flexEnd",
      justifyContent: "flexEnd"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
      onClick: closeModal
    }, "Close")))))));
  };

  const onDemandDownload = async id => {
    handleLoading(true);
    await Object(_main_utils__WEBPACK_IMPORTED_MODULE_2__["generateReportById"])(id, httpClient, handleSuccessToast, handleErrorToast, handlePermissionsMissingToast);
    handleLoading(false);
  };

  const parseTimePeriod = queryUrl => {
    let [timeStringRegEx, fromDateString, toDateString] = queryUrl.match(/time:\(from:(.+),to:(.+?)\)/);
    fromDateString = fromDateString.replace(/[']+/g, '');
    toDateString = toDateString.replace(/[']+/g, '');
    let fromDateParsed = _elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(fromDateString);
    let toDateParsed = _elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(toDateString);
    const fromTimePeriod = fromDateParsed === null || fromDateParsed === void 0 ? void 0 : fromDateParsed.toDate();
    const toTimePeriod = toDateParsed === null || toDateParsed === void 0 ? void 0 : toDateParsed.toDate();
    return (fromTimePeriod === null || fromTimePeriod === void 0 ? void 0 : fromTimePeriod.toLocaleString()) + ' -> ' + (toTimePeriod === null || toTimePeriod === void 0 ? void 0 : toTimePeriod.toLocaleString());
  };

  const reportsTableColumns = [{
    field: 'reportName',
    name: 'Report ID',
    render: reportName => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
        size: "s"
      }, reportName);
    }
  }, {
    // TODO: link to dashboard/visualization snapshot, use "queryUrl" field. Display dashboard name?
    field: 'reportSource',
    name: 'Source',
    render: (reportSource, item) => item.state === 'Pending' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
      size: "s"
    }, reportSource) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
      href: item.url,
      target: "_blank"
    }, reportSource)
  }, // { 
  //   field: 'type',
  //   name: 'Type',
  //   sortable: true, 
  //   truncateText: false,
  // },
  {
    field: 'timeCreated',
    name: 'Creation time',
    render: date => {
      let readable = Object(_main_utils__WEBPACK_IMPORTED_MODULE_2__["humanReadableDate"])(date);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
        size: "s"
      }, readable);
    }
  }, {
    field: 'url',
    name: 'Time period',
    render: url => {
      let timePeriod = parseTimePeriod(url);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
        size: "s"
      }, timePeriod);
    }
  }, // {
  //   field: 'state',
  //   name: 'State',
  //   sortable: true,
  //   truncateText: false,
  // },
  {
    field: 'id',
    name: 'Generate',
    render: (id, item) => item.state === 'Pending' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
      size: "s"
    }, _main_utils__WEBPACK_IMPORTED_MODULE_2__["fileFormatsUpper"][item.format], " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "importAction"
    })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
      onClick: () => onDemandDownload(id)
    }, _main_utils__WEBPACK_IMPORTED_MODULE_2__["fileFormatsUpper"][item.format], " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiIcon"], {
      type: "importAction"
    }))
  }];
  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection
    }
  };
  const reportsListSearch = {
    box: {
      incremental: true,
      placeholder: 'Search by Report ID'
    } // filters: [
    //   {
    //     type: 'field_value_selection',
    //     field: 'type',
    //     name: 'Type',
    //     multiselect: false,
    //     options: reportTypeOptions.map((type) => ({
    //       value: type,
    //       name: type,
    //       view: type,
    //     })),
    //   },
    //   {
    //     type: 'field_value_selection',
    //     field: 'state',
    //     name: 'State',
    //     multiselect: false,
    //     options: reportStatusOptions.map((state) => ({
    //       value: state,
    //       name: state,
    //       view: state,
    //     })),
    //   },
    // ],

  };
  const displayMessage = reportsTableItems.length === 0 ? emptyMessageReports : '0 reports match the search criteria. Search again';
  const showLoadingModal = showLoading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GenerateReportLoadingModal, null) : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiInMemoryTable"], {
    items: reportsTableItems,
    itemId: "id",
    loading: false,
    message: displayMessage,
    columns: reportsTableColumns,
    search: reportsListSearch,
    pagination: pagination,
    sorting: sorting,
    hasActions: true,
    tableLayout: 'auto'
  }), showLoadingModal);
}

/***/ }),

/***/ "./public/components/report_definitions/create/create_report_definition.tsx":
/*!**********************************************************************************!*\
  !*** ./public/components/report_definitions/create/create_report_definition.tsx ***!
  \**********************************************************************************/
/*! exports provided: CreateReport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateReport", function() { return CreateReport; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _report_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../report_settings */ "./public/components/report_definitions/report_settings/index.ts");
/* harmony import */ var _delivery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../delivery */ "./public/components/report_definitions/delivery/index.ts");
/* harmony import */ var _report_trigger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../report_trigger */ "./public/components/report_definitions/report_trigger/index.ts");
/* harmony import */ var _main_main_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../main/main_utils */ "./public/components/main/main_utils.tsx");
/* harmony import */ var cron_validator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! cron-validator */ "./node_modules/cron-validator/lib/index.js");
/* harmony import */ var cron_validator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(cron_validator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils */ "./public/components/report_definitions/utils/index.ts");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../utils/utils */ "./public/components/utils/utils.tsx");
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










function CreateReport(props) {
  let createReportDefinitionRequest = {
    report_params: {
      report_name: '',
      report_source: '',
      description: '',
      core_params: {
        base_url: '',
        report_format: '',
        time_duration: ''
      }
    },
    delivery: {
      delivery_type: '',
      delivery_params: {}
    },
    trigger: {
      trigger_type: ''
    }
  };
  const [toasts, setToasts] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [comingFromError, setComingFromError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [preErrorData, setPreErrorData] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const [showSettingsReportNameError, setShowSettingsReportNameError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [settingsReportNameErrorMessage, setSettingsReportNameErrorMessage] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [showTriggerIntervalNaNError, setShowTriggerIntervalNaNError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [showCronError, setShowCronError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [showEmailRecipientsError, setShowEmailRecipientsError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [emailRecipientsErrorMessage, setEmailRecipientsErrorMessage] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [showTimeRangeError, setShowTimeRangeError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false); // preserve the state of the request after an invalid create report definition request

  if (comingFromError) {
    createReportDefinitionRequest = preErrorData;
  }

  const addInputValidationErrorToastHandler = () => {
    const errorToast = {
      title: 'One or more fields have an error. Please check and try again.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleInputValidationErrorToast = () => {
    addInputValidationErrorToastHandler();
  };

  const addErrorOnCreateToastHandler = errorType => {
    let toast = {};

    if (errorType === 'permissions') {
      toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_9__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_9__["permissionsMissingActions"].CREATING_REPORT_DEFINITION);
    } else if (errorType === 'API') {
      toast = {
        title: 'Error creating report definition.',
        color: 'danger',
        iconType: 'alert',
        id: 'errorToast'
      };
    }

    setToasts(toasts.concat(toast));
  };

  const handleErrorOnCreateToast = errorType => {
    addErrorOnCreateToastHandler(errorType);
  };

  const addInvalidTimeRangeToastHandler = () => {
    const errorToast = {
      title: 'Invalid time range selected.',
      color: 'danger',
      iconType: 'alert',
      id: 'timeRangeErrorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleInvalidTimeRangeToast = () => {
    addInvalidTimeRangeToastHandler();
  };

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  let timeRange = {
    timeFrom: new Date(),
    timeTo: new Date()
  };

  const definitionInputValidation = async (metadata, error) => {
    // check report name
    // allow a-z, A-Z, 0-9, (), [], ',' - and _ and spaces
    let regexp = /^[\w\-\s\(\)\[\]\,\_\-+]+$/;

    if (metadata.report_params.report_name.search(regexp) === -1) {
      setShowSettingsReportNameError(true);

      if (metadata.report_params.report_name === '') {
        setSettingsReportNameErrorMessage('Name must not be empty.');
      } else {
        setSettingsReportNameErrorMessage('Invalid characters in report name.');
      }

      error = true;
    } // if recurring by interval and input is not a number


    if (metadata.trigger.trigger_type === 'Schedule' && metadata.trigger.trigger_params.schedule_type === 'Recurring') {
      let interval = parseInt(metadata.trigger.trigger_params.schedule.interval.period);

      if (isNaN(interval)) {
        setShowTriggerIntervalNaNError(true);
        error = true;
      }
    } // if time range is invalid


    const nowDate = new Date(moment__WEBPACK_IMPORTED_MODULE_8___default.a.now());

    if (timeRange.timeFrom > timeRange.timeTo || timeRange.timeTo > nowDate) {
      setShowTimeRangeError(true);
      error = true;
    } // if cron based and cron input is invalid


    if (metadata.trigger.trigger_type === 'Schedule' && metadata.trigger.trigger_params.schedule_type === 'Cron based') {
      if (!Object(cron_validator__WEBPACK_IMPORTED_MODULE_6__["isValidCron"])(metadata.trigger.trigger_params.schedule.cron.expression)) {
        setShowCronError(true);
        error = true;
      }
    } // if email delivery


    if (metadata.delivery.delivery_type === 'Channel') {
      // no recipients are listed
      if (metadata.delivery.delivery_params.recipients.length === 0) {
        setShowEmailRecipientsError(true);
        setEmailRecipientsErrorMessage('Email recipients list cannot be empty.');
        error = true;
      } // recipients have invalid email addresses: regexp checks format xxxxx@yyyy.zzz


      let emailRegExp = /\S+@\S+\.\S+/;
      let index;
      let recipients = metadata.delivery.delivery_params.recipients;

      for (index = 0; index < recipients.length; ++index) {
        if (recipients[0].search(emailRegExp) === -1) {
          setShowEmailRecipientsError(true);
          setEmailRecipientsErrorMessage('Invalid email addresses in recipients list.');
          error = true;
        }
      }
    }

    return error;
  };

  const createNewReportDefinition = async (metadata, timeRange) => {
    const {
      httpClient
    } = props; //TODO: need better handle

    if (metadata.trigger.trigger_type === 'On demand' && metadata.trigger.trigger_params !== undefined) {
      delete metadata.trigger.trigger_params;
    }

    let error = false;
    await definitionInputValidation(metadata, error).then(response => {
      error = response;
    });

    if (error) {
      handleInputValidationErrorToast();
      setPreErrorData(metadata);
      setComingFromError(true);
    } else {
      // convert header and footer to html
      if ('header' in metadata.report_params.core_params) {
        metadata.report_params.core_params.header = _utils__WEBPACK_IMPORTED_MODULE_7__["converter"].makeHtml(metadata.report_params.core_params.header);
      }

      if ('footer' in metadata.report_params.core_params) {
        metadata.report_params.core_params.footer = _utils__WEBPACK_IMPORTED_MODULE_7__["converter"].makeHtml(metadata.report_params.core_params.footer);
      }

      httpClient.post('../api/reporting/reportDefinition', {
        body: JSON.stringify(metadata),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async resp => {
        //TODO: consider handle the on demand report generation from server side instead
        if (metadata.trigger.trigger_type === 'On demand') {
          let onDemandDownloadMetadata = {
            query_url: `${metadata.report_params.core_params.base_url}?_g=(time:(from:'${timeRange.timeFrom.toISOString()}',to:'${timeRange.timeTo.toISOString()}'))`,
            time_from: timeRange.timeFrom.valueOf(),
            time_to: timeRange.timeTo.valueOf(),
            report_definition: metadata
          };
          Object(_main_main_utils__WEBPACK_IMPORTED_MODULE_5__["generateReport"])(onDemandDownloadMetadata, httpClient);
        }

        window.location.assign(`opendistro_kibana_reports#/create=success`);
      }).catch(error => {
        console.log('error in creating report definition: ' + error);

        if (error.body.statusCode === 403) {
          handleErrorOnCreateToast('permissions');
        } else {
          handleErrorOnCreateToast('API');
        }
      });
    }
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    window.scrollTo(0, 0);
    props.setBreadcrumbs([{
      text: 'Reporting',
      href: '#'
    }, {
      text: 'Create report definition',
      href: '#/create'
    }]);
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Create report definition")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_settings__WEBPACK_IMPORTED_MODULE_2__["ReportSettings"], {
    edit: false,
    reportDefinitionRequest: createReportDefinitionRequest,
    httpClientProps: props['httpClient'],
    timeRange: timeRange,
    showSettingsReportNameError: showSettingsReportNameError,
    settingsReportNameErrorMessage: settingsReportNameErrorMessage,
    showTimeRangeError: showTimeRangeError
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_trigger__WEBPACK_IMPORTED_MODULE_4__["ReportTrigger"], {
    edit: false,
    reportDefinitionRequest: createReportDefinitionRequest,
    showTriggerIntervalNaNError: showTriggerIntervalNaNError,
    showCronError: showCronError
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_delivery__WEBPACK_IMPORTED_MODULE_3__["ReportDelivery"], {
    edit: false,
    reportDefinitionRequest: createReportDefinitionRequest,
    showEmailRecipientsError: showEmailRecipientsError,
    emailRecipientsErrorMessage: emailRecipientsErrorMessage
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    justifyContent: "flexEnd"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonEmpty"], {
    onClick: () => {
      window.location.assign(`opendistro_kibana_reports#/`);
    }
  }, "Cancel")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    fill: true,
    onClick: () => createNewReportDefinition(createReportDefinitionRequest, timeRange),
    id: 'createNewReportDefinition'
  }, "Create"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiGlobalToastList"], {
    toasts: toasts,
    dismissToast: removeToast,
    toastLifeTimeMs: 6000
  })));
}

/***/ }),

/***/ "./public/components/report_definitions/delivery/delivery.tsx":
/*!********************************************************************!*\
  !*** ./public/components/report_definitions/delivery/delivery.tsx ***!
  \********************************************************************/
/*! exports provided: ReportDelivery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportDelivery", function() { return ReportDelivery; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _delivery_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./delivery_constants */ "./public/components/report_definitions/delivery/delivery_constants.tsx");
/* harmony import */ var react_mde_lib_styles_css_react_mde_all_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-mde/lib/styles/css/react-mde-all.css */ "./node_modules/react-mde/lib/styles/css/react-mde-all.css");
/* harmony import */ var react_mde_lib_styles_css_react_mde_all_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_mde_lib_styles_css_react_mde_all_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _email__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./email */ "./public/components/report_definitions/delivery/email.tsx");
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





function ReportDelivery(props) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps
  } = props;
  const [emailCheckbox, setEmailCheckbox] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);

  const handleEmailCheckbox = e => {
    setEmailCheckbox(e.target.checked);

    if (e.target.checked) {
      // if checked, set delivery type to email
      reportDefinitionRequest.delivery.delivery_type = _delivery_constants__WEBPACK_IMPORTED_MODULE_2__["DELIVERY_TYPE_OPTIONS"][1].id;
    } else {
      // uncheck email checkbox means to use default setting, which is kibana user
      defaultCreateDeliveryParams();
    }
  };

  const emailDelivery = emailCheckbox ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_email__WEBPACK_IMPORTED_MODULE_4__["EmailDelivery"], props) : null;

  const defaultCreateDeliveryParams = () => {
    reportDefinitionRequest.delivery = {
      delivery_type: _delivery_constants__WEBPACK_IMPORTED_MODULE_2__["DELIVERY_TYPE_OPTIONS"][0].id,
      delivery_params: {
        kibana_recipients: []
      }
    };
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (edit) {
      httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
        const isEmailSelected = response.report_definition.delivery.delivery_type === _delivery_constants__WEBPACK_IMPORTED_MODULE_2__["DELIVERY_TYPE_OPTIONS"][1].id;
        handleEmailCheckbox({
          target: {
            checked: isEmailSelected
          }
        });
      });
    } else {
      // By default it's set to deliver to kibana user
      defaultCreateDeliveryParams();
    }
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContent"], {
    panelPaddingSize: 'l',
    hidden: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Notification settings"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHorizontalRule"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContentBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiCheckbox"], {
    id: "emailCheckboxDelivery",
    label: "Add email recipients",
    checked: emailCheckbox,
    onChange: handleEmailCheckbox
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), emailDelivery));
}

/***/ }),

/***/ "./public/components/report_definitions/delivery/delivery_constants.tsx":
/*!******************************************************************************!*\
  !*** ./public/components/report_definitions/delivery/delivery_constants.tsx ***!
  \******************************************************************************/
/*! exports provided: EMAIL_RECIPIENT_OPTIONS, DELIVERY_TYPE_OPTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMAIL_RECIPIENT_OPTIONS", function() { return EMAIL_RECIPIENT_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DELIVERY_TYPE_OPTIONS", function() { return DELIVERY_TYPE_OPTIONS; });
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
const EMAIL_RECIPIENT_OPTIONS = [];
const DELIVERY_TYPE_OPTIONS = [{
  id: 'Kibana user',
  label: 'Kibana user'
}, {
  id: 'Channel',
  label: 'Email'
}];

/***/ }),

/***/ "./public/components/report_definitions/delivery/email.tsx":
/*!*****************************************************************!*\
  !*** ./public/components/report_definitions/delivery/email.tsx ***!
  \*****************************************************************/
/*! exports provided: EmailDelivery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmailDelivery", function() { return EmailDelivery; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_mde__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-mde */ "./node_modules/react-mde/lib/js/index.js");
/* harmony import */ var react_mde__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_mde__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./public/components/report_definitions/utils/index.ts");
/* harmony import */ var _delivery_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./delivery_constants */ "./public/components/report_definitions/delivery/delivery_constants.tsx");
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






const EmailDelivery = props => {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
    showEmailRecipientsError,
    emailRecipientsErrorMessage
  } = props;
  const [emailRecipients, setEmailRecipients] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [selectedEmailRecipients, setSelectedEmailRecipients] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [emailSubject, setEmailSubject] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('');
  const [emailBody, setEmailBody] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('');
  const [selectedTab, setSelectedTab] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState('write');

  const handleCreateEmailRecipient = (searchValue, flattenedOptions = []) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    const newOption = {
      label: searchValue
    }; // Create the option if it doesn't exist.

    if (flattenedOptions.findIndex(option => option.label.trim().toLowerCase() === normalizedSearchValue) === -1) {
      setEmailRecipients([...emailRecipients, newOption]);
    }

    handleSelectEmailRecipients([...selectedEmailRecipients, newOption]);
  };

  const handleSelectEmailRecipients = e => {
    setSelectedEmailRecipients(e);
    reportDefinitionRequest.delivery.delivery_params.recipients = e.map(option => option.label);
  };

  const handleEmailSubject = e => {
    setEmailSubject(e.target.value);
    reportDefinitionRequest.delivery.delivery_params.title = e.target.value;
  };

  const handleEmailBody = e => {
    setEmailBody(e);
    reportDefinitionRequest.delivery.delivery_params.textDescription = e;
    reportDefinitionRequest.delivery.delivery_params.htmlDescription = _utils__WEBPACK_IMPORTED_MODULE_3__["converter"].makeHtml(e);
  }; // TODO: need better handling when we add full support for kibana user report delivery


  const optionalMessageLabel = `Add optional message (${selectedTab} mode)`;

  const defaultEditDeliveryParams = delivery => {
    //TODO: need better handle?
    // if the original notification setting is kibana user
    if (delivery.delivery_type === _delivery_constants__WEBPACK_IMPORTED_MODULE_4__["DELIVERY_TYPE_OPTIONS"][0].id) {
      defaultCreateDeliveryParams();
      delete reportDefinitionRequest.delivery.delivery_params.kibana_recipients;
    } else {
      //@ts-ignore
      const emailParams = delivery.delivery_params;
      const {
        recipients,
        title,
        textDescription
      } = emailParams;
      const recipientsOptions = recipients.map(email => ({
        label: email
      }));
      handleSelectEmailRecipients(recipientsOptions);
      setEmailRecipients(recipientsOptions);
      setEmailSubject(title);
      reportDefinitionRequest.delivery.delivery_params.title = title;
      handleEmailBody(textDescription);
    }
  };

  const defaultCreateDeliveryParams = () => {
    reportDefinitionRequest.delivery.delivery_params = {
      recipients: selectedEmailRecipients.map(option => option.label),
      title: emailSubject,
      textDescription: emailBody,
      htmlDescription: _utils__WEBPACK_IMPORTED_MODULE_3__["converter"].makeHtml(emailBody)
    };
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    if (edit) {
      httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
        defaultEditDeliveryParams(response.report_definition.delivery);
      });
    } else {
      defaultCreateDeliveryParams();
    }
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: "Email recipients",
    helpText: "Select or add users",
    isInvalid: showEmailRecipientsError,
    error: emailRecipientsErrorMessage
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiComboBox"], {
    placeholder: 'Add users here',
    options: emailRecipients,
    selectedOptions: selectedEmailRecipients,
    onChange: handleSelectEmailRecipients,
    onCreateOption: handleCreateEmailRecipient,
    isClearable: true,
    "data-test-subj": "demoComboBox"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: "Email subject"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFieldText"], {
    placeholder: "Subject line",
    value: emailSubject,
    onChange: handleEmailSubject
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: optionalMessageLabel,
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_mde__WEBPACK_IMPORTED_MODULE_2___default.a, {
    value: emailBody,
    onChange: handleEmailBody,
    selectedTab: selectedTab,
    onTabChange: setSelectedTab,
    toolbarCommands: [['header', 'bold', 'italic', 'strikethrough'], ['unordered-list', 'ordered-list', 'checked-list']],
    generateMarkdownPreview: markdown => Promise.resolve(_utils__WEBPACK_IMPORTED_MODULE_3__["converter"].makeHtml(markdown))
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "xs"
  }));
};

/***/ }),

/***/ "./public/components/report_definitions/delivery/index.ts":
/*!****************************************************************!*\
  !*** ./public/components/report_definitions/delivery/index.ts ***!
  \****************************************************************/
/*! exports provided: ReportDelivery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _delivery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./delivery */ "./public/components/report_definitions/delivery/delivery.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReportDelivery", function() { return _delivery__WEBPACK_IMPORTED_MODULE_0__["ReportDelivery"]; });

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


/***/ }),

/***/ "./public/components/report_definitions/edit/edit_report_definition.tsx":
/*!******************************************************************************!*\
  !*** ./public/components/report_definitions/edit/edit_report_definition.tsx ***!
  \******************************************************************************/
/*! exports provided: EditReportDefinition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditReportDefinition", function() { return EditReportDefinition; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _report_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../report_settings */ "./public/components/report_definitions/report_settings/index.ts");
/* harmony import */ var _delivery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../delivery */ "./public/components/report_definitions/delivery/index.ts");
/* harmony import */ var _report_trigger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../report_trigger */ "./public/components/report_definitions/report_trigger/index.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./public/components/report_definitions/utils/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/utils */ "./public/components/utils/utils.tsx");
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







function EditReportDefinition(props) {
  const [toasts, setToasts] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [comingFromError, setComingFromError] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [preErrorData, setPreErrorData] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});

  const addPermissionsMissingViewEditPageToastHandler = errorType => {
    let toast = {};

    if (errorType === 'permissions') {
      toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingActions"].VIEWING_EDIT_PAGE);
    } else if (errorType === 'API') {
      toast = {
        title: 'Error loading report definition values.',
        color: 'danger',
        iconType: 'alert',
        id: 'errorToast'
      };
    }

    setToasts(toasts.concat(toast));
  };

  const handleViewEditPageErrorToast = errorType => {
    addPermissionsMissingViewEditPageToastHandler(errorType);
  };

  const addInputValidationErrorToastHandler = () => {
    const errorToast = {
      title: 'One or more fields have an error. Please check and try again.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleInputValidationErrorToast = () => {
    addInputValidationErrorToastHandler();
  };

  const addErrorUpdatingReportDefinitionToastHandler = errorType => {
    let toast = {};

    if (errorType === 'permissions') {
      toast = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingToast"])(_utils_utils__WEBPACK_IMPORTED_MODULE_6__["permissionsMissingActions"].UPDATING_DEFINITION);
    } else if (errorType === 'API') {
      toast = {
        title: 'Error updating report definition.',
        color: 'danger',
        iconType: 'alert',
        id: 'errorToast'
      };
    }

    setToasts(toasts.concat(toast));
  };

  const handleErrorUpdatingReportDefinitionToast = errorType => {
    addErrorUpdatingReportDefinitionToastHandler(errorType);
  };

  const addErrorDeletingReportDefinitionToastHandler = () => {
    const errorToast = {
      title: 'Error deleting old scheduled report definition.',
      color: 'danger',
      iconType: 'alert',
      id: 'errorDeleteToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleErrorDeletingReportDefinitionToast = () => {
    addErrorDeletingReportDefinitionToastHandler();
  };

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const reportDefinitionId = props['match']['params']['reportDefinitionId'];
  let reportDefinition;
  let editReportDefinitionRequest = {
    report_params: {
      report_name: '',
      report_source: '',
      description: '',
      core_params: {
        base_url: '',
        report_format: '',
        time_duration: ''
      }
    },
    delivery: {
      delivery_type: '',
      delivery_params: {}
    },
    trigger: {
      trigger_type: ''
    },
    time_created: 0,
    last_updated: 0,
    status: ''
  };
  reportDefinition = editReportDefinitionRequest; // initialize reportDefinition object

  let timeRange = {
    timeFrom: new Date(),
    timeTo: new Date()
  };

  if (comingFromError) {
    editReportDefinitionRequest = preErrorData;
  }

  const callUpdateAPI = async metadata => {
    const {
      httpClient
    } = props;
    httpClient.put(`../api/reporting/reportDefinitions/${reportDefinitionId}`, {
      body: JSON.stringify(metadata),
      params: reportDefinitionId.toString()
    }).then(async () => {
      window.location.assign(`opendistro_kibana_reports#/edit=success`);
    }).catch(error => {
      console.log('error in updating report definition:', error);

      if (error.body.statusCode === 400) {
        handleInputValidationErrorToast();
      } else if (error.body.statusCode === 403) {
        handleErrorUpdatingReportDefinitionToast('permissions');
      } else {
        handleErrorUpdatingReportDefinitionToast('API');
      }

      setPreErrorData(metadata);
      setComingFromError(true);
    });
  };

  const editReportDefinition = async metadata => {
    const {
      httpClient
    } = props;

    if ('header' in metadata.report_params.core_params) {
      metadata.report_params.core_params.header = _utils__WEBPACK_IMPORTED_MODULE_5__["converter"].makeHtml(metadata.report_params.core_params.header);
    }

    if ('footer' in metadata.report_params.core_params) {
      metadata.report_params.core_params.footer = _utils__WEBPACK_IMPORTED_MODULE_5__["converter"].makeHtml(metadata.report_params.core_params.footer);
    }
    /*
      we check if this editing updates the trigger type from Schedule to On demand. 
      If so, need to first delete the reportDefinition along with the scheduled job first, by calling the delete
      report definition API
    */


    const {
      trigger: {
        trigger_type: triggerType
      }
    } = reportDefinition;

    if (triggerType !== 'On demand' && metadata.trigger.trigger_type === 'On demand') {
      httpClient.delete(`../api/reporting/reportDefinitions/${reportDefinitionId}`).then(async () => {
        await callUpdateAPI(metadata);
      }).catch(error => {
        console.log('error when deleting old scheduled report definition:', error);
        handleErrorDeletingReportDefinitionToast();
      });
    } else {
      await callUpdateAPI(metadata);
    }
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    window.scrollTo(0, 0);
    const {
      httpClient
    } = props;
    httpClient.get(`../api/reporting/reportDefinitions/${reportDefinitionId}`).then(response => {
      reportDefinition = response.report_definition;
      const {
        time_created: timeCreated,
        status,
        last_updated: lastUpdated,
        report_params: {
          report_name: reportName
        }
      } = reportDefinition; // configure non-editable fields

      editReportDefinitionRequest.time_created = timeCreated;
      editReportDefinitionRequest.last_updated = lastUpdated;
      editReportDefinitionRequest.status = status;
      props.setBreadcrumbs([{
        text: 'Reporting',
        href: '#'
      }, {
        text: `Report definition details: ${reportName}`,
        href: `#/report_definition_details/${reportDefinitionId}`
      }, {
        text: `Edit report definition: ${reportName}`
      }]);
    }).catch(error => {
      console.error('error when loading edit report definition page: ', error);

      if (error.body.statusCode === 403) {
        handleViewEditPageErrorToast('permissions');
      } else {
        handleViewEditPageErrorToast('API');
      }
    });
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Edit report definition")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_settings__WEBPACK_IMPORTED_MODULE_2__["ReportSettings"], {
    edit: true,
    editDefinitionId: reportDefinitionId,
    reportDefinitionRequest: editReportDefinitionRequest,
    httpClientProps: props['httpClient'],
    timeRange: timeRange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_trigger__WEBPACK_IMPORTED_MODULE_4__["ReportTrigger"], {
    edit: true,
    editDefinitionId: reportDefinitionId,
    reportDefinitionRequest: editReportDefinitionRequest,
    httpClientProps: props['httpClient'],
    timeRange: timeRange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_delivery__WEBPACK_IMPORTED_MODULE_3__["ReportDelivery"], {
    edit: true,
    editDefinitionId: reportDefinitionId,
    reportDefinitionRequest: editReportDefinitionRequest,
    httpClientProps: props['httpClient'],
    timeRange: timeRange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    justifyContent: "flexEnd"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonEmpty"], {
    onClick: () => {
      window.location.assign('opendistro_kibana_reports#/');
    }
  }, "Cancel")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    fill: true,
    onClick: () => editReportDefinition(editReportDefinitionRequest),
    id: 'editReportDefinitionButton'
  }, "Save Changes"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiGlobalToastList"], {
    toasts: toasts,
    dismissToast: removeToast,
    toastLifeTimeMs: 6000
  })));
}

/***/ }),

/***/ "./public/components/report_definitions/report_settings/index.ts":
/*!***********************************************************************!*\
  !*** ./public/components/report_definitions/report_settings/index.ts ***!
  \***********************************************************************/
/*! exports provided: ReportSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _report_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./report_settings */ "./public/components/report_definitions/report_settings/report_settings.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReportSettings", function() { return _report_settings__WEBPACK_IMPORTED_MODULE_0__["ReportSettings"]; });

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


/***/ }),

/***/ "./public/components/report_definitions/report_settings/report_settings.tsx":
/*!**********************************************************************************!*\
  !*** ./public/components/report_definitions/report_settings/report_settings.tsx ***!
  \**********************************************************************************/
/*! exports provided: ReportSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportSettings", function() { return ReportSettings; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report_settings_constants */ "./public/components/report_definitions/report_settings/report_settings_constants.tsx");
/* harmony import */ var react_mde__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-mde */ "./node_modules/react-mde/lib/js/index.js");
/* harmony import */ var react_mde__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_mde__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_mde_lib_styles_css_react_mde_all_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-mde/lib/styles/css/react-mde-all.css */ "./node_modules/react-mde/lib/styles/css/react-mde-all.css");
/* harmony import */ var react_mde_lib_styles_css_react_mde_all_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_mde_lib_styles_css_react_mde_all_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./report_settings_helpers */ "./public/components/report_definitions/report_settings/report_settings_helpers.tsx");
/* harmony import */ var _time_range__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./time_range */ "./public/components/report_definitions/report_settings/time_range.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils */ "./public/components/report_definitions/utils/index.ts");
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








function ReportSettings(props) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
    timeRange,
    showSettingsReportNameError,
    settingsReportNameErrorMessage,
    showTimeRangeError
  } = props;
  const [reportName, setReportName] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [reportDescription, setReportDescription] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [reportSourceId, setReportSourceId] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('dashboardReportSource');
  const [dashboardSourceSelect, setDashboardSourceSelect] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [dashboards, setDashboards] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [visualizationSourceSelect, setVisualizationSourceSelect] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [visualizations, setVisualizations] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [savedSearchSourceSelect, setSavedSearchSourceSelect] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [savedSearches, setSavedSearches] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [fileFormat, setFileFormat] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('pdf');

  const handleDashboards = e => {
    setDashboards(e);
  };

  const handleVisualizations = e => {
    setVisualizations(e);
  };

  const handleSavedSearches = e => {
    setSavedSearches(e);
  };

  const handleReportName = e => {
    setReportName(e.target.value);
    reportDefinitionRequest.report_params.report_name = e.target.value.toString();
  };

  const handleReportDescription = e => {
    setReportDescription(e.target.value);
    reportDefinitionRequest.report_params.description = e.target.value.toString();
  };

  const handleReportSource = e => {
    setReportSourceId(e);
    let fromInContext = false;

    if (window.location.href.includes('?')) {
      fromInContext = true;
    }

    if (e === 'dashboardReportSource') {
      reportDefinitionRequest.report_params.report_source = 'Dashboard';
      reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getDashboardBaseUrlCreate"])(edit, editDefinitionId, fromInContext) + dashboards[0].value; // set params to visual report params after switch from saved search

      Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["handleDataToVisualReportSourceChange"])(reportDefinitionRequest);
      setFileFormat('pdf');
    } else if (e === 'visualizationReportSource') {
      reportDefinitionRequest.report_params.report_source = 'Visualization';
      reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getVisualizationBaseUrlCreate"])(edit, editDefinitionId, fromInContext) + visualizations[0].value; // set params to visual report params after switch from saved search

      Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["handleDataToVisualReportSourceChange"])(reportDefinitionRequest);
      setFileFormat('pdf');
    } else if (e === 'savedSearchReportSource') {
      reportDefinitionRequest.report_params.report_source = 'Saved search';
      reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getSavedSearchBaseUrlCreate"])(edit, editDefinitionId, fromInContext) + savedSearches[0].value;
      reportDefinitionRequest.report_params.core_params.saved_search_id = savedSearches[0].value;
      reportDefinitionRequest.report_params.core_params.report_format = 'csv';
      reportDefinitionRequest.report_params.core_params.limit = 10000;
      reportDefinitionRequest.report_params.core_params.excel = true;
    }
  };

  const handleDashboardSelect = e => {
    setDashboardSourceSelect(e.target.value);
    let fromInContext = false;

    if (window.location.href.includes('?')) {
      fromInContext = true;
    }

    reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getDashboardBaseUrlCreate"])(edit, editDefinitionId, fromInContext) + e.target.value;
  };

  const handleVisualizationSelect = e => {
    setVisualizationSourceSelect(e.target.value);
    let fromInContext = false;

    if (window.location.href.includes('?')) {
      fromInContext = true;
    }

    reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getVisualizationBaseUrlCreate"])(edit, editDefinitionId, fromInContext) + e.target.value;
  };

  const handleSavedSearchSelect = e => {
    setSavedSearchSourceSelect(e.target.value);
    reportDefinitionRequest.report_params.core_params.saved_search_id = e.target.value;
    let fromInContext = false;

    if (window.location.href.includes('?')) {
      fromInContext = true;
    }

    reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getSavedSearchBaseUrlCreate"])(edit, editDefinitionId, fromInContext) + e.target.value;
  };

  const handleFileFormat = e => {
    setFileFormat(e);
    reportDefinitionRequest.report_params.core_params.report_format = e.toString();
  };

  const PDFandPNGFileFormats = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "File format"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiRadioGroup"], {
      options: _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["PDF_PNG_FILE_FORMAT_OPTIONS"],
      idSelected: fileFormat,
      onChange: handleFileFormat
    })));
  };

  const SettingsMarkdown = () => {
    const [checkboxIdSelectHeaderFooter, setCheckboxIdSelectHeaderFooter] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
      ['header']: false,
      ['footer']: false
    });
    const [footer, setFooter] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
    const [selectedTabFooter, setSelectedTabFooter] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState('write');
    const [header, setHeader] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
    const [selectedTabHeader, setSelectedTabHeader] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState('write');

    const handleHeader = e => {
      setHeader(e);
      reportDefinitionRequest.report_params.core_params.header = e;
    };

    const handleFooter = e => {
      setFooter(e);
      reportDefinitionRequest.report_params.core_params.footer = e;
    };

    const handleCheckboxHeaderFooter = optionId => {
      const newCheckboxIdToSelectedMap = { ...checkboxIdSelectHeaderFooter,
        ...{
          [optionId]: !checkboxIdSelectHeaderFooter[optionId]
        }
      };
      setCheckboxIdSelectHeaderFooter(newCheckboxIdToSelectedMap);
    };

    const showFooter = checkboxIdSelectHeaderFooter.footer ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Footer",
      fullWidth: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_mde__WEBPACK_IMPORTED_MODULE_3___default.a, {
      value: footer,
      onChange: handleFooter,
      selectedTab: selectedTabFooter,
      onTabChange: setSelectedTabFooter,
      toolbarCommands: [['header', 'bold', 'italic', 'strikethrough'], ['unordered-list', 'ordered-list', 'checked-list']],
      generateMarkdownPreview: markdown => Promise.resolve(_utils__WEBPACK_IMPORTED_MODULE_7__["converter"].makeHtml(markdown))
    })) : null;
    const showHeader = checkboxIdSelectHeaderFooter.header ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Header",
      fullWidth: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_mde__WEBPACK_IMPORTED_MODULE_3___default.a, {
      value: header,
      onChange: handleHeader,
      selectedTab: selectedTabHeader,
      onTabChange: setSelectedTabHeader,
      toolbarCommands: [['header', 'bold', 'italic', 'strikethrough'], ['unordered-list', 'ordered-list', 'checked-list']],
      generateMarkdownPreview: markdown => Promise.resolve(_utils__WEBPACK_IMPORTED_MODULE_7__["converter"].makeHtml(markdown))
    })) : null;
    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      let unmounted = false;

      if (edit) {
        httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
          const reportDefinition = response.report_definition;
          const {
            report_params: {
              core_params: {
                header,
                footer
              }
            }
          } = reportDefinition; // set header/footer default

          if (header) {
            checkboxIdSelectHeaderFooter.header = true;

            if (!unmounted) {
              setHeader(_utils__WEBPACK_IMPORTED_MODULE_7__["converter"].makeMarkdown(header));
            }
          }

          if (footer) {
            checkboxIdSelectHeaderFooter.footer = true;

            if (!unmounted) {
              setFooter(_utils__WEBPACK_IMPORTED_MODULE_7__["converter"].makeMarkdown(footer));
            }
          }
        }).catch(error => {
          console.error('error in fetching report definition details:', error);
        });
      } else {
        // keeps header/footer from re-rendering empty when other fields in Report Settings are changed
        checkboxIdSelectHeaderFooter.header = 'header' in reportDefinitionRequest.report_params.core_params;
        checkboxIdSelectHeaderFooter.footer = 'footer' in reportDefinitionRequest.report_params.core_params;

        if (checkboxIdSelectHeaderFooter.header) {
          setHeader(reportDefinitionRequest.report_params.core_params.header);
        }

        if (checkboxIdSelectHeaderFooter.footer) {
          setFooter(reportDefinitionRequest.report_params.core_params.footer);
        }
      }

      return () => {
        unmounted = true;
      };
    }, []);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiCheckboxGroup"], {
      options: _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["HEADER_FOOTER_CHECKBOX"],
      idToSelectedMap: checkboxIdSelectHeaderFooter,
      onChange: handleCheckboxHeaderFooter,
      legend: {
        children: 'Header and footer'
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), showHeader, showFooter);
  };

  const ReportSourceDashboard = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Select dashboard"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
      id: "reportSourceDashboardSelect",
      options: dashboards,
      value: dashboardSourceSelect,
      onChange: handleDashboardSelect
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const ReportSourceVisualization = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Select visualization"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
      id: "reportSourceVisualizationSelect",
      options: visualizations,
      value: visualizationSourceSelect,
      onChange: handleVisualizationSelect
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const ReportSourceSavedSearch = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Select saved search"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
      id: "reportSourceSavedSearchSelect",
      options: savedSearches,
      value: savedSearchSourceSelect,
      onChange: handleSavedSearchSelect
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const VisualReportFormatAndMarkdown = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PDFandPNGFileFormats, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const setReportSourceDropdownOption = (options, reportSource, url) => {
    let index = 0;

    if (reportSource === _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_TYPES"].dashboard) {
      for (index = 0; index < options.dashboard.length; ++index) {
        if (url.includes(options.dashboard[index].value)) {
          setDashboardSourceSelect(options.dashboard[index].value);
        }
      }
    } else if (reportSource === _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_TYPES"].visualization) {
      for (index = 0; index < options.visualizations.length; ++index) {
        if (url.includes(options.visualizations[index].value)) {
          setVisualizationSourceSelect(options.visualizations[index].value);
        }
      }
    } else if (reportSource === _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_TYPES"].savedSearch) {
      for (index = 0; index < options.savedSearch.length; ++index) {
        if (url.includes(options.savedSearch[index].value)) {
          setSavedSearchSourceSelect(options.savedSearch[index].value);
        }
      }
    }
  };

  const setDefaultFileFormat = fileFormat => {
    let index = 0;

    for (index = 0; index < _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["PDF_PNG_FILE_FORMAT_OPTIONS"].length; ++index) {
      if (fileFormat.toUpperCase() === _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["PDF_PNG_FILE_FORMAT_OPTIONS"][index].label) {
        setFileFormat(_report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["PDF_PNG_FILE_FORMAT_OPTIONS"][index].id);
      }
    }
  };

  const setInContextDefaultConfiguration = () => {
    const url = window.location.href;
    const id = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["parseInContextUrl"])(url, 'id');

    if (url.includes('dashboard')) {
      setReportSourceId('dashboardReportSource');
      reportDefinitionRequest.report_params.report_source = _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_RADIOS"][0].label;
      setDashboardSourceSelect(id);
      reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getDashboardBaseUrlCreate"])(edit, id, true) + id;
    } else if (url.includes('visualize')) {
      setReportSourceId('visualizationReportSource');
      reportDefinitionRequest.report_params.report_source = _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_RADIOS"][1].label;
      setVisualizationSourceSelect(id);
      reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getVisualizationBaseUrlCreate"])(edit, editDefinitionId, true) + id;
    } else if (url.includes('discover')) {
      setReportSourceId('savedSearchReportSource');
      reportDefinitionRequest.report_params.core_params.report_format = 'csv';
      reportDefinitionRequest.report_params.core_params.saved_search_id = id;
      reportDefinitionRequest.report_params.report_source = _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_RADIOS"][2].label;
      setSavedSearchSourceSelect(id);
      reportDefinitionRequest.report_params.core_params.base_url = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getSavedSearchBaseUrlCreate"])(edit, editDefinitionId, true) + id;
    }
  };

  const setDefaultEditValues = async (response, reportSourceOptions) => {
    setReportName(response.report_definition.report_params.report_name);
    setReportDescription(response.report_definition.report_params.description);
    reportDefinitionRequest.report_params.report_name = response.report_definition.report_params.report_name;
    reportDefinitionRequest.report_params.description = response.report_definition.report_params.description;
    reportDefinitionRequest.report_params = response.report_definition.report_params;
    const reportSource = response.report_definition.report_params.report_source;
    _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_RADIOS"].map(radio => {
      if (radio.label === reportSource) {
        setReportSourceId(radio.id);
        reportDefinitionRequest.report_params.report_source = reportSource;
      }
    });
    setDefaultFileFormat(response.report_definition.report_params.core_params.report_format);
    setReportSourceDropdownOption(reportSourceOptions, reportSource, response.report_definition.report_params.core_params.base_url);
  };

  const defaultConfigurationEdit = async httpClientProps => {
    let editData = {};
    await httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
      editData = response;
    }).catch(error => {
      console.error('error in fetching report definition details:', error);
    });
    return editData;
  };

  const defaultConfigurationCreate = async httpClientProps => {
    let reportSourceOptions = {
      dashboard: [],
      visualizations: [],
      savedSearch: []
    };
    reportDefinitionRequest.report_params.core_params.report_format = fileFormat;
    await httpClientProps.get('../api/reporting/getReportSource/dashboard').then(async response => {
      let dashboardOptions = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getDashboardOptions"])(response['hits']['hits']);
      reportSourceOptions.dashboard = dashboardOptions;
      handleDashboards(dashboardOptions);

      if (!edit) {
        setDashboardSourceSelect(dashboardOptions[0].value);
        reportDefinitionRequest.report_params.report_source = 'Dashboard';
        reportDefinitionRequest['report_params']['core_params']['base_url'] = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getDashboardBaseUrlCreate"])(edit, editDefinitionId, false) + response['hits']['hits'][0]['_id'].substring(10);
      }
    }).catch(error => {
      console.log('error when fetching dashboards:', error);
    });
    await httpClientProps.get('../api/reporting/getReportSource/visualization').then(async response => {
      let visualizationOptions = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getVisualizationOptions"])(response['hits']['hits']);
      reportSourceOptions.visualizations = visualizationOptions;
      await handleVisualizations(visualizationOptions);
      await setVisualizationSourceSelect(visualizationOptions[0].value);
    }).catch(error => {
      console.log('error when fetching visualizations:', error);
    });
    await httpClientProps.get('../api/reporting/getReportSource/search').then(async response => {
      let savedSearchOptions = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_5__["getSavedSearchOptions"])(response['hits']['hits']);
      reportSourceOptions.savedSearch = savedSearchOptions;
      await handleSavedSearches(savedSearchOptions);
      await setSavedSearchSourceSelect(savedSearchOptions[0].value);
    }).catch(error => {
      console.log('error when fetching saved searches:', error);
    });
    return reportSourceOptions;
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    let reportSourceOptions = {};
    let editData = {};

    if (edit) {
      defaultConfigurationEdit(httpClientProps).then(async response => {
        editData = response;
      });
    }

    defaultConfigurationCreate(httpClientProps).then(async response => {
      reportSourceOptions = response; // if coming from in-context menu

      if (window.location.href.indexOf('?') > -1) {
        setInContextDefaultConfiguration();
      }

      if (edit) {
        setDefaultEditValues(editData, reportSourceOptions);
      }
    });
  }, []);
  const displayDashboardSelect = reportSourceId === 'dashboardReportSource' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportSourceDashboard, null) : null;
  const displayVisualizationSelect = reportSourceId === 'visualizationReportSource' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportSourceVisualization, null) : null;
  const displaySavedSearchSelect = reportSourceId === 'savedSearchReportSource' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ReportSourceSavedSearch, null) : null;
  const displayVisualReportsFormatAndMarkdown = reportSourceId != 'savedSearchReportSource' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VisualReportFormatAndMarkdown, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SettingsMarkdown, null)) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "File format"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "CSV"))));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContent"], {
    panelPaddingSize: 'l'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Report Settings"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHorizontalRule"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContentBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Name",
    helpText: "Valid characters are a-z, A-Z, 0-9, (), [], _ (underscore), - (hyphen) and (space).",
    isInvalid: showSettingsReportNameError,
    error: settingsReportNameErrorMessage,
    id: 'reportSettingsName'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"], {
    placeholder: "Report name (e.g Log Traffic Daily Report)",
    value: reportName,
    onChange: handleReportName
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    style: {
      maxWidth: 600
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Description (optional)",
    id: 'reportSettingsDescription'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTextArea"], {
    placeholder: "Describe this report (e.g Morning daily reports for log traffic)",
    value: reportDescription,
    onChange: handleReportDescription
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Report source"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiRadioGroup"], {
    options: _report_settings_constants__WEBPACK_IMPORTED_MODULE_2__["REPORT_SOURCE_RADIOS"],
    idSelected: reportSourceId,
    onChange: handleReportSource
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), displayDashboardSelect, displayVisualizationSelect, displaySavedSearchSelect, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_time_range__WEBPACK_IMPORTED_MODULE_6__["TimeRangeSelect"], {
    timeRange: timeRange,
    reportDefinitionRequest: reportDefinitionRequest,
    edit: edit,
    id: editDefinitionId,
    httpClientProps: httpClientProps,
    showTimeRangeError: showTimeRangeError
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), displayVisualReportsFormatAndMarkdown, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null)));
}

/***/ }),

/***/ "./public/components/report_definitions/report_settings/report_settings_constants.tsx":
/*!********************************************************************************************!*\
  !*** ./public/components/report_definitions/report_settings/report_settings_constants.tsx ***!
  \********************************************************************************************/
/*! exports provided: REPORT_SOURCE_RADIOS, PDF_PNG_FILE_FORMAT_OPTIONS, SAVED_SEARCH_FORMAT_OPTIONS, HEADER_FOOTER_CHECKBOX, REPORT_SOURCE_TYPES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REPORT_SOURCE_RADIOS", function() { return REPORT_SOURCE_RADIOS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PDF_PNG_FILE_FORMAT_OPTIONS", function() { return PDF_PNG_FILE_FORMAT_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SAVED_SEARCH_FORMAT_OPTIONS", function() { return SAVED_SEARCH_FORMAT_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEADER_FOOTER_CHECKBOX", function() { return HEADER_FOOTER_CHECKBOX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REPORT_SOURCE_TYPES", function() { return REPORT_SOURCE_TYPES; });
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
const REPORT_SOURCE_RADIOS = [{
  id: 'dashboardReportSource',
  label: 'Dashboard'
}, {
  id: 'visualizationReportSource',
  label: 'Visualization'
}, {
  id: 'savedSearchReportSource',
  label: 'Saved search'
}];
const PDF_PNG_FILE_FORMAT_OPTIONS = [{
  id: 'pdf',
  label: 'PDF'
}, {
  id: 'png',
  label: 'PNG'
}];
const SAVED_SEARCH_FORMAT_OPTIONS = [{
  id: 'csvFormat',
  label: 'CSV'
}, {
  id: 'xlsFormat',
  label: 'XLS'
}];
const HEADER_FOOTER_CHECKBOX = [{
  id: 'header',
  label: 'Add header'
}, {
  id: 'footer',
  label: 'Add footer'
}];
const REPORT_SOURCE_TYPES = {
  dashboard: 'Dashboard',
  visualization: 'Visualization',
  savedSearch: 'Saved search'
};

/***/ }),

/***/ "./public/components/report_definitions/report_settings/report_settings_helpers.tsx":
/*!******************************************************************************************!*\
  !*** ./public/components/report_definitions/report_settings/report_settings_helpers.tsx ***!
  \******************************************************************************************/
/*! exports provided: parseInContextUrl, getDashboardBaseUrlCreate, getVisualizationBaseUrlCreate, getSavedSearchBaseUrlCreate, getDashboardOptions, getVisualizationOptions, getSavedSearchOptions, handleDataToVisualReportSourceChange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseInContextUrl", function() { return parseInContextUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDashboardBaseUrlCreate", function() { return getDashboardBaseUrlCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVisualizationBaseUrlCreate", function() { return getVisualizationBaseUrlCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSavedSearchBaseUrlCreate", function() { return getSavedSearchBaseUrlCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDashboardOptions", function() { return getDashboardOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVisualizationOptions", function() { return getVisualizationOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSavedSearchOptions", function() { return getSavedSearchOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleDataToVisualReportSourceChange", function() { return handleDataToVisualReportSourceChange; });
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
const parseInContextUrl = (url, parameter) => {
  const info = url.split('?');

  if (parameter === 'id') {
    return info[1].substring(info[1].indexOf(':') + 1, info[1].length);
  } else if (parameter === 'timeFrom') {
    return info[2].substring(info[2].indexOf('=') + 1, info[2].length);
  } else if (parameter === 'timeTo') {
    return info[3].substring(info[3].indexOf('=') + 1, info[3].length);
  }

  return 'error: invalid parameter';
};
const getDashboardBaseUrlCreate = (edit, editDefinitionId, fromInContext) => {
  let baseUrl;

  if (!fromInContext) {
    baseUrl = location.pathname + location.hash;
  } else {
    baseUrl = '/app/dashboards#/view/';
  }

  if (edit) {
    return baseUrl.replace(`opendistro_kibana_reports#/edit/${editDefinitionId}`, 'dashboards#/view/');
  } else if (fromInContext) {
    return baseUrl;
  }

  return baseUrl.replace('opendistro_kibana_reports#/create', 'dashboards#/view/');
};
const getVisualizationBaseUrlCreate = (edit, editDefinitionId, fromInContext) => {
  let baseUrl;

  if (!fromInContext) {
    baseUrl = location.pathname + location.hash;
  } else {
    baseUrl = '/app/visualize#/edit/';
  }

  if (edit) {
    return baseUrl.replace(`opendistro_kibana_reports#/edit/${editDefinitionId}`, 'visualize#/edit/');
  } else if (fromInContext) {
    return baseUrl;
  }

  return baseUrl.replace('opendistro_kibana_reports#/create', 'visualize#/edit/');
};
const getSavedSearchBaseUrlCreate = (edit, editDefinitionId, fromInContext) => {
  let baseUrl;

  if (!fromInContext) {
    baseUrl = location.pathname + location.hash;
  } else {
    baseUrl = '/app/discover#/view/';
  }

  if (edit) {
    return baseUrl.replace(`opendistro_kibana_reports#/edit/${editDefinitionId}`, 'discover#/view/');
  } else if (fromInContext) {
    return baseUrl;
  }

  return baseUrl.replace('opendistro_kibana_reports#/create', 'discover#/view/');
};
const getDashboardOptions = data => {
  let index;
  let dashboard_options = [];

  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: data[index]['_id'].substring(10),
      text: data[index]['_source']['dashboard']['title']
    };
    dashboard_options.push(entry);
  }

  return dashboard_options;
};
const getVisualizationOptions = data => {
  let index;
  let options = [];

  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: data[index]['_id'].substring(14),
      text: data[index]['_source']['visualization']['title']
    };
    options.push(entry);
  }

  return options;
};
const getSavedSearchOptions = data => {
  let index;
  let options = [];

  for (index = 0; index < data.length; ++index) {
    let entry = {
      value: data[index]['_id'].substring(7),
      text: data[index]['_source']['search']['title']
    };
    options.push(entry);
  }

  return options;
};
const handleDataToVisualReportSourceChange = reportDefinitionRequest => {
  delete reportDefinitionRequest.report_params.core_params.saved_search_id;
  delete reportDefinitionRequest.report_params.core_params.limit;
  delete reportDefinitionRequest.report_params.core_params.excel;
  reportDefinitionRequest.report_params.core_params.report_format = 'pdf';
};

/***/ }),

/***/ "./public/components/report_definitions/report_settings/time_range.tsx":
/*!*****************************************************************************!*\
  !*** ./public/components/report_definitions/report_settings/time_range.tsx ***!
  \*****************************************************************************/
/*! exports provided: TimeRangeSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeRangeSelect", function() { return TimeRangeSelect; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _report_settings_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report_settings_helpers */ "./public/components/report_definitions/report_settings/report_settings_helpers.tsx");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/datemath */ "../../packages/elastic-datemath/target/index.js");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_datemath__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__);
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





function TimeRangeSelect(props) {
  const {
    reportDefinitionRequest,
    timeRange,
    edit,
    id,
    httpClientProps,
    showTimeRangeError
  } = props;
  const [recentlyUsedRanges, setRecentlyUsedRanges] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [isLoading, setIsLoading] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
  const [start, setStart] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('now-30m');
  const [end, setEnd] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('now');
  const [toasts, setToasts] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);

  const addInvalidTimeRangeToastHandler = () => {
    const errorToast = {
      title: 'Invalid time range selected',
      color: 'danger',
      iconType: 'alert',
      id: 'timeRangeErrorToast'
    };
    setToasts(toasts.concat(errorToast));
  };

  const handleInvalidTimeRangeToast = () => {
    addInvalidTimeRangeToastHandler();
  };

  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const isValidTimeRange = (timeRangeMoment, limit, handleInvalidTimeRangeToast) => {
    if (limit === 'start') {
      if (!timeRangeMoment || !timeRangeMoment.isValid()) {
        handleInvalidTimeRangeToast();
      }
    } else if (limit === 'end') {
      if (!timeRangeMoment || !timeRangeMoment.isValid() || timeRangeMoment > moment__WEBPACK_IMPORTED_MODULE_0___default()()) {
        handleInvalidTimeRangeToast();
      }
    }
  };

  const setDefaultEditTimeRange = (duration, unmounted) => {
    let time_difference = moment__WEBPACK_IMPORTED_MODULE_0___default.a.now() - duration;
    const fromDate = new Date(time_difference);
    parseTimeRange(fromDate, end, reportDefinitionRequest);

    if (!unmounted) {
      setStart(fromDate.toISOString());
      setEnd(end);
    }
  }; // valid time range check for absolute time end date


  const checkValidAbsoluteEndDate = end => {
    let endDate = new Date(end);
    let nowDate = new Date(moment__WEBPACK_IMPORTED_MODULE_0___default.a.now());
    let valid = true;

    if (endDate.getTime() > nowDate.getTime()) {
      end = 'now';
      valid = false;
    }

    return valid;
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    let unmounted = false; // if we are coming from the in-context menu

    if (window.location.href.indexOf('?') > -1) {
      const url = window.location.href;
      const timeFrom = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_2__["parseInContextUrl"])(url, 'timeFrom');
      const timeTo = Object(_report_settings_helpers__WEBPACK_IMPORTED_MODULE_2__["parseInContextUrl"])(url, 'timeTo');
      parseTimeRange(timeFrom, timeTo, reportDefinitionRequest);

      if (!unmounted) {
        setStart(timeFrom);
        setEnd(timeTo);
      }
    } else {
      if (edit) {
        httpClientProps.get(`../api/reporting/reportDefinitions/${id}`).then(async response => {
          let duration = response.report_definition.report_params.core_params.time_duration;
          duration = moment__WEBPACK_IMPORTED_MODULE_0___default.a.duration(duration);
          setDefaultEditTimeRange(duration, unmounted);
        }).catch(error => {
          console.error('error in fetching report definition details:', error);
        });
      } else {
        parseTimeRange(start, end, reportDefinitionRequest);
      }
    }

    return () => {
      unmounted = true;
    };
  }, []);

  const onTimeChange = ({
    start,
    end
  }) => {
    isValidTimeRange(_elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(start), 'start', handleInvalidTimeRangeToast);
    isValidTimeRange(_elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(end, {
      roundUp: true
    }), 'end', handleInvalidTimeRangeToast);
    const recentlyUsedRange = recentlyUsedRanges.filter(recentlyUsedRange => {
      const isDuplicate = recentlyUsedRange.start === start && recentlyUsedRange.end === end;
      return !isDuplicate;
    });
    const validEndDate = checkValidAbsoluteEndDate(end);

    if (!validEndDate) {
      handleInvalidTimeRangeToast();
      return;
    }

    recentlyUsedRange.unshift({
      start,
      end
    });
    setStart(start);
    setEnd(end);
    setRecentlyUsedRanges(recentlyUsedRange.length > 10 ? recentlyUsedRange.slice(0, 9) : recentlyUsedRange);
    setIsLoading(true);
    startLoading();
    parseTimeRange(start, end, reportDefinitionRequest);
  };

  const parseTimeRange = (start, end, reportDefinitionRequest) => {
    timeRange.timeFrom = _elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(start);
    timeRange.timeTo = _elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(end);
    const timeDuration = moment__WEBPACK_IMPORTED_MODULE_0___default.a.duration(_elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(end).diff(_elastic_datemath__WEBPACK_IMPORTED_MODULE_3___default.a.parse(start)));
    reportDefinitionRequest.report_params.core_params.time_duration = timeDuration.toISOString();
  };

  const startLoading = () => {
    setTimeout(stopLoading, 1000);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiFormRow"], {
    label: "Time range",
    helpText: "Time range is relative to the report creation date on the report trigger.",
    isInvalid: showTimeRangeError,
    error: 'Invalid time range selected.'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiSuperDatePicker"], {
    isDisabled: false,
    isLoading: isLoading,
    start: start,
    end: end,
    onTimeChange: onTimeChange,
    showUpdateButton: false
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_4__["EuiGlobalToastList"], {
    toasts: toasts,
    dismissToast: removeToast,
    toastLifeTimeMs: 6000
  })));
}

/***/ }),

/***/ "./public/components/report_definitions/report_trigger/index.ts":
/*!**********************************************************************!*\
  !*** ./public/components/report_definitions/report_trigger/index.ts ***!
  \**********************************************************************/
/*! exports provided: ReportTrigger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _report_trigger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./report_trigger */ "./public/components/report_definitions/report_trigger/report_trigger.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReportTrigger", function() { return _report_trigger__WEBPACK_IMPORTED_MODULE_0__["ReportTrigger"]; });

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


/***/ }),

/***/ "./public/components/report_definitions/report_trigger/report_trigger.tsx":
/*!********************************************************************************!*\
  !*** ./public/components/report_definitions/report_trigger/report_trigger.tsx ***!
  \********************************************************************************/
/*! exports provided: ReportTrigger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportTrigger", function() { return ReportTrigger; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./report_trigger_constants */ "./public/components/report_definitions/report_trigger/report_trigger_constants.tsx");
/* harmony import */ var _timezone__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./timezone */ "./public/components/report_definitions/report_trigger/timezone.tsx");
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





function ReportTrigger(props) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
    showTriggerIntervalNaNError,
    showCronError
  } = props;
  const [reportTriggerType, setReportTriggerType] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE_OPTIONS"][0].id);
  const [scheduleType, setScheduleType] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].label); //TODO: should read local timezone and display

  const [scheduleRecurringFrequency, setScheduleRecurringFrequency] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('daily');
  const [recurring, setRecurringTime] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(moment__WEBPACK_IMPORTED_MODULE_2___default()());
  const [weeklyCheckbox, setWeeklyCheckbox] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    ['monCheckbox']: true
  });
  const [monthlySelect, setMonthlySelect] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["MONTHLY_ON_THE_OPTIONS"][0].value);

  const handleReportTriggerType = e => {
    setReportTriggerType(e);
    reportDefinitionRequest.trigger.trigger_type = e;

    if (e === 'On demand') {
      delete reportDefinitionRequest.trigger.trigger_params;
    }
  };

  const handleScheduleType = e => {
    setScheduleType(e);

    if (e === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][1].label) {
      delete reportDefinitionRequest.trigger.trigger_params.schedule.interval;
    } else if (e === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].label) {
      delete reportDefinitionRequest.trigger.trigger_params.schedule.cron;
    }
  };

  const handleScheduleRecurringFrequency = e => {
    setScheduleRecurringFrequency(e.target.value);
    reportDefinitionRequest.trigger.trigger_params.schedule_type = e.target.value;
  };

  const handleRecurringTime = e => {
    setRecurringTime(e);
  };

  const handleWeeklyCheckbox = e => {
    const newCheckboxIdToSelectedMap = { ...weeklyCheckbox,
      ...{
        [e]: !weeklyCheckbox[e]
      }
    };
    setWeeklyCheckbox(newCheckboxIdToSelectedMap);
  };

  const handleMonthlySelect = e => {
    setMonthlySelect(e.target.value);
  };

  const RequestTime = () => {
    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      let recurringDaily = {
        interval: {
          period: 1,
          unit: 'DAYS',
          start_time: recurring.valueOf()
        }
      };
      reportDefinitionRequest.trigger.trigger_params = { ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: recurring.valueOf(),
        schedule: recurringDaily
      };
    }, []);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Request time"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDatePicker"], {
      showTimeSelect: true,
      showTimeSelectOnly: true,
      selected: recurring,
      onChange: handleRecurringTime,
      dateFormat: "HH:mm",
      timeFormat: "HH:mm"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const RecurringDaily = () => {
    const [recurringDailyTime, setRecurringDailyTime] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(moment__WEBPACK_IMPORTED_MODULE_2___default()());

    const handleRecurringDailyTime = e => {
      setRecurringDailyTime(e);
      reportDefinitionRequest.trigger.trigger_params.schedule.interval.start_time = e.valueOf();
    };

    const setDailyParams = () => {
      let recurringDaily = {
        interval: {
          period: 1,
          unit: 'DAYS',
          start_time: recurringDailyTime.valueOf()
        }
      };
      reportDefinitionRequest.trigger.trigger_params = { ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: recurringDailyTime.valueOf(),
        schedule: recurringDaily
      };
    };

    const isDailySchedule = response => {
      return response.report_definition.trigger.trigger_params.schedule_type === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].id && response.report_definition.trigger.trigger_params.schedule.interval.period === 1 && response.report_definition.trigger.trigger_params.schedule.interval === 'DAYS';
    };

    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      let unmounted = false;

      if (edit) {
        httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
          // if switching from on demand to schedule
          if (response.report_definition.trigger.trigger_type === 'On demand') {
            setDailyParams();
          } else if (isDailySchedule(response)) {
            const date = moment__WEBPACK_IMPORTED_MODULE_2___default()(response.report_definition.trigger.trigger_params.schedule.interval.start_time);

            if (!unmounted) {
              setRecurringDailyTime(date);
            }
          } // if switching from on-demand to schedule
          else if (reportDefinitionRequest.trigger.trigger_params.schedule_type === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].id) {
              setDailyParams();
            }
        });
      } else {
        setDailyParams();
      }

      return () => {
        unmounted = true;
      };
    }, []);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Request time"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDatePicker"], {
      showTimeSelect: true,
      showTimeSelectOnly: true,
      selected: recurringDailyTime,
      onChange: handleRecurringDailyTime,
      dateFormat: "HH:mm",
      timeFormat: "HH:mm"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const RecurringInterval = () => {
    const [intervalText, setIntervalText] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
    const [intervalTimePeriod, setIntervalTimePeriod] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["INTERVAL_TIME_PERIODS"][0].value);
    const [recurringIntervalTime, setRecurringIntervalTime] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(moment__WEBPACK_IMPORTED_MODULE_2___default()());

    const handleRecurringIntervalTime = e => {
      setRecurringIntervalTime(e);
      reportDefinitionRequest.trigger.trigger_params.schedule.interval.start_time = e.valueOf();
    };

    const handleIntervalText = e => {
      setIntervalText(e.target.value);
    };

    const handleIntervalTimePeriod = e => {
      setIntervalTimePeriod(e.target.value);
    };

    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      let interval = {
        interval: {
          period: parseInt(intervalText, 10),
          unit: intervalTimePeriod,
          start_time: recurringIntervalTime.valueOf()
        }
      };
      reportDefinitionRequest.trigger.trigger_params = { ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: recurringIntervalTime.valueOf(),
        schedule: interval
      };
    }, [intervalTimePeriod, intervalText]); // second useEffect() only to be triggered before render when on Edit

    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      let unmounted = false;

      if (edit) {
        httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
          if (response.report_definition.trigger.trigger_params.schedule_type === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].id) {
            const date = moment__WEBPACK_IMPORTED_MODULE_2___default()(response.report_definition.trigger.trigger_params.schedule.interval.start_time);

            if (!unmounted) {
              setRecurringIntervalTime(date);
              setIntervalText(response.report_definition.trigger.trigger_params.schedule.interval.period.toString());
              setIntervalTimePeriod(response.report_definition.trigger.trigger_params.schedule.interval.unit);
            }
          }
        });
      }

      return () => {
        unmounted = true;
      };
    }, []);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Every",
      isInvalid: showTriggerIntervalNaNError,
      error: 'Interval must be a number.'
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"], {
      placeholder: "Must be a number",
      value: intervalText,
      onChange: handleIntervalText
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
      id: "intervalTimeUnit",
      options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["INTERVAL_TIME_PERIODS"],
      value: intervalTimePeriod,
      onChange: handleIntervalTimePeriod
    }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Start time"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDatePicker"], {
      showTimeSelect: true,
      showTimeSelectOnly: true,
      selected: recurringIntervalTime,
      onChange: handleRecurringIntervalTime,
      dateFormat: "HH:mm",
      timeFormat: "HH:mm"
    })));
  };

  const RecurringWeekly = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Every"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiCheckboxGroup"], {
      options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["WEEKLY_CHECKBOX_OPTIONS"],
      idToSelectedMap: weeklyCheckbox,
      onChange: handleWeeklyCheckbox
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RequestTime, null));
  };

  const RecurringMonthly = () => {
    const [monthlyDayNumber, setMonthlyDayNumber] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');

    const handleMonthlyDayNumber = e => {
      setMonthlyDayNumber(e.target.value);
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "On the"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
      id: "monthlySelect",
      options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["MONTHLY_ON_THE_OPTIONS"],
      value: monthlySelect,
      onChange: handleMonthlySelect
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldNumber"], {
      placeholder: 'Day of month',
      value: monthlyDayNumber,
      onChange: handleMonthlyDayNumber
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
      size: "s"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RequestTime, null));
  };

  const CronExpression = () => {
    const [cronExpression, setCronExpression] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');

    const handleCronExpression = e => {
      setCronExpression(e.target.value);
      reportDefinitionRequest.trigger.trigger_params.schedule.cron.expression = e.target.value;
    };

    const setCronParams = () => {
      let cron = {
        cron: {
          expression: '',
          timezone: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TIMEZONE_OPTIONS"][0].value
        }
      };
      reportDefinitionRequest.trigger.trigger_params = { ...reportDefinitionRequest.trigger.trigger_params,
        enabled_time: Date.now().valueOf(),
        schedule: cron
      };
    };

    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      if (edit) {
        httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
          // if switching from on demand to schedule
          if (response.report_definition.trigger.trigger_type === 'On demand') {
            setCronParams();
          } else if (response.report_definition.trigger.trigger_params.schedule_type === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][1].id) {
            setCronExpression(response.report_definition.trigger.trigger_params.schedule.cron.expression);
          } else {
            setCronParams();
          }
        });
      } else {
        setCronParams();
      }
    }, []);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Custom cron expression",
      isInvalid: showCronError,
      error: 'Invalid cron expression.',
      labelAppend: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
        size: "xs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiLink"], {
        href: "https://opendistro.github.io/for-elasticsearch-docs/docs/alerting/cron/"
      }, "Cron help"))
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"], {
      placeholder: 'Ex: 0 12 * * * (Fire at 12:00 PM (noon) every day)',
      value: cronExpression,
      onChange: handleCronExpression
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null));
  };

  const ScheduleTriggerRecurring = () => {
    const display_daily = scheduleRecurringFrequency === 'daily' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RecurringDaily, null) : null;
    const display_interval = scheduleRecurringFrequency === 'byInterval' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RecurringInterval, null) : null;
    const display_weekly = scheduleRecurringFrequency === 'weekly' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RecurringWeekly, null) : null;
    const display_monthly = scheduleRecurringFrequency === 'monthly' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RecurringMonthly, null) : null;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Frequency"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
      id: "recurringFrequencySelect",
      options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_RECURRING_OPTIONS"],
      value: scheduleRecurringFrequency,
      onChange: handleScheduleRecurringFrequency
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), display_daily, display_interval, display_weekly, display_monthly);
  };

  const ScheduleTrigger = () => {
    const display_recurring = scheduleType === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].id ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ScheduleTriggerRecurring, null) : null;
    const display_cron = scheduleType === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][1].id ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CronExpression, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_timezone__WEBPACK_IMPORTED_MODULE_4__["TimezoneSelect"], {
      reportDefinitionRequest: reportDefinitionRequest,
      httpClientProps: httpClientProps,
      edit: edit,
      editDefinitionId: editDefinitionId
    })) : null;
    Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
      // Set default trigger_type
      _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"].map(item => {
        if (item.id === scheduleType) {
          reportDefinitionRequest.trigger.trigger_params = { ...reportDefinitionRequest.trigger.trigger_params,
            schedule_type: item.id //TODO: need better handle

          };

          if (!edit) {
            reportDefinitionRequest.trigger.trigger_params.enabled = true;
          }

          if (!('enabled' in reportDefinitionRequest.trigger.trigger_params)) {
            reportDefinitionRequest.trigger.trigger_params.enabled = false;
          }
        }
      });
    }, [scheduleType]);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
      label: "Request time"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiRadioGroup"], {
      options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"],
      idSelected: scheduleType,
      onChange: handleScheduleType
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), display_recurring, display_cron);
  };

  const schedule = reportTriggerType === 'Schedule' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ScheduleTrigger, null) : null;

  const defaultEditTriggerType = trigger_type => {
    let index = 0;

    for (index; index < _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE_OPTIONS"].length; ++index) {
      if (_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE_OPTIONS"][index].id === trigger_type) {
        setReportTriggerType(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE_OPTIONS"][index].id);
      }
    }
  };

  const defaultEditRequestType = trigger => {
    let index = 0;

    for (index; index < _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"].length; ++index) {
      if (_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][index].id === trigger.trigger_params.schedule_type) {
        setScheduleType(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][index].id);
      }
    }
  };

  const defaultEditScheduleFrequency = trigger_params => {
    if (trigger_params.schedule_type === _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["SCHEDULE_TYPE_OPTIONS"][0].id) {
      if (trigger_params.schedule.interval.unit === 'DAYS') {
        setScheduleRecurringFrequency('daily');
      } else {
        setScheduleRecurringFrequency('byInterval');
      }
    }
  };

  const defaultConfigurationEdit = trigger => {
    defaultEditTriggerType(trigger.trigger_type);

    if (trigger.trigger_type === 'Schedule') {
      defaultEditScheduleFrequency(trigger.trigger_params);
      defaultEditRequestType(trigger);
    } else if (trigger.trigger_type == 'On demand') {
      setReportTriggerType('On demand');
      reportDefinitionRequest.trigger.trigger_type = 'On demand';
    }
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (edit) {
      httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
        defaultConfigurationEdit(response.report_definition.trigger);
        reportDefinitionRequest.trigger = response.report_definition.trigger;
      });
    } // Set default trigger_type for create new report definition
    else {
        _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE_OPTIONS"].map(item => {
          if (item.id === reportTriggerType) {
            reportDefinitionRequest.trigger.trigger_type = item.id;
          }
        });
      }
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContent"], {
    panelPaddingSize: 'l'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, "Report trigger"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHorizontalRule"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPageContentBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Trigger type",
    id: "reportDefinitionTriggerTypes"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiRadioGroup"], {
    options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE_OPTIONS"],
    idSelected: reportTriggerType,
    onChange: handleReportTriggerType
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), schedule));
}

/***/ }),

/***/ "./public/components/report_definitions/report_trigger/report_trigger_constants.tsx":
/*!******************************************************************************************!*\
  !*** ./public/components/report_definitions/report_trigger/report_trigger_constants.tsx ***!
  \******************************************************************************************/
/*! exports provided: TRIGGER_TYPE_OPTIONS, SCHEDULE_TYPE_OPTIONS, SCHEDULE_RECURRING_OPTIONS, INTERVAL_TIME_PERIODS, WEEKLY_CHECKBOX_OPTIONS, MONTHLY_ON_THE_OPTIONS, TIMEZONE_OPTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRIGGER_TYPE_OPTIONS", function() { return TRIGGER_TYPE_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SCHEDULE_TYPE_OPTIONS", function() { return SCHEDULE_TYPE_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SCHEDULE_RECURRING_OPTIONS", function() { return SCHEDULE_RECURRING_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INTERVAL_TIME_PERIODS", function() { return INTERVAL_TIME_PERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEEKLY_CHECKBOX_OPTIONS", function() { return WEEKLY_CHECKBOX_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MONTHLY_ON_THE_OPTIONS", function() { return MONTHLY_ON_THE_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEZONE_OPTIONS", function() { return TIMEZONE_OPTIONS; });
/* harmony import */ var moment_timezone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment-timezone */ "moment-timezone");
/* harmony import */ var moment_timezone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment_timezone__WEBPACK_IMPORTED_MODULE_0__);
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

const TRIGGER_TYPE_OPTIONS = [{
  id: 'On demand',
  label: 'On demand'
}, {
  id: 'Schedule',
  label: 'Schedule'
}];
const SCHEDULE_TYPE_OPTIONS = [{
  id: 'Recurring',
  label: 'Recurring'
}, {
  id: 'Cron based',
  label: 'Cron-based'
}];
const SCHEDULE_RECURRING_OPTIONS = [{
  value: 'daily',
  text: 'Daily'
}, {
  value: 'byInterval',
  text: 'By interval'
} // TODO: disable on UI. Add them back once we support
//   {
//     value: 'weekly',
//     text: 'Weekly',
//   },
//   {
//     value: 'monthly',
//     text: 'Monthly',
//   },
];
const INTERVAL_TIME_PERIODS = [{
  value: 'MINUTES',
  text: 'Minutes'
}, {
  value: 'HOURS',
  text: 'Hours'
}, {
  value: 'DAYS',
  text: 'Days'
}];
const WEEKLY_CHECKBOX_OPTIONS = [{
  id: 'monCheckbox',
  label: 'Mon'
}, {
  id: 'tueCheckbox',
  label: 'Tue'
}, {
  id: 'wedCheckbox',
  label: 'Wed'
}, {
  id: 'thuCheckbox',
  label: 'Thu'
}, {
  id: 'friCheckbox',
  label: 'Fri'
}, {
  id: 'satCheckbox',
  label: 'Sat'
}, {
  id: 'sunCheckbox',
  label: 'Sun'
}];
const MONTHLY_ON_THE_OPTIONS = [{
  value: 'day',
  text: 'Day'
}];
const TIMEZONE_OPTIONS = moment_timezone__WEBPACK_IMPORTED_MODULE_0___default.a.tz.names().map(tz => ({
  value: tz,
  text: tz
}));

/***/ }),

/***/ "./public/components/report_definitions/report_trigger/timezone.tsx":
/*!**************************************************************************!*\
  !*** ./public/components/report_definitions/report_trigger/timezone.tsx ***!
  \**************************************************************************/
/*! exports provided: TimezoneSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimezoneSelect", function() { return TimezoneSelect; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _report_trigger_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report_trigger_constants */ "./public/components/report_definitions/report_trigger/report_trigger_constants.tsx");
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



function TimezoneSelect(props) {
  const {
    reportDefinitionRequest,
    httpClientProps,
    edit,
    editDefinitionId
  } = props;
  const [timezone, setTimezone] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(_report_trigger_constants__WEBPACK_IMPORTED_MODULE_2__["TIMEZONE_OPTIONS"][0].value);

  const handleTimezone = e => {
    setTimezone(e.target.value);

    if (reportDefinitionRequest.trigger.trigger_params.schedule_type === 'Cron based') {
      reportDefinitionRequest.trigger.trigger_params.schedule.cron.timezone = e.target.value;
    }
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    let unmounted = false;

    if (edit) {
      httpClientProps.get(`../api/reporting/reportDefinitions/${editDefinitionId}`).then(async response => {
        if (!unmounted && reportDefinitionRequest.trigger.trigger_params.schedule_type === 'Cron based') {
          setTimezone(response.report_definition.trigger.trigger_params.schedule.cron.timezone);
        }
      });
    }

    return () => {
      unmounted = true;
    };
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: "Timezone"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSelect"], {
    id: "setTimezone",
    options: _report_trigger_constants__WEBPACK_IMPORTED_MODULE_2__["TIMEZONE_OPTIONS"],
    value: timezone,
    onChange: handleTimezone
  })));
}

/***/ }),

/***/ "./public/components/report_definitions/utils/index.ts":
/*!*************************************************************!*\
  !*** ./public/components/report_definitions/utils/index.ts ***!
  \*************************************************************/
/*! exports provided: converter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "converter", function() { return converter; });
/* harmony import */ var showdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! showdown */ "./node_modules/showdown/dist/showdown.js");
/* harmony import */ var showdown__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(showdown__WEBPACK_IMPORTED_MODULE_0__);
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

const converter = new showdown__WEBPACK_IMPORTED_MODULE_0___default.a.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  noHeaderId: true
});

/***/ }),

/***/ "./public/components/utils/utils.tsx":
/*!*******************************************!*\
  !*** ./public/components/utils/utils.tsx ***!
  \*******************************************/
/*! exports provided: permissionsMissingToast, permissionsMissingActions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "permissionsMissingToast", function() { return permissionsMissingToast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "permissionsMissingActions", function() { return permissionsMissingActions; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
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

const permissionsMissingToast = action => {
  return {
    title: 'Error ' + action,
    color: 'danger',
    iconType: 'alert',
    id: 'permissionsMissingErrorToast' + action.replace(' ', ''),
    text: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Insufficient permissions. Reach out to your Kibana administrator.")
  };
};
const permissionsMissingActions = {
  CHANGE_SCHEDULE_STATUS: 'changing schedule status.',
  DELETE_REPORT_DEFINITION: 'deleting report definition.',
  GENERATING_REPORT: 'generating report.',
  LOADING_REPORTS_TABLE: 'loading reports table.',
  LOADING_DEFINITIONS_TABLE: 'loading report definitions table.',
  VIEWING_EDIT_PAGE: 'viewing edit page.',
  UPDATING_DEFINITION: 'updating report definition',
  CREATING_REPORT_DEFINITION: 'creating new report definition.'
};

/***/ })

}]);
//# sourceMappingURL=1.plugin.js.map