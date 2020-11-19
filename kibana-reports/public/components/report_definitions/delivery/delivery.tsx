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

import React, { useEffect, useState } from 'react';
import {
  EuiFormRow,
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiHorizontalRule,
  EuiSpacer,
  EuiCheckbox,
} from '@elastic/eui';
import { DELIVERY_TYPE_OPTIONS } from './delivery_constants';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { reportDefinitionParams } from '../create/create_report_definition';
import { EmailDelivery } from './email';

export type ReportDeliveryProps = {
  edit: boolean;
  editDefinitionId: string;
  reportDefinitionRequest: reportDefinitionParams;
  httpClientProps: any;
  showEmailRecipientsError: boolean;
  emailRecipientsErrorMessage: string;
};

export function ReportDelivery(props: ReportDeliveryProps) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
  } = props;

  const [emailCheckbox, setEmailCheckbox] = useState(false);

  const handleEmailCheckbox = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setEmailCheckbox(e.target.checked);
    if (e.target.checked) {
      // if checked, set delivery type to email
      reportDefinitionRequest.delivery.delivery_type =
        DELIVERY_TYPE_OPTIONS[1].id;
    } else {
      // uncheck email checkbox means to use default setting, which is kibana user
      defaultCreateDeliveryParams();
    }
  };

  const emailDelivery = emailCheckbox ? <EmailDelivery {...props} /> : null;

  const defaultCreateDeliveryParams = () => {
    reportDefinitionRequest.delivery = {
      delivery_type: DELIVERY_TYPE_OPTIONS[0].id,
      delivery_params: { kibana_recipients: [] },
    };
  };

  useEffect(() => {
    if (edit) {
      httpClientProps
        .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
        .then(async (response) => {
          const isEmailSelected =
            response.report_definition.delivery.delivery_type ===
            DELIVERY_TYPE_OPTIONS[1].id;
          handleEmailCheckbox({ target: { checked: isEmailSelected } });
        });
    } else {
      // By default it's set to deliver to kibana user
      defaultCreateDeliveryParams();
    }
  }, []);

  return (
    <EuiPageContent panelPaddingSize={'l'} hidden>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Notification settings</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule />
      <EuiPageContentBody>
        <EuiCheckbox
          id="emailCheckboxDelivery"
          label="Add email recipients"
          checked={emailCheckbox}
          onChange={handleEmailCheckbox}
        />
        <EuiSpacer />
        {emailDelivery}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
