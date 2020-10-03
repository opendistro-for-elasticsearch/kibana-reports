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
  EuiRadioGroup,
} from '@elastic/eui';
import { KibanaRecipientsBox } from './delivery_recipients_box';
import {
  DELIVERY_TYPE_OPTIONS
} from './delivery_constants';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { reportDefinitionParams } from '../create/create_report_definition';
import { EmailDelivery } from './email';

type ReportDeliveryProps = {
  edit: boolean;
  editDefinitionId: string;
  reportDefinitionRequest: reportDefinitionParams;
  httpClientProps: any;
};

export function ReportDelivery(props: ReportDeliveryProps) {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
  } = props;
  const [deliveryType, setDeliveryType] = useState('Kibana user');

  const handleDeliveryType = (e: string) => {
    setDeliveryType(e);
  };

  const KibanaUserDelivery = () => {

    return (
      <EuiFormRow label="Kibana recipients" helpText="Select or add users">
        <KibanaRecipientsBox reportDefinitionRequest={reportDefinitionRequest}/>
      </EuiFormRow>
    );
  };

  const deliverySetting = deliveryType === "Kibana user" ? <KibanaUserDelivery /> : <EmailDelivery reportDefinitionRequest={reportDefinitionRequest} />

  useEffect(() => {
    if (edit) {
      // httpClientProps
      //   .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
      //   .then(async (response) => {
      //     defaultConfigurationEdit(response.report_definition.trigger);
      //   });
    }
    reportDefinitionRequest.delivery.delivery_type = deliveryType
  }, [deliveryType]);


  return (
    <EuiPageContent panelPaddingSize={'l'}>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Delivery settings</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule />
      <EuiPageContentBody>
      <EuiFormRow label="Delivery type">
          <EuiRadioGroup
            options={DELIVERY_TYPE_OPTIONS}
            idSelected={deliveryType}
            onChange={handleDeliveryType}
          />
      </EuiFormRow>
        <EuiSpacer />
        {deliverySetting}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
