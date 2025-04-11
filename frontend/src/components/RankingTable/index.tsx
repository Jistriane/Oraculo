import React from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetIsLoggedIn } from '../../hooks';
import { starChainService } from '../../services/starchain';

/**
 * Interface que representa um perfil na tabela de ranking
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
 * Props do componente RankingTable
 */
interface RankingTableProps {
  /** Lista de perfis a serem exibidos */
  profiles: RankingProfile[];
  /** Função chamada após dar uma estrela com sucesso */
  onStarGiven?: () => void;
}

/**
 * Componente que exibe uma tabela de ranking dos usuários.
 * Ordena os perfis por número de estrelas e permite interação.
 * 
 * Funcionalidades:
 * - Exibição de posição, nome, endereço e estrelas
 * - Formatação de endereços longos
 * - Botão para dar estrela (apenas para usuários autenticados)
 * - Validação para impedir dar estrela para si mesmo
 * 
 * @example
 * ```tsx
 * <RankingTable
 *   profiles={[
 *     { address: "erd1...", name: "João", stars: 5 },
 *     { address: "erd2...", name: "Maria", stars: 3 }
 *   ]}
 *   onStarGiven={() => console.log('Estrela dada!')}
 * />
 * ```
 */
export const RankingTable: React.FC<RankingTableProps> = ({
  profiles,
  onStarGiven
}) => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address: userAddress } = useGetAccountInfo();
  const [givingStarTo, setGivingStarTo] = React.useState<string | null>(null);

  /**
   * Formata o endereço da carteira para exibição.
   * @param address Endereço completo da carteira
   * @returns Endereço formatado (primeiros e últimos caracteres)
   */
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  /**
   * Manipula a ação de dar uma estrela.
   * @param address Endereço do perfil que receberá a estrela
   */
  const handleGiveStar = async (address: string) => {
    try {
      setGivingStarTo(address);
      await starChainService.giveStar(address);
      onStarGiven?.();
    } catch (error) {
      console.error('Erro ao dar estrela:', error);
    } finally {
      setGivingStarTo(null);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum perfil encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Endereço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estrelas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {profiles.map((profile, index) => (
            <tr key={profile.address}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}º
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {profile.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatAddress(profile.address)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="text-sm text-gray-900">
                    {profile.stars}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {isLoggedIn && userAddress !== profile.address && (
                  <button
                    onClick={() => handleGiveStar(profile.address)}
                    disabled={givingStarTo === profile.address}
                    className={`text-yellow-500 hover:text-yellow-700 ${
                      givingStarTo === profile.address
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {givingStarTo === profile.address
                      ? 'Dando Estrela...'
                      : 'Dar Estrela'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 