import { starChainService } from '../starchain';
import { cacheService } from '../cache';
import { sendTransaction, Query } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress, networkConfig } from '../../config';

// Mock dos serviços
jest.mock('@multiversx/sdk-dapp/services', () => ({
  sendTransaction: jest.fn(),
  Query: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({
      returnData: [],
      returnCode: 'ok'
    })
  }))
}));

jest.mock('@multiversx/sdk-dapp/utils');
jest.mock('../cache');

// Endereços de teste válidos do MultiversX
const TEST_ADDRESS = 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th';
const TEST_ADDRESS_2 = 'erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx';

/**
 * Testes unitários para o serviço StarChain.
 * Verifica as interações com o smart contract e o cache.
 */
describe('StarChainService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cacheService.clear as jest.Mock).mockClear();
  });

  /**
   * Testa a criação de perfil
   */
  describe('createProfile', () => {
    it('deve criar um perfil com sucesso', async () => {
      const name = 'Test User';
      const links = ['https://github.com'];

      await starChainService.createProfile(name, links);

      expect(sendTransaction).toHaveBeenCalledWith({
        value: '0',
        data: expect.any(String),
        receiver: contractAddress,
        gasLimit: expect.any(Number)
      });
      expect(refreshAccount).toHaveBeenCalled();
    });

    it('deve propagar erros da transação', async () => {
      const error = new Error('Transaction failed');
      (sendTransaction as jest.Mock).mockRejectedValue(error);

      await expect(
        starChainService.createProfile('Test', ['https://github.com'])
      ).rejects.toThrow(error);
    });
  });

  /**
   * Testa a funcionalidade de dar estrela
   */
  describe('giveStar', () => {
    it('deve dar estrela com sucesso', async () => {
      const address = '0x123';

      await starChainService.giveStar(address);

      expect(sendTransaction).toHaveBeenCalledWith({
        value: '0',
        data: expect.any(String),
        receiver: contractAddress,
        gasLimit: expect.any(Number)
      });
      expect(refreshAccount).toHaveBeenCalled();
    });

    it('deve propagar erros da transação', async () => {
      const error = new Error('Transaction failed');
      (sendTransaction as jest.Mock).mockRejectedValue(error);

      await expect(
        starChainService.giveStar('0x123')
      ).rejects.toThrow(error);
    });
  });

  /**
   * Testa a busca de perfil
   */
  describe('getProfile', () => {
    it('deve retornar perfil do cache se disponível', async () => {
      const profile = { address: '0x123', name: 'Test', stars: 5 };
      jest.spyOn(cacheService, 'get').mockReturnValue(profile);

      const result = await starChainService.getProfile('0x123');
      expect(result).toEqual(profile);
    });

    it('deve buscar perfil do blockchain se não estiver no cache', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      
      const result = await starChainService.getProfile('0x123');
      
      expect(Query).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('deve retornar null se o perfil não existir', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      (Query as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue({
          returnData: [],
          returnCode: 'profile_not_found'
        })
      }));

      const result = await starChainService.getProfile('0x123');
      expect(result).toBeNull();
    });
  });

  /**
   * Testa a busca de ranking
   */
  describe('getTopProfiles', () => {
    it('deve retornar ranking do cache se disponível', async () => {
      const profiles = [
        { address: '0x123', name: 'Test', stars: 5 }
      ];
      jest.spyOn(cacheService, 'get').mockReturnValue(profiles);

      const result = await starChainService.getTopProfiles(10);
      expect(result).toEqual(profiles);
    });

    it('deve buscar ranking do blockchain se não estiver no cache', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      
      const result = await starChainService.getTopProfiles(10);
      
      expect(Query).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('deve retornar array vazio se não houver perfis', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      (Query as jest.Mock).mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue({
          returnData: [],
          returnCode: 'ok'
        })
      }));

      const result = await starChainService.getTopProfiles(10);
      expect(result).toEqual([]);
    });
  });
}); 