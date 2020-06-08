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
    EuiSelect,
    EuiFlexGroup,
    EuiFlexItem,
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
  } from '@elastic/eui';

const ReportDelivery = (props) => {
  const { 
    DeliveryChannelRadio, 
    DeliveryRecipientsBox, 
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
        <b>Channel</b><br/>
        <br/>
        Define delivery notification channel <br/>
        <br/>
        <DeliveryChannelRadio/>
        <br/>
        <b>Recipients</b><br/>
        <br/>
        <DeliveryRecipientsBox/>
        <br/>
        <b>Email subject</b><br/>
        <br/>
        <EuiFieldText
            placeholder="Subject line"
            value={deliveryEmailSubject}
            onChange={onChangeDeliveryEmailSubject}
        />
        <br/>
        <b>Email body</b><br/>
        <br/>
        <EuiTextArea
            placeholder="email body"
            value={deliveryEmailBody}
            onChange={onChangeDeliveryEmailBody}
        />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

export { ReportDelivery };