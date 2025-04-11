/**
 * Configuração dos endpoints da API
 */
export const API_CONFIG = {
  /** URL base da API */
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',

  /** Endpoints relacionados ao perfil */
  profile: {
    /** Endpoint para criar um novo perfil */
    create: '/api/profile/create',
    /** Endpoint para buscar um perfil */
    get: '/api/profile',
    /** Endpoint para atualizar um perfil */
    update: '/api/profile/update',
    /** Endpoint para deletar um perfil */
    delete: '/api/profile/delete'
  },

  /** Endpoints relacionados ao ranking */
  ranking: {
    /** Endpoint para listar o ranking */
    list: '/api/ranking',
    /** Endpoint para dar uma estrela */
    giveStar: '/api/ranking/star'
  },

  /** Headers padrão para requisições */
  headers: {
    'Content-Type': 'application/json'
  },

  /** Timeout padrão para requisições em milissegundos */
  timeout: 10000
}; 