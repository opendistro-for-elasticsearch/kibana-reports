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

import React, { useState } from 'react';
import {
    EuiFieldText,
    EuiFormRow,
    EuiButton,
    EuiPage,
    EuiPageHeader,
    EuiTitle,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiInMemoryTable,
    EuiHorizontalRule,
    EuiSpacer,
    EuiSuggest,
    EuiTextArea,
    EuiRadioGroup,
    EuiComboBox,
  } from '@elastic/eui';
import { DeliveryRecipientsBox } from './delivery_recipients_box';
import { DeliveryChannelRadio } from './delivery_channel_radio';

const ReportDelivery = (props) => {
  const { 
    deliveryEmailSubject, 
    onChangeDeliveryEmailSubject,
    deliveryEmailBody,
    onChangeDeliveryEmailBody
  } = props;

  return (
    <EuiPageContent panelPaddingSize={"l"}>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Delivery</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule/>
      <EuiPageContentBody>
        <EuiFormRow label="Channel" helpText="Define delivery notification channel">
          <DeliveryChannelRadio/>
        </EuiFormRow>
        <EuiFormRow label="Recipients">
          <DeliveryRecipientsBox/>
        </EuiFormRow>
        <EuiFormRow label="Email Subject">
          <EuiFieldText
            placeholder="Subject line"
            value={deliveryEmailSubject}
            onChange={onChangeDeliveryEmailSubject}
          />
        </EuiFormRow>
        <EuiFormRow label="Email Body">
          <EuiTextArea
            placeholder="email body"
            value={deliveryEmailBody}
            onChange={onChangeDeliveryEmailBody}
          />  
        </EuiFormRow>
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

export { ReportDelivery };