import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { NotificationModal, SignTransactionsModals, TransactionsToastList } from '@multiversx/sdk-dapp/UI';
import { networkConfig, walletConnectV2ProjectId } from './config';
import App from './App';
import './index.css';

// Polyfill para o objeto Buffer
if (typeof window !== 'undefined' && !(window as any).Buffer) {
  (window as any).Buffer = require('buffer').Buffer;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DappProvider
        environment={networkConfig.id}
        customNetworkConfig={{
          ...networkConfig,
          walletConnectV2ProjectId,
          walletConnectDeepLink: undefined,
          walletConnectBridgeAddresses: undefined
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
          logoutRoute: '/unlock',
          walletConnectV2Relay: 'wss://relay.walletconnect.com',
          walletConnectV2ProjectId: walletConnectV2ProjectId
        }}
      >
        <App />
        <NotificationModal />
        <SignTransactionsModals />
        <TransactionsToastList />
      </DappProvider>
    </BrowserRouter>
  </React.StrictMode>
); 