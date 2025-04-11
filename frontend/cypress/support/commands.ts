declare namespace Cypress {
  interface Chainable {
    mockAuthentication(address?: string): Chainable<void>;
    mockTopProfiles(profiles: any[]): Chainable<void>;
    mockProfile(address: string, profile: any): Chainable<void>;
  }
}

Cypress.Commands.add('mockAuthentication', (address = 'erd1test...') => {
  cy.window().then((win) => {
    win.localStorage.setItem('address', address);
  });
});

Cypress.Commands.add('mockTopProfiles', (profiles) => {
  const returnData = profiles.flatMap(profile => [
    Buffer.from(profile.address).toString('base64'),
    Buffer.from(profile.name).toString('base64'),
    profile.stars.toString()
  ]);

  cy.intercept('GET', '**/getTopProfiles*', {
    statusCode: 200,
    body: { returnData }
  }).as('getTopProfiles');
});

Cypress.Commands.add('mockProfile', (address, profile) => {
  const returnData = [
    Buffer.from(profile.name).toString('base64'),
    profile.links.length.toString(),
    ...profile.links.map(link => Buffer.from(link).toString('base64')),
    profile.stars.toString()
  ];

  cy.intercept('GET', `**/getProfile*${address}*`, {
    statusCode: 200,
    body: { returnData }
  }).as('getProfile');
}); 