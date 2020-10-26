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

import { EuiFormRow, EuiSelect } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { TIMEZONE_OPTIONS } from './report_trigger_constants';

export function TimezoneSelect(props) {
  const {
    reportDefinitionRequest,
    httpClientProps,
    edit,
    editDefinitionId,
  } = props;
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0].value);

  const handleTimezone = (e) => {
    setTimezone(e.target.value);
    if (
      reportDefinitionRequest.trigger.trigger_params.schedule_type ===
      'Cron based'
    ) {
      reportDefinitionRequest.trigger.trigger_params.schedule.cron.timezone =
        e.target.value;
    }
  };

  useEffect(() => {
    let unmounted = false;
    if (edit) {
      httpClientProps
        .get(`../api/reporting/reportDefinitions/${editDefinitionId}`)
        .then(async (response) => {
          if (
            !unmounted &&
            reportDefinitionRequest.trigger.trigger_params.schedule_type ===
              'Cron based'
          ) {
            setTimezone(
              response.report_definition.trigger.trigger_params.schedule.cron
                .timezone
            );
          }
        });
    }
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div>
      <EuiFormRow label="Timezone">
        <EuiSelect
          id="setTimezone"
          options={TIMEZONE_OPTIONS}
          value={timezone}
          onChange={handleTimezone}
        />
      </EuiFormRow>
    </div>
  );
}
