import React, { useState } from 'react';
import {
    EuiFieldText,
    EuiSelect,
    EuiFlexGroup,
    EuiFlexItem,
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
  } from '@elastic/eui';

const ReportSchedule = (props) => {
	const {ScheduleRadio, scheduleFutureDateCalendar, scheduleRecurringFrequencySelect } = props;

	return (
		<EuiPageContent panelPaddingSize={"l"}>
			<EuiPageHeader>
				<EuiTitle>
					<h2>Schedule</h2>
				</EuiTitle>
			</EuiPageHeader>
			<EuiHorizontalRule/>
			<EuiPageContentBody>
				<b>Request Time</b> <br/>
				<br/>
				Define delivery schedule and frequency <br/>
				<br/>
				<ScheduleRadio/>
				<br/>
				{scheduleFutureDateCalendar}
				{scheduleRecurringFrequencySelect}
			</EuiPageContentBody>
		</EuiPageContent>
	);
}

export { ReportSchedule };