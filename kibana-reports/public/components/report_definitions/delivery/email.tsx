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

import {
  EuiComboBox,
  EuiFieldText,
  EuiFormRow,
  EuiLink,
  EuiListGroup,
  EuiPopover,
  EuiRadioGroup,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  EMAIL_FORMAT_OPTIONS,
  EMAIL_RECIPIENT_OPTIONS,
} from './delivery_constants';
import ReactMDE from 'react-mde';
import Showdown from 'showdown';
import { ReportDeliveryProps } from './delivery';
import { ChannelSchemaType } from 'server/model';

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

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  noHeaderId: true,
});

export const EmailDelivery = (props: ReportDeliveryProps) => {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
  } = props;

  const [emailRecipients, setEmailRecipients] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailFormat, setEmailFormat] = useState(EMAIL_FORMAT_OPTIONS[0].id);
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );
  const [insertPlaceholder, setInsertPlaceholder] = useState(false);

  const handleInsertPlaceholderClick = () => {
    setInsertPlaceholder((insertPlaceholder) => !insertPlaceholder);
  };
  const closeInsertPlaceholder = () => setInsertPlaceholder(false);

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
    handleEmailRecipients([...emailRecipients, newOption]);
  };

  const handleEmailRecipients = (e) => {
    setEmailRecipients(e);
    reportDefinitionRequest.delivery.delivery_params.recipients = e.map(
      (option) => option.label
    );
  };

  const handleEmailSubject = (e) => {
    setEmailSubject(e.target.value);
    reportDefinitionRequest.delivery.delivery_params.title = e.target.value;
  };

  const handleEmailFormat = (e) => {
    setEmailFormat(e);
    reportDefinitionRequest.delivery.delivery_params.email_format = e;
  };

  const handleEmailBody = (e) => {
    setEmailBody(e);
    reportDefinitionRequest.delivery.delivery_params.textDescription = e;
    reportDefinitionRequest.delivery.delivery_params.htmlDescription = converter.makeHtml(
      e
    );
  };

  // TODO: need better handling when we add full support for kibana user report delivery
  const emailBodyLabel =
    emailFormat === 'Embedded HTML'
      ? `Add optional message (${selectedTab} mode)`
      : `Email body (${selectedTab} mode)`;

  const showPlaceholder =
    emailFormat === 'Embedded HTML' ? null : <InsertPlaceholderPopover />;

  const defaultEditDeliveryParams = (deliveryParams: ChannelSchemaType) => {
    //TODO: need better handle?
    delete reportDefinitionRequest.delivery.delivery_params.kibana_recipients;

    deliveryParams.recipients.map((emailRecipient) =>
      handleCreateEmailRecipient(emailRecipient, emailRecipients)
    );
    setEmailSubject(deliveryParams.title);
    reportDefinitionRequest.delivery.delivery_params.title =
      deliveryParams.title;
    handleEmailBody(deliveryParams.textDescription);
    handleEmailFormat(deliveryParams.email_format);
  };

  useEffect(() => {
    if (edit) {
      httpClientProps
        .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
        .then(async (response) => {
          defaultEditDeliveryParams(
            response.report_definition.delivery.delivery_params
          );
        });
    } else {
      reportDefinitionRequest.delivery.delivery_params = {
        recipients: emailRecipients.map((option) => option.label),
        title: emailSubject,
        email_format: emailFormat,
        //TODO: need better render
        textDescription: emailBody,
        htmlDescription: converter.makeHtml(emailBody),
      };
    }
  }, []);

  return (
    <div>
      <EuiFormRow label="Email recipients" helpText="Select or add users">
        <EuiComboBox
          placeholder={'Add users here'}
          options={EMAIL_RECIPIENT_OPTIONS}
          selectedOptions={emailRecipients}
          onChange={handleEmailRecipients}
          onCreateOption={handleCreateEmailRecipient}
          isClearable={true}
          data-test-subj="demoComboBox"
        />
      </EuiFormRow>
      <EuiSpacer />
      <EuiFormRow label="Email format">
        <EuiRadioGroup
          options={EMAIL_FORMAT_OPTIONS}
          idSelected={emailFormat}
          onChange={handleEmailFormat}
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
        label={emailBodyLabel}
        labelAppend={showPlaceholder}
        fullWidth={true}
      >
        <ReactMDE
          value={emailBody}
          onChange={handleEmailBody}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          toolbarCommands={[
            ['header', 'bold', 'italic', 'strikethrough'],
            ['unordered-list', 'ordered-list', 'checked-list'],
          ]}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
      </EuiFormRow>
      <EuiSpacer size="xs" />
    </div>
  );
};
