import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { starChainService } from '../../services/starchain';

/**
 * Props do componente ProfileForm
 */
interface ProfileFormProps {
  /** Função chamada após a criação bem-sucedida do perfil */
  onSuccess?: () => void;
}

/**
 * Valida se uma string é uma URL válida
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Componente de formulário para criação/edição de perfil.
 * Permite que usuários insiram seu nome e links associados.
 * 
 * Funcionalidades:
 * - Campo de nome com validação
 * - Adição/remoção dinâmica de links
 * - Validação de campos obrigatórios
 * - Feedback visual de erros
 * - Navegação automática após sucesso
 * 
 * @example
 * ```tsx
 * <ProfileForm onSuccess={() => console.log('Perfil criado!')} />
 * ```
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    links?: string[];
  }>({});
  
  // Estado do formulário
  const [name, setName] = useState('');
  const [links, setLinks] = useState<string[]>(['']);

  /**
   * Atualiza um link específico no array de links.
   */
  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
    
    // Limpa erro do link específico
    if (fieldErrors.links?.[index]) {
      const newLinkErrors = [...(fieldErrors.links || [])];
      newLinkErrors[index] = '';
      setFieldErrors({ ...fieldErrors, links: newLinkErrors });
    }
  };

  /**
   * Adiciona um novo campo de link vazio ao formulário.
   */
  const addLink = () => {
    setLinks([...links, '']);
  };

  /**
   * Remove um link específico do formulário.
   */
  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    
    // Remove erro do link removido
    if (fieldErrors.links) {
      const newLinkErrors = fieldErrors.links.filter((_, i) => i !== index);
      setFieldErrors({ ...fieldErrors, links: newLinkErrors });
    }
  };

  /**
   * Valida o formulário antes do envio
   */
  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    
    // Validação do nome
    if (!name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    // Validação dos links
    const linkErrors: string[] = [];
    let hasLinkError = false;
    
    links.forEach((link, index) => {
      if (link.trim() && !isValidUrl(link)) {
        linkErrors[index] = 'URL inválida';
        hasLinkError = true;
      } else {
        linkErrors[index] = '';
      }
    });

    if (hasLinkError) {
      errors.links = linkErrors;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Manipula o envio do formulário.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    // Remove links vazios
    const validLinks = links.filter(link => link.trim());

    try {
      setIsSubmitting(true);
      await starChainService.createProfile(name.trim(), validLinks);
      onSuccess?.();
      navigate('/profile');
    } catch (err: any) {
      console.error('Erro ao criar perfil:', err);
      setError(err.message || 'Erro ao criar perfil. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo de Nome */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700"
        >
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) {
              setFieldErrors({ ...fieldErrors, name: undefined });
            }
          }}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            fieldErrors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Seu nome"
          required
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
        )}
      </div>

      {/* Lista de Links */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Links
        </label>
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className={`w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  fieldErrors.links?.[index] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://..."
              />
              {fieldErrors.links?.[index] && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.links[index]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="text-red-500 hover:text-red-700"
              disabled={links.length === 1}
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="text-blue-500 hover:text-blue-700"
        >
          Adicionar Link
        </button>
      </div>

      {/* Mensagem de Erro Geral */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Botão de Envio */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Criando...' : 'Criar Perfil'}
      </button>
    </form>
  );
}; 