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
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiPage,
    EuiPageHeader,
    EuiTitle,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiInMemoryTable,
    EuiHorizontalRule,
    EuiSpacer,
    EuiDescriptionList,
    EuiDescriptionListTitle,
    EuiDescriptionListDescription,
  } from '@elastic/eui';

  interface RouterHomeProps {
    httpClient?: any,
  }

  interface ReportDetailsState {
    reportId: number
  }

  export class ReportDetails extends React.Component<RouterHomeProps, ReportDetailsState> {
    constructor(props) {
      super(props);
      this.state = {
        reportId: this.props.match.params.reportId,
      };
    }

    componentDidMount() {
      const { httpClient } = this.props;
    }

    render() {
      return (
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageHeader>
                <EuiTitle>
                  <h2>Report Details</h2>
                </EuiTitle>
              </EuiPageHeader>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Name
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      Report Details Name
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Description
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      This is the report description. It can be quite long. 
                      A question we need to answer if we want to allow for wsywig editing of the description, and whether or not we need a Markdown editor, or how we handle that. 
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
                <EuiFlexItem></EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Source
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      dashboard/dailysaves
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      File 
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      file_name_2020_06_21_e238asd83bfijek.pdf
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Created
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      June 6, 2020 @ 17:00:00
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer/>
              <EuiTitle>
                <h2>Delivery</h2> 
              </EuiTitle>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Delivery Channel
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      Email
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Recipients
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      user1@email.com, usergroup@corporation.com
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Email Subject
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      Daily Sales Report
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>                  
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Email Body
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      This is an example of a sentence explanation of what this this report might contain.
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>                
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer/>
              <EuiTitle>
                <h2>Schedule</h2>
              </EuiTitle>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiDescriptionList>
                    <EuiDescriptionListTitle>
                      Request Time
                    </EuiDescriptionListTitle>
                    <EuiDescriptionListDescription>
                      Daily, around 17:00 PST
                    </EuiDescriptionListDescription>
                  </EuiDescriptionList>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      )
    }
  }