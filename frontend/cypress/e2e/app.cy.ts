describe('StarChain Identity', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve exibir a página inicial corretamente', () => {
    cy.contains('h1', 'Bem-vindo ao StarChain Identity');
    cy.contains('Crie seu Perfil');
    cy.contains('Dê Estrelas');
    cy.contains('Construa Reputação');
  });

  it('deve navegar para a página de perfil', () => {
    cy.contains('Perfil').click();
    cy.url().should('include', '/profile');
    cy.contains('Conecte sua carteira para ver seu perfil');
  });

  it('deve navegar para a página de ranking', () => {
    cy.contains('Ranking').click();
    cy.url().should('include', '/ranking');
    cy.contains('Ranking de Perfis');
  });

  it('deve exibir botões de conexão quando não estiver conectado', () => {
    cy.contains('xPortal App');
    cy.contains('Wallet Connect');
    cy.contains('Web Wallet');
  });
}); 