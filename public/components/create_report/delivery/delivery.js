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
import { htmlIdGenerator } from '@elastic/eui/lib/services';


const ReportDelivery = (props) => {
  const { 
    deliveryEmailSubject, 
    onChangeDeliveryEmailSubject,
    deliveryEmailBody,
    onChangeDeliveryEmailBody
  } = props;

  const idPrefix = htmlIdGenerator()();

  const DeliveryChannelRadio = () => {
    const radios = [
      {
        id: `${idPrefix}3`,
        label: 'None (report will be available in Reports List page)',
      },
      {
        id: `${idPrefix}4`,
        label: 'Email',
      },
      {
        id: `${idPrefix}5`,
        label: 'Chime',
      },
      {
        id: `${idPrefix}6`,
        label: 'Other (webhook)'
      }
    ];
    
    const [radioIdSelected, setRadioIdSelected] = useState(`${idPrefix}3`);

    const handleChangeDeliveryChannel = optionId => {
      setRadioIdSelected(optionId);
    };
    
    return (
        <EuiRadioGroup
          options={radios}
          idSelected={radioIdSelected}
          onChange={handleChangeDeliveryChannel}
          name="deliveryChannelRadioGroup"
          legend={{
            children: <span>This is a legend for a radio group</span>,
          }}
        />
    );
  };

  const DeliveryRecipientsBox = () => {
    const options = [];
    const [selectedOptions, setSelected] = useState([]);
  
    const onChangeDeliveryRecipients = selectedOptions => {
      setSelected(selectedOptions);
    };
  
    const onCreateDeliveryRecipientOption = (searchValue, flattenedOptions = []) => {
      const normalizedSearchValue = searchValue.trim().toLowerCase();
    
      if (!normalizedSearchValue) {
        return;
      }
    
      const newOption = {
        label: searchValue,
      };
    
      // Create the option if it doesn't exist.
      if (
        flattenedOptions.findIndex(
        option => option.label.trim().toLowerCase() === normalizedSearchValue
        ) === -1
      ) {
        options.push(newOption);
      }
    
      // Select the option.
      setSelected([...selectedOptions, newOption]);
    };
  
    return (
      <EuiComboBox
        placeholder="Select or create options"
        options={options}
        selectedOptions={selectedOptions}
        onChange={onChangeDeliveryRecipients}
        onCreateOption={onCreateDeliveryRecipientOption}
        isClearable={true}
        data-test-subj="demoComboBox"
      />
    );
  };

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