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
import { EMAIL_RECIPIENT_OPTIONS } from './delivery_constants';

const INSERT_PLACEHOLDER_OPTIONS = [
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

let delivery_params = {
  subject: '',
  body: '',
  has_attachment: false,
  recipients: ['array'],
};

export function ReportDelivery(props) {
  const { createReportDefinitionRequest } = props;
  const [emailCheckbox, setEmailCheckbox] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [includeReportAsAttachment, setIncludeReportAsAttachment] = useState(
    false
  );
  const [insertPlaceholder, setInsertPlaceholder] = useState(false);

  // TODO: make these fields not required for Create report definition request so no need for filler values
  let delivery = {
    channel: 'Kibana User',
    delivery_params: {
      subject: 'test subject',
      body: 'test body',
      has_attachment: true,
      recipients: ['test_entry@test.com'],
    },
  };

  const handleEmailCheckbox = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setEmailCheckbox(e.target.checked);
    if (e.target.checked) {
      delivery['channel'] = 'Email';
    }
    delivery['delivery_params'] = delivery_params;
  };

  const handleEmailRecipients = (e: React.SetStateAction<any[]>) => {
    setEmailRecipients(e);
    delivery_params['recipients'].push(e.toString());
  };

  const handleIncludeReportAsAttachment = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setIncludeReportAsAttachment(e.target.checked);
    if (e.target.checked) {
      delivery_params['has_attachment'] = includeReportAsAttachment;
    }
  };

  const handleInsertPlaceholderClick = () => {
    setInsertPlaceholder((insertPlaceholder) => !insertPlaceholder);
  };
  const closeInsertPlaceholder = () => setInsertPlaceholder(false);

  const handleCreateEmailRecipient = (
    searchValue: string,
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
      EMAIL_RECIPIENT_OPTIONS.push(newOption);
    }

    // Select the option.
    setEmailRecipients([...emailRecipients, newOption]);
  };

  const placeholderInsert = (
    <EuiText size="xs">
      <EuiLink onClick={handleInsertPlaceholderClick}>
        Insert placeholder
      </EuiLink>
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
          <EuiListGroup listItems={INSERT_PLACEHOLDER_OPTIONS} />
        </EuiPopover>
      </div>
    );
  };

  const EmailDelivery = () => {
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const handleEmailSubject = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setEmailSubject(e.target.value);
      delivery_params['subject'] = e.target.value.toString();
    };

    const handleEmailBody = (e: {
      target: { value: React.SetStateAction<string> };
    }) => {
      setEmailBody(e.target.value);
      delivery_params['body'] = e.target.value.toString();
    };

    return (
      <div>
        <EuiFormRow
          label="Email recipients"
          helpText="Select or add recipients"
        >
          <EuiComboBox
            placeholder={'Add users here'}
            options={EMAIL_RECIPIENT_OPTIONS}
            selectedOptions={emailRecipients}
            onChange={handleEmailRecipients}
            onCreateOption={handleCreateEmailRecipient}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFormRow label="Email subject">
          <EuiFieldText
            placeholder="Subject line"
            value={emailSubject}
            onChange={handleEmailSubject}
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
            onChange={handleEmailBody}
          />
        </EuiFormRow>
        <EuiSpacer size="xs" />
        <EuiCheckbox
          id="includeReportAsAttachment"
          label="Include report as attachment"
          checked={includeReportAsAttachment}
          onChange={handleIncludeReportAsAttachment}
        />
      </div>
    );
  };

  const emailDelivery = emailCheckbox ? <EmailDelivery /> : null;

  createReportDefinitionRequest['delivery'] = delivery;

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
          onChange={handleEmailCheckbox}
        />
        <EuiSpacer />
        {emailDelivery}
      </EuiPageContentBody>
    </EuiPageContent>
  );
}
