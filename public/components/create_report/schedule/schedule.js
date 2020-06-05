import React from 'react';
import {
    EuiPageHeader,
    EuiTitle,
    EuiPageContent,
    EuiPageContentBody,
    EuiHorizontalRule,
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