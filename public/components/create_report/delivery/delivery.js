import React, { useState } from 'react';
import {
    EuiButtonEmpty,
    EuiComboBox,
    EuiDatePicker,
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

const ReportDelivery = (props) => {
	const { 
		DeliveryChannelRadio, 
		DeliveryRecipientsBox, 
		deliveryEmailSubject, 
		onChangeDeliveryEmailSubject,
		deliveryEmailBody,
		onChangeDeliveryEmailBody
	} = props;

	return (
		<EuiPageContent panelPaddingSize={"l"}>
			<EuiPageHeader>
				<EuiTitle>
					<h2>Delivery</h2>
				</EuiTitle>
			</EuiPageHeader>
			<EuiHorizontalRule/>
			<EuiPageContentBody>
				<b>Channel</b><br/>
				<br/>
				Define delivery notification channel <br/>
				<br/>
				<DeliveryChannelRadio/>
				<br/>
				<b>Recipients</b><br/>
				<br/>
				<DeliveryRecipientsBox/>
				<br/>
				<b>Email subject</b><br/>
				<br/>
				<EuiFieldText
						placeholder="Subject line"
						value={deliveryEmailSubject}
						onChange={onChangeDeliveryEmailSubject}
				/>
				<br/>
				<b>Email body</b><br/>
				<br/>
				<EuiTextArea
						placeholder="email body"
						value={deliveryEmailBody}
						onChange={onChangeDeliveryEmailBody}
				/>
			</EuiPageContentBody>
		</EuiPageContent>
	);
}

export { ReportDelivery };