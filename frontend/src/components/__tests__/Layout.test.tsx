import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

// Mock dos hooks de autenticação
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: jest.fn().mockReturnValue({ isLoggedIn: false }),
  useGetAccountInfo: jest.fn().mockReturnValue({ address: '' })
}));

// Mock dos hooks customizados
jest.mock('../../hooks', () => ({
  useGetIsLoggedIn: jest.fn().mockReturnValue(false)
}));

// Mock dos componentes de login
jest.mock('@multiversx/sdk-dapp/UI', () => ({
  ExtensionLoginButton: ({ loginButtonText, ...props }: { loginButtonText: string; [key: string]: any }) => (
    <button {...props}>{loginButtonText}</button>
  ),
  WalletConnectLoginButton: ({ loginButtonText, ...props }: { loginButtonText: string; [key: string]: any }) => (
    <button {...props}>{loginButtonText}</button>
  ),
  WebWalletLoginButton: ({ loginButtonText, ...props }: { loginButtonText: string; [key: string]: any }) => (
    <button {...props}>{loginButtonText}</button>
  )
}));

// Importa os hooks mockados
const { useGetLoginInfo, useGetAccountInfo } = require('@multiversx/sdk-dapp/hooks');
const { useGetIsLoggedIn } = require('../../hooks');

/**
 * Testes unitários para o componente Layout.
 * Verifica a estrutura e comportamento do layout da aplicação.
 */
describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGetLoginInfo.mockReturnValue({ isLoggedIn: false });
    useGetAccountInfo.mockReturnValue({ address: '' });
    useGetIsLoggedIn.mockReturnValue(false);
  });

  const renderWithRouter = (children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };

  /**
   * Testa a renderização do componente
   */
  describe('renderização', () => {
    it('deve renderizar navbar', () => {
      renderWithRouter(<Layout>Conteúdo</Layout>);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('deve renderizar conteúdo filho', () => {
      renderWithRouter(<Layout>Conteúdo de teste</Layout>);
      expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
    });
  });

  /**
   * Testa a estrutura do layout
   */
  describe('estrutura', () => {
    it('deve ter container principal', () => {
      renderWithRouter(<Layout>Conteúdo</Layout>);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('deve ter padding adequado', () => {
      renderWithRouter(<Layout>Conteúdo</Layout>);
      const main = screen.getByRole('main');
      expect(main).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
    });
  });

  /**
   * Testa a responsividade do layout
   */
  describe('responsividade', () => {
    it('deve ter container centralizado', () => {
      renderWithRouter(<Layout>Conteúdo</Layout>);
      const main = screen.getByRole('main');
      expect(main).toHaveClass('container', 'mx-auto');
    });

    it('deve ter altura mínima', () => {
      renderWithRouter(<Layout>Conteúdo</Layout>);
      const container = screen.getByTestId('layout-container');
      expect(container).toHaveClass('min-h-screen');
    });
  });
}); 