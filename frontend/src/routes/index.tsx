import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold mb-4">StarChain Identity</h1>
    <p className="text-xl">Bem-vindo à plataforma de identidade descentralizada</p>
  </div>
);

export const routeNames = {
  home: '/',
  unlock: '/unlock',
  dashboard: '/dashboard',
  profile: '/profile',
  auth: '/auth'
} as const;

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={routeNames.home} element={<Home />} />
    </Routes>
  );
}; 