import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../index';
import * as hooks from '@multiversx/sdk-dapp/hooks';
import * as utils from '@multiversx/sdk-dapp/utils';

// Mock dos hooks do MultiversX
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetIsLoggedIn: jest.fn(),
  useGetAccountInfo: jest.fn()
}));

// Mock da função de logout
jest.mock('@multiversx/sdk-dapp/utils', () => ({
  logout: jest.fn()
}));

// Mock do objeto window.elrond
const mockElrond = {
  isConnected: jest.fn(),
  login: jest.fn()
};

Object.defineProperty(window, 'elrond', {
  value: mockElrond,
  writable: true
});

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hooks.useGetIsLoggedIn as jest.Mock).mockReturnValue(false);
    (hooks.useGetAccountInfo as jest.Mock).mockReturnValue({ address: '' });
  });

  it('deve renderizar o nome da aplicação', () => {
    renderNavbar();
    expect(screen.getByText('StarChain Identity')).toBeInTheDocument();
  });

  describe('quando não está logado', () => {
    beforeEach(() => {
      (hooks.useGetIsLoggedIn as jest.Mock).mockReturnValue(false);
    });

    it('deve mostrar o botão de conectar', () => {
      renderNavbar();
      expect(screen.getByRole('button', { name: /conectar/i })).toBeInTheDocument();
    });

    it('deve tentar conectar quando o botão é clicado', async () => {
      mockElrond.isConnected.mockResolvedValue(false);
      renderNavbar();
      const connectButton = screen.getByRole('button', { name: /conectar/i });
      fireEvent.click(connectButton);
      expect(mockElrond.login).toHaveBeenCalled();
    });
  });

  describe('quando está logado', () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';

    beforeEach(() => {
      (hooks.useGetIsLoggedIn as jest.Mock).mockReturnValue(true);
      (hooks.useGetAccountInfo as jest.Mock).mockReturnValue({ address: mockAddress });
    });

    it('deve mostrar o endereço formatado da carteira', () => {
      renderNavbar();
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });

    it('deve mostrar o botão de desconectar', () => {
      renderNavbar();
      expect(screen.getByRole('button', { name: /desconectar/i })).toBeInTheDocument();
    });

    it('deve chamar a função de logout quando o botão é clicado', () => {
      renderNavbar();
      const logoutButton = screen.getByRole('button', { name: /desconectar/i });
      fireEvent.click(logoutButton);
      expect(utils.logout).toHaveBeenCalled();
    });

    it('deve ter o título completo do endereço no atributo title', () => {
      renderNavbar();
      const addressElement = screen.getByText('0x1234...5678');
      expect(addressElement).toHaveAttribute('title', mockAddress);
    });
  });
}); 