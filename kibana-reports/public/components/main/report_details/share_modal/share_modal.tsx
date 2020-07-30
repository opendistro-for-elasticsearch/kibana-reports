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
  EuiSwitchEvent,
  EuiSwitch,
} from '@elastic/eui';
import { ShareEmailModal } from './share_email_modal';
// todo: replace with recipients from ES index
const kibana_recipient_options = [
  {
    label: 'David',
  },
  {
    label: 'Zhongnan',
  },
  {
    label: 'Kevin',
  },
];

export function ShareModal(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [
    selectedOptionsKibanaRecipients,
    setSelectedKibanaRecipients,
  ] = useState([kibana_recipient_options[0], kibana_recipient_options[1]]);
  const [emailChecked, setEmailChecked] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const onChangeKibanaRecipients = (selectedOptions) => {
    setSelectedKibanaRecipients(selectedOptions);
  };

  const onChangeEmailCheckbox = (e) => {
    setEmailChecked(e.target.checked);
  };

  const onCreateOptionKibanaRecipients = (
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
      kibana_recipient_options.push(newOption);
    }
    // Select the option.
    setSelectedKibanaRecipients([
      ...selectedOptionsKibanaRecipients,
      newOption,
    ]);
  };

  const showShareEmail = emailChecked ? <ShareEmailModal /> : null;

  let modal;
  if (isModalVisible) {
    modal = (
      <EuiOverlayMask>
        <EuiModal onClose={closeModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Share</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText>
              Send to new Kibana or email recipients. Existing recipients will
              not be notified
            </EuiText>
            <EuiSpacer />
            <EuiFormRow
              label="Add kibana recipients"
              helpText="Select or add users"
            >
              <EuiComboBox
                options={kibana_recipient_options}
                selectedOptions={selectedOptionsKibanaRecipients}
                onChange={onChangeKibanaRecipients}
                onCreateOption={onCreateOptionKibanaRecipients}
              />
            </EuiFormRow>
            <EuiCheckbox
              id={'report_details_share_email_checkbox'}
              label="Email"
              checked={emailChecked}
              onChange={onChangeEmailCheckbox}
            />
            <EuiSpacer size="m" />
            {showShareEmail}
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>
            <EuiButton onClick={closeModal} fill>
              Send
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }
  return (
    <div>
      <EuiText size="xs">
        <h2>
          <a onClick={showModal}>Share</a>
        </h2>
        <div>{modal}</div>
      </EuiText>
    </div>
  );
}
