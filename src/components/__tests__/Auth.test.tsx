import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthPage from '../components/AuthPage';

describe('Auth', () => {
  it('deve exibir botões de conexão', () => {
    render(<AuthPage />);
    const xPortalButtons = screen.queryAllByText('xPortal App');
    const walletConnectButtons = screen.queryAllByText('Wallet Connect');
    const webWalletButtons = screen.queryAllByText('Web Wallet');
    
    // Verifica se pelo menos um botão de cada tipo está presente
    expect(xPortalButtons.length).toBeGreaterThan(0);
    expect(walletConnectButtons.length).toBeGreaterThan(0);
    expect(webWalletButtons.length).toBeGreaterThan(0);
  });
}); 