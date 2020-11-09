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
  it('Visit edit page, update name and description', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );

    cy.wait(12500);

    cy.get('#reportDefinitionDetailsLink').first().click();

    cy.get('#editReportDefinitionButton').should('exist');

    cy.get('#editReportDefinitionButton').click();

    cy.url().should('include', 'edit');

    cy.wait(1000);

    // update the report name
    cy.get('#reportSettingsName').type(' update name');

    // update report description
    cy.get('#reportSettingsDescription').type(' update description');

    cy.get('#editReportDefinitionButton').click({ force: true });
  });

  it('Visit edit page, change report source and trigger', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );

    cy.wait(12500);

    cy.get('#reportDefinitionDetailsLink').first().click();

    cy.get('#editReportDefinitionButton').should('exist');

    cy.get('#editReportDefinitionButton').click();

    cy.url().should('include', 'edit');

    cy.wait(1000);
    cy.get('#visualizationReportSource').check({ force: true });

    cy.get('#Schedule').check({ force: true });
    cy.get('#editReportDefinitionButton').click({ force: true });
  });

  it('Visit edit page, change report source back', () => {
    cy.visit('http://localhost:5601/app/opendistro_kibana_reports#/');
    cy.location('pathname', { timeout: 60000 }).should(
      'include',
      '/opendistro_kibana_reports'
    );

    cy.wait(12500);

    cy.get('#reportDefinitionDetailsLink').first().click();

    cy.get('#editReportDefinitionButton').should('exist');

    cy.get('#editReportDefinitionButton').click();

    cy.url().should('include', 'edit');

    cy.wait(1000);

    cy.get('#dashboardReportSource').check({ force: true });

    cy.get('#editReportDefinitionButton').click({ force: true });
  });
});
