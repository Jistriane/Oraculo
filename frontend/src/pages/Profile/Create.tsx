import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { apiService } from '../../services/api';

interface ProfileCreateState {
  address?: string;
  name?: string;
  links?: string[];
}

export const ProfileCreatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, name: initialName, links: initialLinks } = (location.state as ProfileCreateState) || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(initialName || '');
  const [links, setLinks] = useState<string[]>(initialLinks || []);
  const [newLink, setNewLink] = useState('');

  // Adiciona um novo link à lista
  const handleAddLink = () => {
    if (newLink && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  // Remove um link da lista
  const handleRemoveLink = (linkToRemove: string) => {
    setLinks(links.filter(link => link !== linkToRemove));
  };

  // Envia o formulário para criar o perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!address) {
        throw new Error('Endereço da carteira não encontrado');
      }

      await apiService.createProfile({
        address,
        name,
        links
      });

      // Redireciona para a página de perfil após criar com sucesso
      navigate('/profile');
    } catch (err: any) {
      console.error('Erro ao criar perfil:', err);
      setError(err.message || 'Erro ao criar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-red-100 p-4 rounded-md text-red-700">
            Endereço da carteira não encontrado. Por favor, faça login novamente.
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Voltar para Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          Criar Perfil
        </h1>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Links
            </label>
            <div className="mt-1 space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 truncate">{link}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://exemplo.com"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Adicionar Link
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Criando...' : 'Criar Perfil'}
          </button>
        </form>
      </div>
    </Layout>
  );
}; 