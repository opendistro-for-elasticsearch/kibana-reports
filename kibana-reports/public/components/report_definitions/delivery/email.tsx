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

import { EuiComboBox, EuiFieldText, EuiFormRow, EuiSpacer } from '@elastic/eui';
import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactMDE from 'react-mde';
import { ReportDeliveryProps } from './delivery';
import { ChannelSchemaType, DeliverySchemaType } from 'server/model';
import { converter } from '../utils';
import { DELIVERY_TYPE_OPTIONS } from './delivery_constants';

export const EmailDelivery = (props: ReportDeliveryProps) => {
  const {
    edit,
    editDefinitionId,
    reportDefinitionRequest,
    httpClientProps,
    showEmailRecipientsError,
    emailRecipientsErrorMessage,
  } = props;

  const [emailRecipients, setEmailRecipients] = useState([]);
  const [selectedEmailRecipients, setSelectedEmailRecipients] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );

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
      setEmailRecipients([...emailRecipients, newOption]);
    }

    handleSelectEmailRecipients([...selectedEmailRecipients, newOption]);
  };

  const handleSelectEmailRecipients = (e) => {
    setSelectedEmailRecipients(e);
    reportDefinitionRequest.delivery.delivery_params.recipients = e.map(
      (option) => option.label
    );
  };

  const handleEmailSubject = (e) => {
    setEmailSubject(e.target.value);
    reportDefinitionRequest.delivery.delivery_params.title = e.target.value;
  };

  const handleEmailBody = (e) => {
    setEmailBody(e);
    reportDefinitionRequest.delivery.delivery_params.textDescription = e;
    reportDefinitionRequest.delivery.delivery_params.htmlDescription = converter.makeHtml(
      e
    );
  };

  // TODO: need better handling when we add full support for kibana user report delivery
  const optionalMessageLabel = `Add optional message (${selectedTab} mode)`;

  const defaultEditDeliveryParams = (delivery: DeliverySchemaType) => {
    //TODO: need better handle?
    // if the original notification setting is kibana user
    if (delivery.delivery_type === DELIVERY_TYPE_OPTIONS[0].id) {
      defaultCreateDeliveryParams();
      delete reportDefinitionRequest.delivery.delivery_params.kibana_recipients;
    } else {
      //@ts-ignore
      const emailParams: ChannelSchemaType = delivery.delivery_params;
      const { recipients, title, textDescription } = emailParams;

      const recipientsOptions = recipients.map((email) => ({ label: email }));
      handleSelectEmailRecipients(recipientsOptions);
      setEmailRecipients(recipientsOptions);

      setEmailSubject(title);
      reportDefinitionRequest.delivery.delivery_params.title = title;
      handleEmailBody(textDescription);
    }
  };

  const defaultCreateDeliveryParams = () => {
    reportDefinitionRequest.delivery.delivery_params = {
      recipients: selectedEmailRecipients.map((option) => option.label),
      title: emailSubject,
      textDescription: emailBody,
      htmlDescription: converter.makeHtml(emailBody),
    };
  };

  useEffect(() => {
    if (edit) {
      httpClientProps
        .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
        .then(async (response) => {
          defaultEditDeliveryParams(response.report_definition.delivery);
        });
    } else {
      defaultCreateDeliveryParams();
    }
  }, []);

  return (
    <div>
      <EuiFormRow
        label="Email recipients"
        helpText="Select or add users"
        isInvalid={showEmailRecipientsError}
        error={emailRecipientsErrorMessage}
      >
        <EuiComboBox
          placeholder={'Add users here'}
          options={emailRecipients}
          selectedOptions={selectedEmailRecipients}
          onChange={handleSelectEmailRecipients}
          onCreateOption={handleCreateEmailRecipient}
          isClearable={true}
          data-test-subj="demoComboBox"
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
      <EuiFormRow label={optionalMessageLabel} fullWidth={true}>
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
