import React from 'react';
import { dAppName } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{dAppName}</h3>
            <p className="text-gray-400">Identidade Digital na Blockchain</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <a
              href="https://multiversx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              MultiversX
            </a>
            <a
              href="https://docs.multiversx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              Documentação
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} {dAppName}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
