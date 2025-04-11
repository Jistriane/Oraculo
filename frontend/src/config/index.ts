/**
 * Endereço do smart contract no blockchain.
 * Obtido através de variável de ambiente.
 */
export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

/**
 * Configuração da rede MultiversX.
 * Define os endpoints e configurações específicas da rede.
 * 
 * Valores possíveis para id:
 * - 'devnet': Rede de desenvolvimento
 * - 'testnet': Rede de testes
 * - 'mainnet': Rede principal
 */
export const networkConfig = {
  /** Identificador da rede */
  id: import.meta.env.VITE_ENVIRONMENT || 'devnet',
  /** Nome da rede */
  name: import.meta.env.VITE_ENVIRONMENT === 'mainnet' ? 'Mainnet' : 
        import.meta.env.VITE_ENVIRONMENT === 'testnet' ? 'Testnet' : 'Devnet',
  /** Símbolo da moeda nativa */
  egldLabel: import.meta.env.VITE_ENVIRONMENT === 'mainnet' ? 'EGLD' : 'xEGLD',
  /** Número de casas decimais */
  decimals: '18',
  /** Número de dígitos para exibição */
  digits: '4',
  /** Custo de gas por byte de dados */
  gasPerDataByte: '1500',
  /** Endereço da carteira web */
  walletAddress: import.meta.env.VITE_WALLET_URL || 
    (import.meta.env.VITE_ENVIRONMENT === 'mainnet' 
      ? 'https://wallet.multiversx.com'
      : import.meta.env.VITE_ENVIRONMENT === 'testnet'
        ? 'https://testnet-wallet.multiversx.com'
        : 'https://devnet-wallet.multiversx.com'),
  /** Endereço da API */
  apiAddress: import.meta.env.VITE_API_URL || 
    (import.meta.env.VITE_ENVIRONMENT === 'mainnet'
      ? 'https://api.multiversx.com'
      : import.meta.env.VITE_ENVIRONMENT === 'testnet'
        ? 'https://testnet-api.multiversx.com'
        : 'https://devnet-api.multiversx.com'),
  /** Endereço do gateway */
  gatewayAddress: import.meta.env.VITE_GATEWAY_URL || 
    (import.meta.env.VITE_ENVIRONMENT === 'mainnet'
      ? 'https://gateway.multiversx.com'
      : import.meta.env.VITE_ENVIRONMENT === 'testnet'
        ? 'https://testnet-gateway.multiversx.com'
        : 'https://devnet-gateway.multiversx.com'),
  /** Endereço do explorador */
  explorerAddress: import.meta.env.VITE_EXPLORER_URL || 
    (import.meta.env.VITE_ENVIRONMENT === 'mainnet'
      ? 'https://explorer.multiversx.com'
      : import.meta.env.VITE_ENVIRONMENT === 'testnet'
        ? 'https://testnet-explorer.multiversx.com'
        : 'https://devnet-explorer.multiversx.com'),
  /** Timeout da API em milissegundos */
  apiTimeout: 10000,
  chainId: import.meta.env.VITE_ENVIRONMENT === 'mainnet' ? 'M' : 'D'
};

/**
 * ID do projeto no WalletConnect.
 * Necessário para integração com carteiras móveis.
 */
export const walletConnectV2ProjectId = import.meta.env.VITE_WALLET_CONNECT_ID || '';

/**
 * Nome da aplicação descentralizada.
 * Usado em diversos lugares da interface.
 */
export const dAppName = 'StarChain Identity';

/**
 * Configuração do cache.
 * Define prefixos e tempos de expiração.
 */
export const CACHE_CONFIG = {
  /** Prefixo para chaves do cache */
  prefix: 'starchain_',
  /** Tempo de expiração padrão em segundos */
  defaultTtl: 3600, // 1 hora
  /** Tempo de expiração para dados de perfil */
  profileTtl: 300, // 5 minutos
  /** Tempo de expiração para dados de ranking */
  rankingTtl: 60 // 1 minuto
}; 