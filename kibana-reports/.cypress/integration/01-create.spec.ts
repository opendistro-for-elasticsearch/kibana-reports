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
  it('Visits Reporting homepage', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );
  });

  it('Visit Create page', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );
    cy.wait(12500); // wait for the page to load
    cy.get('#createReportHomepageButton').click({ force: true });
  });

  it('Create a new on-demand report definition', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );
    cy.wait(12500);
    cy.get('#createReportHomepageButton').click();

    // enter a report name
    cy.get('#reportSettingsName').type('Create cypress test on-demand report');

    // enter a report description
    cy.get('#reportSettingsDescription').type('Description for cypress test');

    // select a report source
    cy.get('.euiComboBox').click({ force: true });

    // create an on-demand report definition
    cy.get('#createNewReportDefinition').click({ force: true });
  });

  it('Create a new scheduled report definition', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );
    cy.wait(12500);
    cy.get('#createReportHomepageButton').click();

    // enter a report name
    cy.get('#reportSettingsName').type('Create cypress test scheduled report');

    // enter a report description
    cy.get('#reportSettingsDescription').type('Description for cypress test');

    // set report trigger to Schedule option
    cy.get('[type="radio"]').check({ force: true });

    // create scheduled report definition
    cy.get('#createNewReportDefinition').click({ force: true });
  });
});
