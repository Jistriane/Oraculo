import React from 'react';
import { render, screen, waitFor, within, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RankingPage } from '../Ranking';
import { starChainService } from '../../services/starchain';

// Mock dos hooks de autenticação
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: jest.fn().mockReturnValue({ isLoggedIn: false }),
  useGetAccountInfo: jest.fn()
}));

// Mock dos hooks customizados
jest.mock('../../hooks', () => ({
  useGetIsLoggedIn: jest.fn().mockReturnValue(false)
}));

// Mock dos serviços
jest.mock('../../services/starchain');

// Importa os hooks mockados
const { useGetLoginInfo, useGetAccountInfo } = require('@multiversx/sdk-dapp/hooks');
const { useGetIsLoggedIn } = require('../../hooks');

/**
 * Testes unitários para a página de ranking.
 * Verifica o comportamento da página em diferentes estados.
 */
describe('RankingPage', () => {
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
   * Testa o carregamento dos perfis
   */
  describe('carregamento', () => {
    it('deve exibir mensagem de carregamento', async () => {
      jest.spyOn(starChainService, 'getTopProfiles').mockImplementation(() => new Promise(() => {}));
      await act(async () => {
        renderWithRouter(<RankingPage />);
      });
      expect(screen.getByText('Carregando ranking...')).toBeInTheDocument();
    });

    it('deve exibir endereço do perfil', async () => {
      const mockProfiles = [
        {
          address: '0x123456789',
          name: 'John Doe',
          stars: 5
        }
      ];

      jest.spyOn(starChainService, 'getTopProfiles').mockResolvedValue(mockProfiles);
      useGetIsLoggedIn.mockReturnValue(true);

      await act(async () => {
        renderWithRouter(<RankingPage />);
      });

      const row = screen.getByRole('row', { name: /John Doe/ });
      expect(within(row).getByText('0x1234...6789')).toBeInTheDocument();
    });

    it('deve exibir ícone de estrela', async () => {
      const mockProfiles = [
        {
          address: '0x123456789',
          name: 'John Doe',
          stars: 5
        }
      ];

      jest.spyOn(starChainService, 'getTopProfiles').mockResolvedValue(mockProfiles);
      useGetIsLoggedIn.mockReturnValue(true);

      await act(async () => {
        renderWithRouter(<RankingPage />);
      });

      const row = screen.getByRole('row', { name: /John Doe/ });
      const starsCell = within(row).getByRole('cell', { name: /5/ });
      expect(within(starsCell).getByText('⭐')).toBeInTheDocument();
    });

    it('deve exibir número de estrelas', async () => {
      const mockProfiles = [
        {
          address: '0x123456789',
          name: 'John Doe',
          stars: 5
        }
      ];

      jest.spyOn(starChainService, 'getTopProfiles').mockResolvedValue(mockProfiles);
      useGetIsLoggedIn.mockReturnValue(true);

      await act(async () => {
        renderWithRouter(<RankingPage />);
      });

      const row = screen.getByRole('row', { name: /John Doe/ });
      const starsCell = within(row).getByRole('cell', { name: /5/ });
      expect(within(starsCell).getByText('5')).toBeInTheDocument();
    });

    it('deve exibir botão de dar estrela quando autenticado', async () => {
      const mockProfiles = [
        {
          address: '0x123456789',
          name: 'John Doe',
          stars: 5
        }
      ];

      jest.spyOn(starChainService, 'getTopProfiles').mockResolvedValue(mockProfiles);
      useGetIsLoggedIn.mockReturnValue(true);
      useGetAccountInfo.mockReturnValue({ address: '0x456' });

      await act(async () => {
        renderWithRouter(<RankingPage />);
      });

      expect(screen.getByText('Dar Estrela')).toBeInTheDocument();
    });
  });

  /**
   * Testa quando não há perfis
   */
  describe('sem perfis', () => {
    it('deve exibir mensagem quando não há perfis', async () => {
      jest.spyOn(starChainService, 'getTopProfiles').mockResolvedValue([]);
      
      await act(async () => {
        renderWithRouter(<RankingPage />);
      });

      expect(screen.getByText('Nenhum perfil encontrado.')).toBeInTheDocument();
    });
  });

  /**
   * Testa o estado de erro
   */
  describe('erro ao carregar', () => {
    it('deve exibir mensagem de erro', async () => {
      jest.spyOn(starChainService, 'getTopProfiles').mockRejectedValueOnce(new Error('Erro ao carregar perfis'));
      
      await act(async () => {
        renderWithRouter(<RankingPage />);
      });
      
      expect(screen.getByText('Não foi possível carregar o ranking. Tente novamente mais tarde.')).toBeInTheDocument();
    });
  });

  /**
   * Testa as informações adicionais
   */
  describe('informações adicionais', () => {
    it('deve exibir mensagem sobre atualização em tempo real', async () => {
      renderWithRouter(<RankingPage />);
      expect(screen.getByText('O ranking é atualizado em tempo real com base nas estrelas recebidas.')).toBeInTheDocument();
    });

    it('deve exibir mensagem sobre criação de perfil', async () => {
      renderWithRouter(<RankingPage />);
      expect(screen.getByText('Para aparecer no ranking, crie seu perfil e comece a receber estrelas!')).toBeInTheDocument();
    });
  });
}); 