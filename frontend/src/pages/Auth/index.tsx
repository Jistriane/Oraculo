import React, { useEffect, useState } from 'react';
import { ExtensionLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from '@multiversx/sdk-dapp/UI';
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useGetIsLoggedIn } from '../../hooks';
import { LoginForm } from '../../components/LoginForm';
import { networkConfig } from '../../config';
import { mvxConfig } from '../../config/mvx';

// Declaração de tipo para a extensão MultiversX
declare global {
  interface Window {
    elrond: {
      isConnected: () => Promise<boolean>;
      login: () => Promise<void>;
    };
  }
}

/**
 * Página de autenticação que permite aos usuários conectarem suas carteiras ou fazerem login com email.
 * 
 * Opções de Login:
 * - Email e Senha (principal)
 * - xPortal App
 * - MultiversX Wallet (Extensão)
 * - Web Wallet (xPortal Web)
 * 
 * Após o login bem-sucedido, o usuário é redirecionado para a página de perfil.
 * 
 * @example
 * ```tsx
 * <Route path="/auth" element={<AuthPage />} />
 * ```
 */
export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useGetIsLoggedIn();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useGetAccountInfo();
  const { loginMethod } = useGetLoginInfo();

  useEffect(() => {
    setError(null);
  }, [showWalletOptions]);

  const handleLoginSuccess = () => {
    try {
      navigate('/');
    } catch (error) {
      console.error('Erro ao processar login:', error);
      setError('Erro ao conectar carteira. Tente novamente.');
    }
  };

  const commonProps = {
    callbackUrl: window.location.origin,
    onLoginRedirect: handleLoginSuccess,
    nativeAuth: mvxConfig.nativeAuth.enabled,
    token: mvxConfig.nativeAuth.token,
    onSuccess: handleLoginSuccess,
    onError: (error: any) => {
      console.error('Erro na conexão:', error);
      setError('Erro ao conectar carteira. Tente novamente.');
    }
  };

  const webWalletProps = {
    ...commonProps,
    loginButtonText: 'Conectar com Web Wallet',
    className: 'w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
    callbackRoute: '/',
    redirectAfterSign: false,
    shouldRenderDefaultCss: false
  };

  const xPortalProps = {
    ...commonProps,
    loginButtonText: 'Conectar com xPortal App',
    projectId: mvxConfig.walletConnect.projectId,
    relayUrl: mvxConfig.walletConnect.relayUrl,
    isWalletConnectV2: true,
    className: 'w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
  };

  const extensionProps = {
    ...commonProps,
    loginButtonText: 'Conectar com MultiversX Wallet',
    className: 'w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    shouldRenderDefaultCss: false,
    nativeAuth: true,
    callbackRoute: '/',
    redirectAfterSign: false
  };

  useEffect(() => {
    if (isLoggedIn && address) {
      navigate('/');
    }
  }, [isLoggedIn, address, navigate]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          Bem-vindo ao StarChain Identity
        </h1>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {showWalletOptions ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Conectar Carteira</h2>
            
            <div>
              <WalletConnectLoginButton {...xPortalProps} />
            </div>

            <div>
              <ExtensionLoginButton {...extensionProps} />
            </div>

            <div>
              <WebWalletLoginButton {...webWalletProps} />
            </div>

            <button
              onClick={() => setShowWalletOptions(false)}
              className="mt-4 text-sm text-primary hover:text-primary/90 w-full text-center"
            >
              Voltar para login com email
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {isRegistering ? 'Criar Conta' : 'Login com Email'}
            </h2>
            
            <LoginForm 
              onSuccess={() => navigate('/')} 
              isRegistering={isRegistering}
            />
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary hover:text-primary/90 text-sm"
              >
                {isRegistering 
                  ? 'Já possui conta? Faça login' 
                  : 'Não possui conta? Cadastre-se'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <button
              onClick={() => setShowWalletOptions(true)}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Conectar com Carteira MultiversX
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Por que se conectar?</h2>
            <ul className="text-gray-600 space-y-2">
              <li>Conecte-se à comunidade</li>
              <li>Compartilhe seus links</li>
              <li>Receba estrelas</li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>
              Você pode usar email e senha ou conectar sua carteira MultiversX.
            </p>
            <p className="mt-2">
              Ambos os métodos são seguros e permitem acesso completo à plataforma.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 