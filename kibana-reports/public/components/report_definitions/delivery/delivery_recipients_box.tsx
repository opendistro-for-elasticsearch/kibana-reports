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
import { EuiComboBox } from '@elastic/eui';
import { useEffect } from 'react';

const KibanaRecipientsBox = (props) => {

  const {reportDefinitionRequest} = props;

  const options = [];
  const [selectedOptions, setSelected] = useState([]);

  const onChangeDeliveryRecipients = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  const onCreateDeliveryRecipientOption = (
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
      options.push(newOption);
    }

    // Select the option.
    setSelected([...selectedOptions, newOption]);
  };

  useEffect(() => {
    reportDefinitionRequest.delivery.delivery_params = {
      kibana_recipients: selectedOptions
    }
  }, [selectedOptions])

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

export { KibanaRecipientsBox };
