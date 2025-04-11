import React from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { AppRoutes } from './routes';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <this.props.FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  );
};

/**
 * Componente raiz da aplicação StarChain Identity.
 * Configura os provedores necessários e componentes globais.
 * 
 * Funcionalidades:
 * - Roteamento da aplicação
 * - Layout comum (navbar e footer)
 * - Tratamento de erros global
 * 
 * @example
 * ```tsx
 * ReactDOM.render(
 *   <App />,
 *   document.getElementById('root')
 * );
 * ```
 */
const App: React.FC = () => {
  const isLoggedIn = useGetIsLoggedIn();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App; 