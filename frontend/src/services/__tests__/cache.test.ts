import { cacheService } from '../cache';
import { CACHE_CONFIG } from '../../config';

/**
 * Testes unitários para o serviço de cache.
 * Verifica o funcionamento do armazenamento e recuperação de dados.
 */
describe('CacheService', () => {
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStorage[key];
        },
        clear: () => {
          mockStorage = {};
        }
      },
      writable: true
    });
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('deve armazenar valor com prefixo e TTL padrão', () => {
      const key = 'test';
      const value = { data: 'test' };
      
      cacheService.set(key, value);
      
      const stored = localStorage.getItem(CACHE_CONFIG.KEY_PREFIX + key);
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.data).toEqual(value);
      expect(parsed.expiresAt).toBeGreaterThan(Date.now());
    });
  });

  describe('get', () => {
    it('deve retornar null para chave inexistente', () => {
      expect(cacheService.get('nonexistent')).toBeNull();
    });

    it('deve retornar valor válido', () => {
      const key = 'test';
      const value = { data: 'test' };
      
      const item = {
        data: value,
        expiresAt: Date.now() + CACHE_CONFIG.DEFAULT_TTL
      };
      
      localStorage.setItem(
        CACHE_CONFIG.KEY_PREFIX + key,
        JSON.stringify(item)
      );
      
      const result = cacheService.get(key);
      expect(result).toEqual(value);
    });

    it('deve retornar null para valor expirado', () => {
      const key = 'test';
      const value = { data: 'test' };
      const ttl = -1; // Já expirado
      
      cacheService.set(key, value, ttl);
      
      expect(cacheService.get(key)).toBeNull();
    });
  });

  describe('remove', () => {
    it('deve remover item do cache', () => {
      const key = 'test';
      const value = { data: 'test' };
      
      const item = {
        data: value,
        expiresAt: Date.now() + CACHE_CONFIG.DEFAULT_TTL
      };
      
      localStorage.setItem(
        CACHE_CONFIG.KEY_PREFIX + key,
        JSON.stringify(item)
      );
      
      cacheService.remove(key);
      
      const stored = localStorage.getItem(CACHE_CONFIG.KEY_PREFIX + key);
      expect(stored).toBeNull();
    });
  });

  describe('clear', () => {
    it('deve limpar apenas itens com prefixo correto', () => {
      const key = 'test1';
      const value = { data: 'value1' };
      
      const item = {
        data: value,
        expiresAt: Date.now() + CACHE_CONFIG.DEFAULT_TTL
      };
      
      // Item com prefixo
      localStorage.setItem(
        CACHE_CONFIG.KEY_PREFIX + key,
        JSON.stringify(item)
      );
      
      // Item sem prefixo
      localStorage.setItem('other', 'value2');
      
      cacheService.clear();
      
      const storedWithPrefix = localStorage.getItem(CACHE_CONFIG.KEY_PREFIX + key);
      const storedWithoutPrefix = localStorage.getItem('other');
      
      expect(storedWithPrefix).toBeNull();
      expect(storedWithoutPrefix).toBe('value2');
    });
  });

  /**
   * Testa o tratamento de erros
   */
  describe('tratamento de erros', () => {
    it('deve retornar null quando o JSON armazenado é inválido', () => {
      localStorage.setItem(CACHE_CONFIG.KEY_PREFIX + 'test', 'invalid json');
      expect(cacheService.get('test')).toBeNull();
    });

    it('deve lidar com erros de localStorage indisponível', () => {
      const error = new Error('Storage not available');
      const mockStorage = {
        getItem: jest.fn(() => { throw error; }),
        setItem: jest.fn(() => { throw error; }),
        removeItem: jest.fn(() => { throw error; }),
        clear: jest.fn(() => { throw error; }),
        length: 0,
        key: jest.fn()
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true
      });

      expect(() => cacheService.set('test', 'value')).not.toThrow();
      expect(cacheService.get('test')).toBeNull();
      expect(() => cacheService.remove('test')).not.toThrow();
      expect(() => cacheService.clear()).not.toThrow();
    });
  });
}); 