import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Navbar } from '../Navbar';
import { useGetIsLoggedIn } from '../../hooks';
import { dAppName } from '../../config';

// Mock dos hooks
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetAccountInfo: jest.fn()
}));

jest.mock('../../hooks', () => ({
  useGetIsLoggedIn: jest.fn()
}));

// Mock dos componentes de login
jest.mock('@multiversx/sdk-dapp/UI', () => ({
  ExtensionLoginButton: ({ loginButtonText, className }: { loginButtonText: string; className: string }) => (
    <button className={className}>{loginButtonText}</button>
  ),
  WalletConnectLoginButton: ({ loginButtonText, className }: { loginButtonText: string; className: string }) => (
    <button className={className}>{loginButtonText}</button>
  ),
  WebWalletLoginButton: ({ loginButtonText, className }: { loginButtonText: string; className: string }) => (
    <button className={className}>{loginButtonText}</button>
  )
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetIsLoggedIn as jest.Mock).mockReturnValue(false);
    (useGetAccountInfo as jest.Mock).mockReturnValue({ address: '' });
  });

  describe('renderização', () => {
    it('deve exibir logo e links principais', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText(dAppName)).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Ranking')).toBeInTheDocument();
    });

    it('deve exibir link de perfil quando autenticado', () => {
      (useGetIsLoggedIn as jest.Mock).mockReturnValue(true);
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });

    it('não deve exibir link de perfil quando não autenticado', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
    });
  });

  describe('navegação', () => {
    it('deve ter link para ranking', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('link', { name: 'Ranking' })).toHaveAttribute('href', '/ranking');
    });

    it('deve ter link para perfil quando autenticado', () => {
      (useGetIsLoggedIn as jest.Mock).mockReturnValue(true);
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/profile');
    });

    it('deve ter link para home na logo', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('link', { name: dAppName })).toHaveAttribute('href', '/');
    });
  });

  describe('autenticação', () => {
    it('deve renderizar botões de autenticação quando não autenticado', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('xPortal App')).toBeInTheDocument();
      expect(screen.getByText('Wallet Connect')).toBeInTheDocument();
      expect(screen.getByText('Web Wallet')).toBeInTheDocument();
    });

    it('deve renderizar botão de desconectar quando autenticado', () => {
      (useGetIsLoggedIn as jest.Mock).mockReturnValue(true);
      (useGetAccountInfo as jest.Mock).mockReturnValue({ address: 'erd1...' });
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Desconectar')).toBeInTheDocument();
    });

    it('deve exibir endereço formatado quando autenticado', () => {
      (useGetIsLoggedIn as jest.Mock).mockReturnValue(true);
      (useGetAccountInfo as jest.Mock).mockReturnValue({ address: 'erd1abcdef1234567890' });
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('erd1ab...7890')).toBeInTheDocument();
    });
  });
}); 