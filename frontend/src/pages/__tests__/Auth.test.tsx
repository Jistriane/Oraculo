import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AuthPage } from '../Auth';
import { dAppName } from '../../config';

// Mock dos hooks de autenticação
let isLoggedIn = false;
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: () => ({ isLoggedIn }),
  useGetAccountInfo: jest.fn().mockReturnValue({ address: '' })
}));

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

// Mock dos componentes de login
jest.mock('@multiversx/sdk-dapp/UI', () => ({
  ExtensionLoginButton: ({ loginButtonText, className }: { loginButtonText: string; className?: string }) => (
    <button data-testid="extension-login" className={className}>
      {loginButtonText}
    </button>
  ),
  WalletConnectLoginButton: ({ loginButtonText, className }: { loginButtonText: string; className?: string }) => (
    <button data-testid="wallet-connect-login" className={className}>
      {loginButtonText}
    </button>
  ),
  WebWalletLoginButton: ({ loginButtonText, className }: { loginButtonText: string; className?: string }) => (
    <button data-testid="web-wallet-login" className={className}>
      {loginButtonText}
    </button>
  )
}));

/**
 * Testes unitários para a página de autenticação.
 * Verifica a exibição e comportamento dos elementos da página.
 */
describe('AuthPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    isLoggedIn = false;
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  /**
   * Testa o estado não autenticado
   */
  describe('não autenticado', () => {
    it('deve exibir opções de conexão', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );
      
      const extensionButtons = screen.queryAllByTestId('extension-login');
      const walletConnectButtons = screen.queryAllByTestId('wallet-connect-login');
      const webWalletButtons = screen.queryAllByTestId('web-wallet-login');

      expect(extensionButtons[0]).toHaveTextContent('xPortal App');
      expect(walletConnectButtons[0]).toHaveTextContent('Wallet Connect');
      expect(webWalletButtons[0]).toHaveTextContent('Web Wallet');
    });

    it('deve exibir mensagem de boas-vindas', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );
      expect(screen.getByText('Bem-vindo ao StarChain Identity')).toBeInTheDocument();
      expect(screen.getByText('Conecte sua carteira para continuar')).toBeInTheDocument();
    });
  });

  /**
   * Testa o estado autenticado
   */
  describe('autenticado', () => {
    beforeEach(() => {
      isLoggedIn = true;
    });

    it('deve redirecionar para o perfil', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('não deve exibir opções de conexão', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );
      
      expect(screen.queryByTestId('extension-login')).not.toBeInTheDocument();
      expect(screen.queryByTestId('wallet-connect-login')).not.toBeInTheDocument();
      expect(screen.queryByTestId('web-wallet-login')).not.toBeInTheDocument();
    });
  });

  /**
   * Testa os elementos visuais
   */
  describe('elementos visuais', () => {
    it('deve exibir logo', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );
      expect(screen.getByText('StarChain Identity')).toBeInTheDocument();
    });

    it('deve exibir informações adicionais', () => {
      render(
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      );
      expect(screen.getByText('Por que se conectar?')).toBeInTheDocument();
      expect(screen.getByText('Conecte-se à comunidade')).toBeInTheDocument();
      expect(screen.getByText('Compartilhe seus links')).toBeInTheDocument();
      expect(screen.getByText('Receba estrelas')).toBeInTheDocument();
    });
  });
}); 