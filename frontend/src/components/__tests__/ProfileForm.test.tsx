import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfileForm } from '../ProfileForm';
import { starChainService } from '../../services/starchain';

// Mock do serviço
jest.mock('../../services/starchain', () => ({
  starChainService: {
    createProfile: jest.fn()
  }
}));

/**
 * Testes unitários para o componente ProfileForm.
 * Verifica o comportamento do formulário de criação de perfil.
 */
describe('ProfileForm', () => {
  const renderWithRouter = (children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Testa a renderização inicial
   */
  describe('renderização', () => {
    it('deve renderizar todos os campos corretamente', () => {
      renderWithRouter(<ProfileForm />);

      // Verifica a presença dos elementos
      expect(screen.getByLabelText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Links')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Link')).toBeInTheDocument();
      expect(screen.getByText('Criar Perfil')).toBeInTheDocument();
    });
  });

  /**
   * Testa a validação do formulário
   */
  describe('validação', () => {
    it('deve exibir erro quando o nome está vazio', async () => {
      renderWithRouter(<ProfileForm />);

      // Submete o formulário sem preencher o nome
      fireEvent.submit(screen.getByRole('button', { name: 'Criar Perfil' }));

      // Verifica se a mensagem de erro é exibida
      expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });

  /**
   * Testa a manipulação de links
   */
  describe('manipulação de links', () => {
    it('deve adicionar novo campo de link', () => {
      renderWithRouter(<ProfileForm />);

      // Verifica se há um campo de link inicialmente
      const initialLinks = screen.getAllByPlaceholderText('https://...');
      expect(initialLinks).toHaveLength(1);

      // Adiciona um novo link
      fireEvent.click(screen.getByText('Adicionar Link'));

      // Verifica se um novo campo foi adicionado
      const updatedLinks = screen.getAllByPlaceholderText('https://...');
      expect(updatedLinks).toHaveLength(2);
    });

    it('deve remover campo de link', () => {
      renderWithRouter(<ProfileForm />);

      // Adiciona um novo link
      fireEvent.click(screen.getByText('Adicionar Link'));
      
      // Verifica se há dois campos
      const linksBeforeRemoval = screen.getAllByPlaceholderText('https://...');
      expect(linksBeforeRemoval).toHaveLength(2);

      // Remove o segundo link
      const removeButtons = screen.getAllByText('Remover');
      fireEvent.click(removeButtons[1]);

      // Verifica se voltou a ter apenas um campo
      const linksAfterRemoval = screen.getAllByPlaceholderText('https://...');
      expect(linksAfterRemoval).toHaveLength(1);
    });

    it('deve desabilitar remoção quando há apenas um link', () => {
      renderWithRouter(<ProfileForm />);

      // Verifica se o botão de remover está desabilitado quando há apenas um link
      const removeButton = screen.getByText('Remover');
      expect(removeButton).toBeDisabled();
    });
  });

  /**
   * Testa o envio do formulário
   */
  describe('envio do formulário', () => {
    it('deve criar perfil com sucesso', async () => {
      const onSuccess = jest.fn();
      renderWithRouter(<ProfileForm onSuccess={onSuccess} />);

      // Preenche o formulário
      fireEvent.change(screen.getByLabelText('Nome'), {
        target: { value: 'Test User' }
      });

      // Submete o formulário
      fireEvent.submit(screen.getByRole('button', { name: 'Criar Perfil' }));

      // Verifica se o serviço foi chamado corretamente
      await waitFor(() => {
        expect(starChainService.createProfile).toHaveBeenCalledWith('Test User', []);
      });

      // Verifica se o callback de sucesso foi chamado
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('deve exibir erro quando a criação falha', async () => {
      (starChainService.createProfile as jest.Mock).mockRejectedValue(new Error('Erro ao criar'));
      renderWithRouter(<ProfileForm />);

      // Preenche e submete o formulário
      fireEvent.change(screen.getByLabelText('Nome'), {
        target: { value: 'Test User' }
      });

      fireEvent.submit(screen.getByRole('button', { name: 'Criar Perfil' }));

      // Verifica se a mensagem de erro é exibida
      await waitFor(() => {
        expect(screen.getByText('Erro ao criar perfil. Tente novamente.')).toBeInTheDocument();
      });
    });

    it('deve desabilitar o botão durante o envio', async () => {
      renderWithRouter(<ProfileForm />);

      // Preenche o formulário
      fireEvent.change(screen.getByLabelText('Nome'), {
        target: { value: 'Test User' }
      });

      // Submete o formulário
      const submitButton = screen.getByRole('button', { name: 'Criar Perfil' });
      fireEvent.submit(submitButton);

      // Verifica se o botão está desabilitado
      expect(submitButton).toBeDisabled();

      // Aguarda o fim do envio
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});