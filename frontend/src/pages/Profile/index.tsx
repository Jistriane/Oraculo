import React, { useEffect, useState } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetIsLoggedIn } from '../../hooks';
import { Layout } from '../../components/Layout';
import { ProfileForm } from '../../components/ProfileForm';
import { ProfileCard } from '../../components/ProfileCard';
import { starChainService } from '../../services/starchain';

/**
 * Interface que representa um perfil de usuário
 */
interface Profile {
  /** Endereço da carteira do usuário */
  address: string;
  /** Nome do usuário */
  name: string;
  /** Lista de links associados ao perfil */
  links: string[];
  /** Número de estrelas recebidas */
  stars: number;
}

/**
 * Página de perfil do usuário.
 * Gerencia a exibição e edição das informações do perfil.
 * 
 * Estados:
 * - Não autenticado: Exibe mensagem para conectar carteira
 * - Autenticado sem perfil: Exibe formulário de criação
 * - Autenticado com perfil: Exibe card com informações
 * 
 * Funcionalidades:
 * - Criação de perfil
 * - Visualização de informações
 * - Atualização automática após mudanças
 * 
 * @example
 * ```tsx
 * <Route path="/profile" element={<ProfilePage />} />
 * ```
 */
export const ProfilePage: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega os dados do perfil do usuário.
   */
  const loadProfile = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await starChainService.getProfile(address);
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega o perfil quando o componente monta ou o endereço muda
  useEffect(() => {
    loadProfile();
  }, [address]);

  // Exibe mensagem se não estiver autenticado
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Conecte sua Carteira
          </h1>
          <p className="text-gray-600">
            Para acessar seu perfil, você precisa conectar sua carteira MultiversX.
          </p>
        </div>
      </Layout>
    );
  }

  // Exibe loader enquanto carrega
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-gray-600">
            Carregando...
          </p>
        </div>
      </Layout>
    );
  }

  // Exibe mensagem de erro se houver
  if (error) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-red-600" data-testid="error-message">
            {error}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center" data-testid="profile-title">
          {profile ? 'Seu Perfil' : 'Criar Perfil'}
        </h1>

        {profile ? (
          // Exibe o card do perfil se existir
          <ProfileCard
            profile={profile}
            isAuthenticated={isLoggedIn}
            isOwnProfile={true}
            onStarGiven={loadProfile}
          />
        ) : (
          // Exibe o formulário de criação se não existir
          <ProfileForm onSuccess={loadProfile} />
        )}
      </div>
    </Layout>
  );
}; 