import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';

/**
 * Hook para verificar se o usuário está autenticado
 * @returns boolean indicando se o usuário está autenticado
 */
export const useGetIsLoggedIn = () => {
  const { isLoggedIn } = useGetLoginInfo();
  return isLoggedIn;
}; 