import { Profile } from '../types';

const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

export const apiService = {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao fazer login',
        };
      }

      return {
        success: true,
        data: data.user,
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return {
        success: false,
        message: 'Erro ao fazer login. Tente novamente.',
      };
    }
  },

  async register(email: string, password: string) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erro ao fazer registro',
        };
      }

      // Faz login automático após registro bem-sucedido
      const loginResponse = await this.login(email, password);
      if (!loginResponse.success) {
        return {
          success: false,
          message: 'Registro realizado, mas houve erro ao fazer login automático',
        };
      }

      return {
        success: true,
        data: data.user,
      };
    } catch (error) {
      console.error('Erro ao fazer registro:', error);
      return {
        success: false,
        message: 'Erro ao fazer registro. Tente novamente.',
      };
    }
  },

  /**
   * Cria um novo perfil
   * @param profile Dados do perfil a ser criado
   * @returns Promise com a resposta da API
   */
  async createProfile(profile: Profile) {
    try {
      const response = await fetch(`${baseUrl}/api/profile/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    }
  },

  /**
   * Busca um perfil pelo endereço
   * @param address Endereço da carteira
   * @returns Promise com os dados do perfil
   */
  async getProfile(address: string) {
    try {
      const response = await fetch(`${baseUrl}/api/profile/${address}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  /**
   * Atualiza um perfil existente
   * @param address Endereço da carteira
   * @param profile Dados do perfil a serem atualizados
   * @returns Promise com a resposta da API
   */
  async updateProfile(address: string, profile: Partial<Profile>) {
    try {
      const response = await fetch(`${baseUrl}/api/profile/${address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  /**
   * Deleta um perfil
   * @param address Endereço da carteira
   * @returns Promise com a resposta da API
   */
  async deleteProfile(address: string) {
    try {
      const response = await fetch(`${baseUrl}/api/profile/${address}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar perfil');
      }
    } catch (error) {
      console.error('Erro ao deletar perfil:', error);
      throw error;
    }
  },
}; 