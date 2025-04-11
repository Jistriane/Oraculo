import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from '../ProfileCard';
import { starChainService } from '../../services/starchain';
import { BrowserRouter } from 'react-router-dom';
import { useGetIsLoggedIn } from '../../hooks';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import userEvent from '@testing-library/user-event';
import { waitFor, act } from '@testing-library/react';

// Mock das dependências
jest.mock('../../services/starchain', () => ({
  starChainService: {
    giveStar: jest.fn()
  }
}));

jest.mock('../../hooks', () => ({
  useGetIsLoggedIn: jest.fn()
}));

jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetAccountInfo: jest.fn()
}));

/**
 * Testes unitários para o componente ProfileCard.
 * Verifica a exibição e interação com o cartão de perfil de usuário.
 */
describe('ProfileCard', () => {
  const mockProfile = {
    address: '0x123',
    name: 'Test User',
    links: ['https://github.com/test'],
    stars: 5
  };

  const mockOnStarGiven = jest.fn();

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Testa a renderização do cartão
   */
  describe('renderização', () => {
    it('deve exibir informações do perfil corretamente', () => {
      render(
        <ProfileCard 
          profile={mockProfile}
          isAuthenticated={false}
          isOwnProfile={false}
          onStarGiven={mockOnStarGiven}
        />
      );

      // Verifica os elementos do perfil
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('0x123')).toBeInTheDocument();
      expect(screen.getByTestId('stars-count')).toHaveTextContent('5');
      expect(screen.getByText('https://github.com/test')).toBeInTheDocument();
    });

    it('deve exibir botão de estrela quando autenticado', () => {
      render(
        <ProfileCard 
          profile={mockProfile}
          isAuthenticated={true}
          isOwnProfile={false}
          onStarGiven={mockOnStarGiven}
        />
      );

      expect(screen.getByTestId('give-star-button')).toBeInTheDocument();
    });

    it('não deve exibir botão de estrela quando não autenticado', () => {
      render(
        <ProfileCard 
          profile={mockProfile}
          isAuthenticated={false}
          isOwnProfile={false}
          onStarGiven={mockOnStarGiven}
        />
      );

      expect(screen.queryByTestId('give-star-button')).not.toBeInTheDocument();
    });

    it('deve desabilitar botão de estrela para perfil próprio', () => {
      render(
        <ProfileCard 
          profile={mockProfile}
          isAuthenticated={true}
          isOwnProfile={true}
          onStarGiven={mockOnStarGiven}
        />
      );

      const starButton = screen.getByTestId('give-star-button');
      expect(starButton).toBeDisabled();
    });
  });

  /**
   * Testa a interação de dar estrela
   */
  describe('dar estrela', () => {
    it('deve chamar serviço ao dar estrela', async () => {
      const mockOnStarGiven = jest.fn();
      render(
        <BrowserRouter>
          <ProfileCard 
            profile={mockProfile} 
            onStarGiven={mockOnStarGiven} 
            isAuthenticated={true}
            isOwnProfile={false}
          />
        </BrowserRouter>
      );

      // Simula usuário autenticado
      (useGetIsLoggedIn as jest.Mock).mockReturnValue(true);
      (useGetAccountInfo as jest.Mock).mockReturnValue({ address: 'erd1...' });

      // Simula sucesso ao dar estrela
      (starChainService.giveStar as jest.Mock).mockResolvedValueOnce(undefined);

      // Clica no botão de estrela
      const starButton = screen.getByRole('button', { name: /dar estrela/i });
      await act(async () => {
        await userEvent.click(starButton);
      });

      // Verifica se o serviço foi chamado
      expect(starChainService.giveStar).toHaveBeenCalledWith(mockProfile.address);
      expect(mockOnStarGiven).toHaveBeenCalled();
    });

    it('deve desabilitar botão durante o envio', async () => {
      render(
        <ProfileCard 
          profile={mockProfile}
          isAuthenticated={true}
          isOwnProfile={false}
          onStarGiven={mockOnStarGiven}
        />
      );

      // Simula sucesso ao dar estrela com delay
      (starChainService.giveStar as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      // Clica no botão
      const starButton = screen.getByTestId('give-star-button');
      await userEvent.click(starButton);

      // Verifica se o botão está desabilitado
      expect(screen.getByText('Enviando...')).toBeDisabled();
    });

    it('deve exibir erro quando falha ao dar estrela', async () => {
      const error = new Error('Failed to give star');
      (starChainService.giveStar as jest.Mock).mockRejectedValue(error);

      render(
        <ProfileCard 
          profile={mockProfile}
          isAuthenticated={true}
          isOwnProfile={false}
          onStarGiven={mockOnStarGiven}
        />
      );

      // Clica no botão
      const starButton = screen.getByTestId('give-star-button');
      await userEvent.click(starButton);

      // Verifica mensagem de erro
      expect(await screen.findByTestId('error-message')).toHaveTextContent('Erro ao dar estrela. Tente novamente.');
      expect(mockOnStarGiven).not.toHaveBeenCalled();
    });
  });
}); 