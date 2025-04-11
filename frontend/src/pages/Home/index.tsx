import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao StarChain Identity
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Uma plataforma descentralizada para gerenciar sua identidade e reputação na blockchain
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Crie seu Perfil
            </h2>
            <p className="text-gray-600 mb-4">
              Estabeleça sua presença na blockchain com um perfil único e verificável
            </p>
            <Link to="/profile" className="btn btn-primary">
              Começar
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Dê Estrelas
            </h2>
            <p className="text-gray-600 mb-4">
              Reconheça outros usuários dando estrelas para seus perfis
            </p>
            <Link to="/ranking" className="btn btn-primary">
              Ver Ranking
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Construa Reputação
            </h2>
            <p className="text-gray-600 mb-4">
              Acumule estrelas e construa sua reputação na comunidade
            </p>
            <Link to="/profile" className="btn btn-primary">
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 