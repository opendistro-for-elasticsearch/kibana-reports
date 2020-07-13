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
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiPageContentBody,
  EuiHorizontalRule,
  EuiTextArea,
  EuiCheckbox,
  EuiSpacer,
  EuiComboBox,
  EuiText,
  EuiLink,
  EuiPopover,
  EuiListGroup,
} from '@elastic/eui';
import { DeliveryRecipientsBox } from './delivery_recipients_box';
import { email_recipient_options } from './delivery_constants';

const insert_placeholder_options = [
  {
    label: 'Report details URL',
    href: '#',
    iconType: 'link',
    size: 's',
  },
  {
    label: 'Report source URL',
    href: '#',
    iconType: 'link',
    size: 's',
  },
  {
    label: 'File download URL',
    href: '#',
    iconType: 'link',
    size: 's',
  },
  {
    label: 'Report creation timestamp',
    href: '#',
    iconType: 'clock',
    size: 's',
  },
];

export function ReportDelivery() {
  const [emailCheckbox, setEmailCheckbox] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState();
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [includeReportAsAttachment, setIncludeReportAsAttachment] = useState(
    false
  );
  const [insertPlaceholder, setInsertPlaceholder] = useState(false);

  const onChangeEmailCheckbox = (e) => {
    setEmailCheckbox(e.target.checked);
  };

  const onChangeEmailRecipients = (e) => {
    setEmailRecipients(e);
  };

  const onChangeEmailSubject = (e) => {
    setEmailSubject(e.target.value);
  };

  const onChangeEmailBody = (e) => {
    setEmailBody(e.target.value);
  };

  const onChangeIncludeReportAsAttachment = (e) => {
    setIncludeReportAsAttachment(e.target.checked);
  };

  const onInsertPlaceholderClick = () =>
    setInsertPlaceholder((insertPlaceholder) => !insertPlaceholder);
  const closeInsertPlaceholder = () => setInsertPlaceholder(false);

  const onCreateEmailRecipient = (searchValue, flattenedOptions = []) => {
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

    // Select the option.
    setEmailRecipients([...emailRecipients, newOption]);
  };

  const placeholderInsert = (
    <EuiText size="xs">
      <EuiLink onClick={onInsertPlaceholderClick}>Insert placeholder</EuiLink>
    </EuiText>
  );

  const InsertPlaceholderPopover = () => {
    return (
      <div>
        <EuiPopover
          button={placeholderInsert}
          isOpen={insertPlaceholder}
          closePopover={closeInsertPlaceholder}
        >
          <EuiListGroup listItems={insert_placeholder_options} />
        </EuiPopover>
      </div>
    );
  };

  const EmailDelivery = () => {
    return (
      <div>
        <EuiFormRow
          label="Email recipients"
          helpText="Select or add recipients"
        >
          <EuiComboBox
            placeholder={'add users here'}
            options={email_recipient_options}
            selectedOptions={emailRecipients}
            onChange={onChangeEmailRecipients}
            onCreateOption={onCreateEmailRecipient}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFormRow label="Email subject">
          <EuiFieldText
            placeholder="Subject line"
            value={emailSubject}
            onChange={onChangeEmailSubject}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFormRow
          label="Email body"
          labelAppend={<InsertPlaceholderPopover />}
        >
          <EuiTextArea
            fullWidth={true}
            placeholder="Body content"
            value={emailBody}
            onChange={onChangeEmailBody}
          />
        </EuiFormRow>
        <EuiSpacer size="xs" />
        <EuiCheckbox
          id="includeReportAsAttachment"
          label="Include report as attachment"
          checked={includeReportAsAttachment}
          onChange={onChangeIncludeReportAsAttachment}
        />
      </div>
    );
  };

  const email_delivery = emailCheckbox ? <EmailDelivery /> : null;

  return (
    <EuiPageContent panelPaddingSize={'l'}>
      <EuiPageHeader>
        <EuiTitle>
          <h2>Delivery settings</h2>
        </EuiTitle>
      </EuiPageHeader>
      <EuiHorizontalRule />
      <EuiPageContentBody>
        <EuiFormRow label="Kibana recipients" helpText="Select or add users">
          <DeliveryRecipientsBox />
        </EuiFormRow>
        <EuiSpacer />
        <EuiCheckbox
          id="emailCheckboxDelivery"
          label="Email"
          checked={emailCheckbox}
          onChange={onChangeEmailCheckbox}
        />
        <EuiSpacer />
        {email_delivery}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
