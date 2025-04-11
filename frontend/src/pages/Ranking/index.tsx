import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { RankingTable } from '../../components/RankingTable';
import { starChainService } from '../../services/starchain';

/**
 * Interface que representa um perfil no ranking
 */
interface RankingProfile {
  /** Endereço da carteira do usuário */
  address: string;
  /** Nome do usuário */
  name: string;
  /** Número de estrelas recebidas */
  stars: number;
}

/**
 * Página que exibe o ranking dos usuários.
 * Lista os perfis ordenados por número de estrelas recebidas.
 * 
 * Funcionalidades:
 * - Carregamento automático dos perfis
 * - Atualização após dar estrela
 * - Exibição de estado de carregamento
 * - Tratamento de erros
 * 
 * @example
 * ```tsx
 * <Route path="/ranking" element={<RankingPage />} />
 * ```
 */
export const RankingPage: React.FC = () => {
  const [profiles, setProfiles] = useState<RankingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega a lista de perfis do ranking.
   * Busca os top 100 perfis ordenados por estrelas.
   */
  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await starChainService.getTopProfiles(100);
      setProfiles(data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      setError('Não foi possível carregar o ranking. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Ranking de Usuários</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando ranking...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadProfiles}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <RankingTable profiles={profiles} />
        )}
      </div>
    </Layout>
  );
}; 