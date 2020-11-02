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
    cy.get('#createReportHomepageButton').click();
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

    // create an on-demand report definition
    cy.get('#createNewReportDefinition').click();

    // cy.location('pathname').should('include', '/opendistro_kibana_reports#/');
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
    cy.get('#createNewReportDefinition').click();
  });
});
