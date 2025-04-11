import React from 'react';

/**
 * Props do componente Layout
 */
interface LayoutProps {
  /** Conteúdo a ser renderizado dentro do layout */
  children: React.ReactNode;
}

/**
 * Componente que define a estrutura base da aplicação.
 * Inclui apenas a área principal de conteúdo.
 * 
 * @example
 * ```tsx
 * <Layout>
 *   <h1>Conteúdo da página</h1>
 * </Layout>
 * ```
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100" data-testid="layout-container">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}; 