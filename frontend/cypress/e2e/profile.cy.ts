describe('Página de Perfil', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('deve exibir mensagem para conectar carteira quando não autenticado', () => {
    cy.contains('Conecte sua carteira para ver seu perfil');
    cy.contains('xPortal App').should('be.visible');
    cy.contains('Wallet Connect').should('be.visible');
    cy.contains('Web Wallet').should('be.visible');
  });

  it('deve exibir formulário de criação de perfil quando autenticado sem perfil', () => {
    cy.mockAuthentication();
    cy.mockProfile('erd1test...', null);
    cy.reload();

    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="links"]').should('be.visible');
    cy.contains('button', 'Criar Perfil').should('be.visible');
  });

  it('deve validar campos obrigatórios no formulário', () => {
    cy.mockAuthentication();
    cy.mockProfile('erd1test...', null);
    cy.reload();

    cy.contains('button', 'Criar Perfil').click();
    cy.contains('Nome é obrigatório').should('be.visible');
  });

  it('deve permitir adicionar e remover links', () => {
    cy.mockAuthentication();
    cy.mockProfile('erd1test...', null);
    cy.reload();

    cy.contains('button', 'Adicionar Link').click();
    cy.get('input[name="links"]').should('have.length', 2);
    
    cy.contains('button', 'Remover').first().click();
    cy.get('input[name="links"]').should('have.length', 1);
  });

  it('deve exibir perfil existente', () => {
    const mockProfile = {
      name: 'Test User',
      links: ['https://github.com/test'],
      stars: 5
    };

    cy.mockAuthentication();
    cy.mockProfile('erd1test...', mockProfile);
    cy.reload();

    cy.contains(mockProfile.name).should('be.visible');
    cy.contains(mockProfile.links[0]).should('be.visible');
    cy.contains(`${mockProfile.stars} estrelas`).should('be.visible');
  });
}); 