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

describe('Cypress', () => {
  it('Download from reporting homepage', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );

    cy.wait(12500);
    cy.get('#landingPageOnDemandDownload').click({ force: true });
    cy.get('body').then($body => {
      if ($body.find('#downloadInProgressLoadingModal').length > 0) {
        return;
      }
      else {
        assert(false);
      }
    })
  });

  it('Download pdf from in-context menu', () => {
    cy.visit('http://localhost:5601/app/dashboards#');
    cy.wait(5000);

    // click first entry in dashboards page
    cy.get('tr.euiTableRow:nth-child(1) > td:nth-child(2) > div:nth-child(2) > a:nth-child(1)').click({ force: true });

    // click Reporting in-context menu
    cy.get('#downloadReport > span:nth-child(1) > span:nth-child(1)').click({ force: true });

    // download PDF 
    cy.get('#generatePDF > span:nth-child(1) > span:nth-child(2)').click({ force: true });

    cy.get('#reportGenerationProgressModal');
  });

  it('Download png from in-context menu', () => {
    cy.visit('http://localhost:5601/app/dashboards#');
    cy.wait(5000);

    // click first entry in dashboards page
    cy.get('tr.euiTableRow:nth-child(1) > td:nth-child(2) > div:nth-child(2) > a:nth-child(1)').click({ force: true });

    // click Reporting in-context menu
    cy.get('#downloadReport > span:nth-child(1) > span:nth-child(1)').click({ force: true });

    cy.get('#generatePNG').click({ force: true });

    cy.get('#reportGenerationProgressModal');
  })
});