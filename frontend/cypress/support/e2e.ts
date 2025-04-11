import '@testing-library/cypress/add-commands';
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      // Comandos personalizados aqui
    }
  }
}

beforeEach(() => {
  // Limpar o cache do localStorage antes de cada teste
  cy.clearLocalStorage();
}); 