import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfilePage } from '../Profile';
import { starChainService } from '../../services/starchain';

// Mock dos hooks de autenticação
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: jest.fn().mockReturnValue({ isLoggedIn: false }),
  useGetAccountInfo: jest.fn().mockReturnValue({ address: '' })
}));

// Mock dos hooks customizados
jest.mock('../../hooks', () => ({
  useGetIsLoggedIn: jest.fn()
}));

// Mock dos serviços
jest.mock('../../services/starchain', () => ({
  starChainService: {
    getProfile: jest.fn()
  }
}));

// Importa os hooks mockados
const { useGetLoginInfo, useGetAccountInfo } = require('@multiversx/sdk-dapp/hooks');
const { useGetIsLoggedIn } = require('../../hooks');

/**
 * Testes unitários para a página de perfil.
 * Verifica o comportamento da página em diferentes estados.
 */
describe('ProfilePage', () => {
  const renderWithRouter = (children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useGetLoginInfo.mockReturnValue({ isLoggedIn: false });
    useGetAccountInfo.mockReturnValue({ address: '' });
    useGetIsLoggedIn.mockReturnValue(false);
  });

  /**
   * Testa o carregamento do perfil
   */
  describe('carregando perfil', () => {
    it('deve exibir indicador de carregamento', async () => {
      starChainService.getProfile.mockImplementation(() => new Promise(() => {}));
      useGetIsLoggedIn.mockReturnValue(true);
      useGetAccountInfo.mockReturnValue({ address: '0x123' });
      
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve exibir nome do perfil após carregamento', async () => {
      const mockProfile = {
        address: '0x123',
        name: 'John Doe',
        links: ['https://github.com'],
        stars: 5
      };

      starChainService.getProfile.mockResolvedValue(mockProfile);
      useGetIsLoggedIn.mockReturnValue(true);
      useGetAccountInfo.mockReturnValue({ address: '0x123' });

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('0x123')).toBeInTheDocument();
      });
    });

    it('deve exibir número de estrelas do perfil', async () => {
      const mockProfile = {
        address: '0x123',
        name: 'John Doe',
        links: ['https://github.com'],
        stars: 5
      };

      starChainService.getProfile.mockResolvedValue(mockProfile);
      useGetIsLoggedIn.mockReturnValue(true);
      useGetAccountInfo.mockReturnValue({ address: '0x123' });

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        const starsElement = screen.getByTestId('stars-count');
        expect(starsElement).toHaveTextContent('5');
      });
    });

    it('deve exibir mensagem quando perfil não existe', async () => {
      starChainService.getProfile.mockResolvedValue(null);
      useGetIsLoggedIn.mockReturnValue(true);
      useGetAccountInfo.mockReturnValue({ address: '0x123' });

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        const title = screen.getByTestId('profile-title');
        expect(title).toHaveTextContent('Criar Perfil');
      });
    });
  });

  /**
   * Testa o estado de erro
   */
  describe('erro ao carregar', () => {
    it('deve exibir mensagem de erro', async () => {
      starChainService.getProfile.mockRejectedValue(new Error('Erro ao carregar perfil'));
      useGetIsLoggedIn.mockReturnValue(true);
      useGetAccountInfo.mockReturnValue({ address: '0x123' });

      renderWithRouter(<ProfilePage />);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toHaveTextContent('Erro ao carregar perfil');
      });
    });
  });

  /**
   * Testa o redirecionamento
   */
  describe('redirecionamento', () => {
    it('deve exibir mensagem para conectar carteira quando não autenticado', () => {
      useGetIsLoggedIn.mockReturnValue(false);
      renderWithRouter(<ProfilePage />);
      expect(screen.getByText('Conecte sua Carteira')).toBeInTheDocument();
    });
  });
}); 