import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

/**
 * Componente de formulário de login/registro com email e senha.
 * 
 * @example
 * ```tsx
 * // Modo Login
 * <LoginForm onSuccess={() => navigate('/profile')} />
 * 
 * // Modo Registro
 * <LoginForm isRegistering onSuccess={() => navigate('/profile')} />
 * ```
 */
interface LoginFormProps {
  onSuccess?: () => void;
  isRegistering?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, isRegistering = false }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validação básica
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }

      const response = isRegistering 
        ? await apiService.register(email, password)
        : await apiService.login(email, password);
      
      if (response.success) {
        // Salva dados do usuário no localStorage se necessário
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || (isRegistering ? 'Erro ao criar conta' : 'Erro ao fazer login'));
      }
    } catch (error) {
      console.error(isRegistering ? 'Erro ao criar conta:' : 'Erro ao fazer login:', error);
      setError(isRegistering ? 'Erro ao criar conta. Tente novamente.' : 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="Sua senha"
          minLength={6}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {isLoading 
            ? (isRegistering ? 'Criando conta...' : 'Entrando...') 
            : (isRegistering ? 'Criar conta' : 'Entrar')}
        </button>
      </div>

      {!isRegistering && (
        <div className="text-sm text-center">
          <a href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/90">
            Esqueceu sua senha?
          </a>
        </div>
      )}
    </form>
  );
}; 