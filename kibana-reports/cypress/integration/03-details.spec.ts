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
  it('Visit report definition details page', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );

    cy.wait(12500);

    cy.get('#reportDefinitionDetailsLink').first().click();

    cy.url().should('include', 'report_definition_details');

    cy.get('#deleteReportDefinitionButton').should('exist');

    cy.get('#editReportDefinitionButton').should('exist');

    if (cy.get('body').contains('Schedule details')) {
      cy.wait(1000);
      cy.get('#changeStatusFromDetailsButton').click();
    } else {
      cy.wait(1000);
      cy.get('#generateReportFromDetailsButton').click();
    }

    cy.get('#deleteReportDefinitionButton').click();
  });

  it('Visit report details page', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );

    cy.wait(12500);
    cy.get('#reportDetailsLink').first().click();

    cy.url().should('include', 'report_details');
  });
});
