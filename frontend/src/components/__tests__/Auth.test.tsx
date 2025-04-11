import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthPage } from '../../pages/Auth';

// Mock dos hooks
let isLoggedIn = false;
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: () => ({ isLoggedIn }),
  useGetAccountInfo: () => ({ address: '' })
}));

// Mock dos componentes de login
jest.mock('@multiversx/sdk-dapp/UI', () => ({
  ExtensionLoginButton: ({ loginButtonText, className, callbackroute, nativeauth }) => 
    <button className={className} data-callbackroute={callbackroute} data-nativeauth={nativeauth}>{loginButtonText}</button>,
  WalletConnectLoginButton: ({ loginButtonText, className, callbackroute, nativeauth }) => 
    <button className={className} data-callbackroute={callbackroute} data-nativeauth={nativeauth}>{loginButtonText}</button>,
  WebWalletLoginButton: ({ loginButtonText, className, callbackroute, nativeauth }) => 
    <button className={className} data-callbackroute={callbackroute} data-nativeauth={nativeauth}>{loginButtonText}</button>
}));

/**
 * Testes unitários para o componente Auth.
 * Verifica o comportamento do componente de autenticação.
 */
describe('AuthPage', () => {
  const renderWithRouter = (children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };

  // Configura os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    isLoggedIn = false;
  });

  /**
   * Testa a renderização do componente
   */
  describe('renderização', () => {
    it('deve exibir título', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText('Bem-vindo ao StarChain Identity')).toBeInTheDocument();
    });

    it('deve exibir botões de conexão', () => {
      renderWithRouter(<AuthPage />);
      const xPortalButtons = screen.queryAllByText('xPortal App');
      const walletConnectButtons = screen.queryAllByText('Wallet Connect');
      const webWalletButtons = screen.queryAllByText('Web Wallet');
      
      // Verifica se pelo menos um botão de cada tipo está presente
      expect(xPortalButtons.length).toBeGreaterThan(0);
      expect(walletConnectButtons.length).toBeGreaterThan(0);
      expect(webWalletButtons.length).toBeGreaterThan(0);
    });

    it('deve exibir informações adicionais', () => {
      renderWithRouter(<AuthPage />);
      expect(screen.getByText(/Escolha um dos métodos acima/)).toBeInTheDocument();
      expect(screen.getByText(/Não tem uma carteira/)).toBeInTheDocument();
      
      const link = screen.getByText('Crie uma agora');
      expect(link).toHaveAttribute('href', 'https://xportal.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
}); 