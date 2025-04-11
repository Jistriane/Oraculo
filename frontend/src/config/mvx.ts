import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { networkConfig } from './index';

/**
 * Configurações do SDK MultiversX
 */
export const mvxConfig = {
  environment: networkConfig.id as EnvironmentsEnum,
  chainType: 'devnet',
  walletConnectV2ProjectId: import.meta.env.VITE_WALLET_CONNECT_ID,
  apiTimeout: networkConfig.apiTimeout,
  walletConnectDeepLink: 'https://maiar.page.link/?apn=com.multiversx.maiar.wallet&isi=1519405832&ibi=com.multiversx.maiar.wallet&link=https://maiar.com/',
  nativeAuth: {
    enabled: true,
    token: 'starchain',
    expirySeconds: 3600,
    blockHashSizeInBytes: 32,
    signedMessagePrefix: 'StarChain Identity*',
  },
  walletConnect: {
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID,
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'StarChain Identity',
      description: 'Plataforma de identidade descentralizada na rede MultiversX',
      url: window.location.origin,
      icons: [`${window.location.origin}/logo.png`]
    }
  }
}; 