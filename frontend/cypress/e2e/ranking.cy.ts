describe('Página de Ranking', () => {
  beforeEach(() => {
    cy.visit('/ranking');
  });

  it('deve exibir a tabela de ranking', () => {
    cy.get('table').should('be.visible');
    cy.contains('th', 'Posição').should('be.visible');
    cy.contains('th', 'Nome').should('be.visible');
    cy.contains('th', 'Endereço').should('be.visible');
    cy.contains('th', 'Estrelas').should('be.visible');
    cy.contains('th', 'Ações').should('be.visible');
  });

  it('deve exibir mensagem quando não há perfis', () => {
    cy.mockTopProfiles([]);
    cy.reload();
    cy.contains('Nenhum perfil encontrado').should('be.visible');
  });

  it('deve exibir perfis corretamente', () => {
    const mockProfiles = [
      { address: 'erd1test1...', name: 'Usuário 1', stars: 10 },
      { address: 'erd1test2...', name: 'Usuário 2', stars: 8 }
    ];

    cy.mockTopProfiles(mockProfiles);
    cy.reload();
    cy.wait('@getTopProfiles');

    mockProfiles.forEach(profile => {
      cy.contains('td', profile.name).should('be.visible');
      cy.contains('td', profile.address).should('be.visible');
      cy.contains('td', profile.stars.toString()).should('be.visible');
    });
  });

  it('deve mostrar botão de dar estrela apenas quando autenticado', () => {
    const mockProfiles = [
      { address: 'erd1test1...', name: 'Usuário 1', stars: 10 }
    ];

    cy.mockTopProfiles(mockProfiles);

    // Sem autenticação
    cy.reload();
    cy.wait('@getTopProfiles');
    cy.contains('button', 'Dar Estrela').should('not.exist');

    // Com autenticação
    cy.mockAuthentication('erd1test2...');
    cy.reload();
    cy.wait('@getTopProfiles');
    cy.contains('button', 'Dar Estrela').should('be.visible');
  });

  it('deve desabilitar botão de dar estrela para o próprio perfil', () => {
    const userAddress = 'erd1test1...';
    const mockProfiles = [
      { address: userAddress, name: 'Meu Perfil', stars: 10 }
    ];

    cy.mockAuthentication(userAddress);
    cy.mockTopProfiles(mockProfiles);
    cy.reload();
    cy.wait('@getTopProfiles');
    cy.contains('button', 'Dar Estrela').should('be.disabled');
  });
}); 