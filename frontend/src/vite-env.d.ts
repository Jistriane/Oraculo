/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_WALLET_CONNECT_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_GATEWAY_URL: string;
  readonly VITE_EXPLORER_URL: string;
  readonly VITE_CONTRACT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 