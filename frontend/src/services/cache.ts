import { CACHE_CONFIG } from '../config';

/**
 * Interface que representa um item no cache
 */
interface CacheItem<T> {
  /** Dados armazenados */
  data: T;
  /** Timestamp de quando o item expira */
  expiresAt: number;
}

/**
 * Serviço responsável pelo gerenciamento de cache da aplicação.
 * Utiliza localStorage para persistência e implementa sistema de expiração.
 */
class CacheService {
  /**
   * Armazena um valor no cache.
   * @param key Chave única para identificar o item
   * @param value Valor a ser armazenado
   * @param ttl Tempo de vida em milissegundos (opcional)
   */
  set<T>(key: string, value: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data: value,
      expiresAt: Date.now() + ttl
    };

    try {
      localStorage.setItem(
        CACHE_CONFIG.KEY_PREFIX + key,
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Erro ao escrever no cache:', error);
    }
  }

  /**
   * Recupera um valor do cache.
   * @param key Chave do item
   * @returns O valor armazenado ou null se não encontrado/expirado
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(CACHE_CONFIG.KEY_PREFIX + key);
      if (!raw) return null;

      const item: CacheItem<T> = JSON.parse(raw);
      
      if (Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return null;
    }
  }

  /**
   * Remove um item específico do cache.
   * @param key Chave do item a ser removido
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(CACHE_CONFIG.KEY_PREFIX + key);
    } catch (error) {
      console.error('Erro ao remover do cache:', error);
    }
  }

  /**
   * Limpa todo o cache da aplicação.
   * Remove todos os itens que começam com o prefixo definido.
   */
  clear(): void {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_CONFIG.KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }
}

export const cacheService = new CacheService(); 