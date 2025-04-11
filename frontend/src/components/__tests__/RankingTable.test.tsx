import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useGetIsLoggedIn, useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { RankingTable } from '../RankingTable';
import { starChainService } from '../../services/starchain';

// Mock dos hooks
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetIsLoggedIn: jest.fn(),
  useGetAccountInfo: jest.fn(),
  useGetLoginInfo: jest.fn()
}));

// Mock do serviço
jest.mock('../../services/starchain', () => ({
  starChainService: {
    giveStar: jest.fn()
  }
}));

/**
 * Testes unitários para o componente RankingTable.
 * Verifica a exibição da tabela de ranking de usuários.
 */
describe('RankingTable', () => {
  const mockProfiles = [
    { address: '0x1234...9abc', name: 'Test User', stars: 5 }
  ];

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
    (useGetLoginInfo as jest.Mock).mockReturnValue({ isLoggedIn: false });
    (useGetAccountInfo as jest.Mock).mockReturnValue({ address: '' });
  });

  /**
   * Testa a renderização da tabela
   */
  describe('renderização', () => {
    it('deve exibir cabeçalhos da tabela', () => {
      renderWithRouter(<RankingTable profiles={mockProfiles} />);
      expect(screen.getByText('Posição')).toBeInTheDocument();
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Endereço')).toBeInTheDocument();
      expect(screen.getByText('Estrelas')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    it('deve exibir mensagem quando não há perfis', () => {
      renderWithRouter(<RankingTable profiles={[]} />);
      expect(screen.getByText('Nenhum perfil encontrado.')).toBeInTheDocument();
    });

    it('deve exibir perfis corretamente', () => {
      renderWithRouter(<RankingTable profiles={mockProfiles} />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('0x1234...9abc')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  /**
   * Testa o botão de dar estrela
   */
  describe('botão de estrela', () => {
    it('deve exibir botão apenas quando autenticado', () => {
      (useGetLoginInfo as jest.Mock).mockReturnValue({ isLoggedIn: true });
      (useGetAccountInfo as jest.Mock).mockReturnValue({ address: '0x5678' });
      
      renderWithRouter(<RankingTable profiles={mockProfiles} />);
      expect(screen.getByText('Dar Estrela')).toBeInTheDocument();
    });

    it('não deve exibir botão quando não autenticado', () => {
      renderWithRouter(<RankingTable profiles={mockProfiles} />);
      expect(screen.queryByText('Dar Estrela')).not.toBeInTheDocument();
    });

    it('deve desabilitar botão para perfil próprio', () => {
      (useGetLoginInfo as jest.Mock).mockReturnValue({ isLoggedIn: true });
      (useGetAccountInfo as jest.Mock).mockReturnValue({ address: mockProfiles[0].address });
      
      renderWithRouter(<RankingTable profiles={mockProfiles} />);
      expect(screen.queryByText('Dar Estrela')).not.toBeInTheDocument();
    });
  });
});