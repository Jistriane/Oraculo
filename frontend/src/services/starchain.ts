import { Address, Query, StringValue } from '@multiversx/sdk-core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';
import { contractAddress, networkConfig } from '../config';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { cacheService } from './cache';

/**
 * Erros específicos do serviço StarChain
 */
export class StarChainError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StarChainError';
  }
}

/**
 * Interface que representa um perfil de usuário no sistema StarChain.
 */
interface Profile {
  /** Endereço da carteira do usuário */
  address: string;
  /** Nome do usuário */
  name: string;
  /** Lista de links associados ao perfil */
  links: string[];
  /** Número de estrelas recebidas */
  stars: number;
}

/**
 * Serviço responsável por interagir com o smart contract StarChain.
 * Gerencia operações como criação de perfil, atribuição de estrelas e consultas.
 */
class StarChainService {
  /** Chaves para o sistema de cache */
  private readonly CACHE_KEYS = {
    /** Gera a chave de cache para um perfil específico */
    PROFILE: (address: string) => `profile_${address}`,
    /** Gera a chave de cache para uma lista de perfis top */
    TOP_PROFILES: (limit: number) => `top_profiles_${limit}`
  };

  /** Número máximo de tentativas para requisições à API */
  private readonly MAX_RETRIES = 3;
  /** Tempo de espera entre tentativas (em ms) */
  private readonly RETRY_DELAY = 1000;

  /**
   * Executa uma requisição com retry em caso de falha.
   * @param fn Função a ser executada
   * @param retries Número de tentativas restantes
   * @returns Resultado da função
   * @private
   */
  private async withRetry<T>(fn: () => Promise<T>, retries = this.MAX_RETRIES): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.withRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  private async checkAuthentication(): Promise<string> {
    const account = await refreshAccount();
    if (!account?.address) {
      throw new StarChainError('Usuário não autenticado. Por favor, conecte sua carteira.', 'AUTH_REQUIRED');
    }
    return account.address;
  }

  /**
   * Cria um novo perfil no sistema.
   * @param name Nome do usuário
   * @param links Lista de links associados ao perfil
   * @throws {Error} Se a transação falhar
   */
  async createProfile(name: string, links: string[]) {
    try {
      // Verifica autenticação
      await this.checkAuthentication();

      // Valida parâmetros
      if (!name.trim()) {
        throw new StarChainError('Nome é obrigatório', 'INVALID_NAME');
      }

      // Valida links
      const validLinks = links.filter(link => {
        try {
          new URL(link);
          return true;
        } catch {
          return false;
        }
      });

      // Prepara dados para o smart contract
      const data = Buffer.from(`createProfile@${name}@${validLinks.join('@')}`).toString('hex');
      
      // Envia transação
      await sendTransactions({
        value: '0',
        data,
        receiver: contractAddress,
        gasLimit: 60000000
      });
      
      // Atualiza estado
      await refreshAccount();
      cacheService.remove(this.CACHE_KEYS.PROFILE(await this.getCurrentAddress()));
    } catch (error: any) {
      console.error('Erro ao criar perfil:', error);
      
      if (error instanceof StarChainError) {
        throw error;
      }

      // Mapeia erros conhecidos do MultiversX
      if (error.message?.includes('insufficient funds')) {
        throw new StarChainError('Saldo insuficiente para criar o perfil', 'INSUFFICIENT_FUNDS');
      }
      
      if (error.message?.includes('Profile already exists')) {
        throw new StarChainError('Você já possui um perfil', 'PROFILE_EXISTS');
      }

      throw new StarChainError('Erro ao criar perfil. Tente novamente.', 'CREATE_PROFILE_ERROR');
    }
  }

  /**
   * Atribui uma estrela a um perfil.
   * @param to Endereço do perfil que receberá a estrela
   * @throws {Error} Se a transação falhar
   */
  async giveStar(to: string) {
    const data = Buffer.from(`giveStar@${new Address(to).hex()}`).toString('hex');
    
    await sendTransactions({
      value: '0',
      data,
      receiver: contractAddress,
      gasLimit: 60000000
    });
    
    await refreshAccount();
    cacheService.remove(this.CACHE_KEYS.PROFILE(to));
    cacheService.clear(); // Limpa todo o cache pois o ranking pode ter mudado
  }

  /**
   * Obtém o endereço da carteira atualmente conectada.
   * @returns Endereço da carteira
   * @private
   */
  private async getCurrentAddress(): Promise<string> {
    const account = await refreshAccount();
    if (!account) {
      throw new Error('Nenhuma conta conectada');
    }
    return account.address;
  }

  /**
   * Busca os dados de um perfil específico.
   * @param address Endereço do perfil
   * @returns Dados do perfil ou null se não encontrado
   */
  async getProfile(address: string): Promise<Profile | null> {
    const cacheKey = this.CACHE_KEYS.PROFILE(address);
    const cachedProfile = cacheService.get<Profile>(cacheKey);
    
    if (cachedProfile) {
      return cachedProfile;
    }

    const query = new Query({
      address: new Address(contractAddress),
      func: 'getProfile',
      args: [new StringValue(new Address(address).hex())]
    });

    try {
      const networkProvider = new ApiNetworkProvider(networkConfig.apiAddress);
      const response = await this.withRetry(() => networkProvider.queryContract(query));
      
      if (!response || !response.returnData || response.returnData.length === 0) {
        return null;
      }

      const [name, links, stars] = response.returnData.map((data: string) => Buffer.from(data, 'base64').toString());
      
      const profile: Profile = {
        address,
        name,
        links: links.split('@'),
        stars: parseInt(stars)
      };

      cacheService.set(cacheKey, profile);
      return profile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Busca a lista dos perfis mais bem avaliados.
   * @param limit Número máximo de perfis a retornar
   * @returns Lista de perfis ordenada por número de estrelas
   */
  async getTopProfiles(limit: number): Promise<Profile[]> {
    if (!contractAddress) {
      console.warn('[StarChain] Aviso de Desenvolvimento: Endereço do contrato não configurado');
      console.info('[StarChain] Configure VITE_CONTRACT_ADDRESS no arquivo .env');
      return [];
    }

    if (!networkConfig.apiAddress) {
      console.error('[StarChain] Erro: Endereço da API não configurado');
      return [];
    }

    const cacheKey = this.CACHE_KEYS.TOP_PROFILES(limit);
    const cachedProfiles = cacheService.get<Profile[]>(cacheKey);
    
    if (cachedProfiles) {
      console.debug('[StarChain] Retornando perfis do cache');
      return cachedProfiles;
    }

    console.info('[StarChain] Consultando contrato:', {
      address: contractAddress,
      func: 'getTopProfiles',
      limit,
      network: networkConfig.id,
      api: networkConfig.apiAddress
    });

    const query = new Query({
      address: new Address(contractAddress),
      func: 'getTopProfiles',
      args: [new StringValue(limit.toString())]
    });

    try {
      const networkProvider = new ApiNetworkProvider(networkConfig.apiAddress);
      console.info('[StarChain] Iniciando consulta ao contrato...');
      const response = await this.withRetry(() => networkProvider.queryContract(query));
      
      console.debug('[StarChain] Resposta do contrato:', response);
      
      if (!response) {
        console.error('[StarChain] Resposta vazia do contrato');
        return [];
      }

      if (!response.returnData) {
        console.error('[StarChain] Dados de retorno ausentes na resposta');
        return [];
      }

      if (response.returnData.length === 0) {
        console.info('[StarChain] Nenhum perfil encontrado');
        return [];
      }

      const profiles: Profile[] = [];
      for (let i = 0; i < response.returnData.length; i += 4) {
        try {
          const address = Buffer.from(response.returnData[i], 'base64').toString();
          const name = Buffer.from(response.returnData[i + 1], 'base64').toString();
          const links = Buffer.from(response.returnData[i + 2], 'base64').toString().split('@');
          const stars = parseInt(Buffer.from(response.returnData[i + 3], 'base64').toString());

          profiles.push({ address, name, links, stars });
        } catch (error) {
          console.error('[StarChain] Erro ao processar perfil:', error);
          continue;
        }
      }

      cacheService.set(cacheKey, profiles);
      return profiles;
    } catch (error: unknown) {
      console.error('[StarChain] Erro ao buscar perfis top:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorWithResponse = error as { response: { status: number; data: unknown } };
        console.error('[StarChain] Detalhes do erro:', {
          status: errorWithResponse.response.status,
          data: errorWithResponse.response.data,
          contract: contractAddress,
          network: networkConfig.id,
          api: networkConfig.apiAddress
        });
      }
      return [];
    }
  }
}

export const starChainService = new StarChainService(); 