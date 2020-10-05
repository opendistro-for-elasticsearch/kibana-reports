import { EuiComboBox, EuiFieldText, EuiFormRow, EuiLink, EuiListGroup, EuiPopover, EuiRadioGroup, EuiSpacer, EuiText } from '@elastic/eui';
import React, { useEffect } from 'react';
import { useState } from "react";
import { EMAIL_FORMAT_OPTIONS, EMAIL_RECIPIENT_OPTIONS } from './delivery_constants';
import ReactMDE from 'react-mde';
import Showdown from 'showdown';

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

export const EmailDelivery = (props) => {
  const {reportDefinitionRequest} = props;

  const [emailRecipients, setEmailRecipients] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailFormat, setEmailFormat] = useState('Embedded HTML');
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
    setEmailRecipients([...emailRecipients, newOption]);
  };

  const handleEmailRecipients = (e) => {
    setEmailRecipients(e);
  };

  // const setDefaultEditEmail = (delivery_params) => {
  //   setEmailCheckbox(true);
  //   let index;
  //   for (index = 0; index < delivery_params.recipients.length; ++index) {
  //     handleCreateEmailRecipient(delivery_params.recipients[index]);
  //   }
  //   setEmailSubject(delivery_params.subject);
  //   setEmailBody(delivery_params.body);
  // };

  // const defaultConfigurationEdit = (delivery) => {
  //   if (delivery.channel.includes('Email')) {
  //     setDefaultEditEmail(delivery.delivery_params);
  //   }
  // };

  const handleEmailSubject = (e) => {
    setEmailSubject(e.target.value);
  };

  const handleEmailFormat = (e) => {
    setEmailFormat(e);
  };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    noHeaderId: true,
  });
  
  // TODO: need better handling when we add full support for kibana user report delivery
  const emailBodyLabel =
    emailFormat === 'Embedded HTML' ? `Add optional message (${selectedTab} mode)`
     : `Email body (${selectedTab} mode)`;

  const showPlaceholder =
    emailFormat === 'Embedded HTML' ? null : <InsertPlaceholderPopover />;

   useEffect(() => {
    reportDefinitionRequest.delivery.delivery_params = {
      recipients: emailRecipients.map(option => option.label),
      title: emailSubject,
      email_format: emailFormat,
      //TODO: need better render
      textDescription: emailBody,
      htmlDescription: converter.makeHtml(emailBody),
    }
   }, [emailRecipients, emailSubject, emailFormat, emailBody]) 

  return (
    <div>
      <EuiFormRow label="Email recipients" helpText="Select or add users">
        <EuiComboBox
          placeholder={'Add users here'}
          options={EMAIL_RECIPIENT_OPTIONS}
          selectedOptions={emailRecipients}
          onChange={handleEmailRecipients}
          onCreateOption={handleCreateEmailRecipient}
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
          onChange={setEmailBody}
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