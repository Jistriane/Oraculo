import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/Auth';
import { ProfilePage } from './pages/Profile';
import { RankingPage } from './pages/Ranking';
import { ProfileCreatePage } from './pages/Profile/Create';

/**
 * Componente principal de roteamento da aplicação.
 * Define todas as rotas disponíveis e seus respectivos componentes.
 * 
 * Rotas:
 * - /auth: Página de autenticação
 * - /profile: Página de perfil do usuário
 * - /profile/create: Página de criação de perfil
 * - /ranking: Página de ranking dos usuários
 * - /: Redireciona para /ranking (página inicial)
 * 
 * @example
 * ```tsx
 * <BrowserRouter>
 *   <AppRoutes />
 * </BrowserRouter>
 * ```
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Página de Autenticação */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Página de Perfil */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Página de Criação de Perfil */}
      <Route path="/profile/create" element={<ProfileCreatePage />} />

      {/* Página de Ranking */}
      <Route path="/ranking" element={<RankingPage />} />

      {/* Redireciona para a página de ranking */}
      <Route path="/" element={<Navigate to="/ranking" replace />} />
    </Routes>
  );
}; 