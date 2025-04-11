import React, { useCallback, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RouteNamesEnum } from '../../routes/routeNames';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';
import { ExtensionLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from '@multiversx/sdk-dapp/UI';
import { dAppName } from '../../config';
import { useGetIsLoggedIn } from '../../hooks';

/**
 * Componente que exibe o logo e nome da aplicação
 */
const NavbarBrand = memo(() => (
  <Link 
    to={RouteNamesEnum.HOME} 
    className="flex items-center"
    aria-label="Ir para página inicial"
  >
    <span className="text-xl font-bold">{dAppName}</span>
  </Link>
));

NavbarBrand.displayName = 'NavbarBrand';

/**
 * Componente que exibe o endereço da carteira e botão de desconexão
 */
const WalletInfo = memo(({ address, onLogout }: { address: string; onLogout: () => void }) => (
  <div className="flex items-center" role="status" aria-label="Informações da carteira">
    <span className="text-sm text-gray-600 mr-4" title={address}>
      {formatAddress(address)}
    </span>
    <button
      onClick={onLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
      aria-label="Desconectar carteira"
    >
      Desconectar
    </button>
  </div>
));

WalletInfo.displayName = 'WalletInfo';

const ConnectWallet = memo(() => {
  const [showButtons, setShowButtons] = useState(false);
  const commonButtonClasses = "w-full mb-2 px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors";

  return (
    <div className="relative">
      <button
        onClick={() => setShowButtons(!showButtons)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        Conectar Carteira
      </button>

      {showButtons && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 z-50">
          <ExtensionLoginButton
            callbackRoute={RouteNamesEnum.DASHBOARD}
            className={`${commonButtonClasses} bg-purple-500 hover:bg-purple-600 focus:ring-purple-500`}
            loginButtonText="MultiversX DeFi Wallet"
          />
          <WebWalletLoginButton
            callbackRoute={RouteNamesEnum.DASHBOARD}
            className={`${commonButtonClasses} bg-blue-500 hover:bg-blue-600 focus:ring-blue-500`}
            loginButtonText="Web Wallet"
          />
          <WalletConnectLoginButton
            callbackRoute={RouteNamesEnum.DASHBOARD}
            className={`${commonButtonClasses} bg-green-500 hover:bg-green-600 focus:ring-green-500`}
            loginButtonText="Maiar App"
          />
        </div>
      )}
    </div>
  );
});

ConnectWallet.displayName = 'ConnectWallet';

/**
 * Formata o endereço da carteira para exibição.
 * Mostra apenas os primeiros e últimos caracteres.
 */
const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Componente principal da barra de navegação
 */
export const Navbar: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();

  const handleLogout = useCallback(() => {
    logout(`${window.location.origin}${RouteNamesEnum.HOME}`);
  }, []);

  return (
    <nav className="bg-white shadow-lg" role="navigation" aria-label="Navegação principal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavbarBrand />
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <WalletInfo address={address} onLogout={handleLogout} />
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavbarComponent = memo(Navbar);
export default NavbarComponent; 