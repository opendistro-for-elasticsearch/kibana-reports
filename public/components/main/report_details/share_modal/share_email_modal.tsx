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

import React, { useState, Fragment } from 'react';
import {
  EuiButton,
  EuiText,
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFormRow,
  EuiSpacer,
  EuiCheckbox,
  EuiFieldText,
  EuiTextArea,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitchEvent,
  EuiSwitch,
  EuiLink,
  EuiForm,
} from '@elastic/eui';

// todo: replace with recipients from ES index
const email_recipient_options = [
  {
    label: 'davidcui@amazon.com',
  },
  {
    label: 'szhongna@amazon.com',
  },
  {
    label: 'kvngar@amazon.com',
  },
];

export function ShareEmailModal() {
  const [
    selectedOptionsEmailRecipients,
    setSelectedEmailRecipients,
  ] = useState([email_recipient_options[0], email_recipient_options[1]]);
  const [emailSubjectValue, setEmailSubjectValue] = useState('');
  const [emailBodyValue, setEmailBodyValue] = useState('');
  const [switchChecked, setSwitchChecked] = useState(false);

  const onChangeEmailRecipients = (selectedOptions) => {
    setSelectedEmailRecipients(selectedOptions);
  };

  const onChangeEmailSubject = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmailSubjectValue(e.target.value);
  };

  const onChangeEmailBody = (e) => {
    setEmailBodyValue(e.target.value);
  };

  const onChangeAttachmentSwitch = (e) => {
    setSwitchChecked(e.target.checked);
  };

  const onCreateOptionEmailRecipients = (
    searchValue,
    flattenedOptions = []
  ) => {
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
        (option) => option.label.trim().toLowerCase() === normalizedSearchValue
      ) === -1
    ) {
      email_recipient_options.push(newOption);
    }

    setSelectedEmailRecipients([...selectedOptionsEmailRecipients, newOption]);
  };

  return (
    <div>
      <EuiForm component="form">
        <EuiFormRow
          label="Add email recipients"
          helpText="Select or add recipients"
        >
          <EuiComboBox
            options={email_recipient_options}
            onCreateOption={onCreateOptionEmailRecipients}
            onChange={(e) => onChangeEmailRecipients(e)}
            selectedOptions={selectedOptionsEmailRecipients}
          />
        </EuiFormRow>
        <EuiSpacer size={'s'} />
        <EuiFormRow label="Email subject">
          <EuiFieldText
            value={emailSubjectValue}
            onChange={(e) => onChangeEmailSubject(e)}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Email body"
          fullWidth={true}
          labelAppend={
            <EuiText size="xs">
              <EuiLink>Insert placeholder</EuiLink>
            </EuiText>
          }
        >
          <EuiTextArea
            fullWidth={true}
            value={emailBodyValue}
            onChange={(e) => onChangeEmailBody(e)}
          />
        </EuiFormRow>
        <EuiCheckbox
          id={'attachment_as_switch_checkbox'}
          label="Include report as attachment"
          checked={switchChecked}
          onChange={onChangeAttachmentSwitch}
        />
        <EuiSpacer />
      </EuiForm>
    </div>
  );
}
