import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '@multiversx/sdk-dapp/utils';
import { dAppName } from '../config';

interface NavbarProps {
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            {dAppName}
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/ranking" className="text-gray-600 hover:text-gray-800">
              Ranking
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Conectar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 