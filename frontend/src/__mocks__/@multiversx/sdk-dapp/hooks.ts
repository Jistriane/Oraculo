import { jest } from '@jest/globals';

const useGetLoginInfo = jest.fn().mockReturnValue({
  isLoggedIn: false,
  loginMethod: null,
  tokenLogin: null,
  expires: 0
});

const useGetAccountInfo = jest.fn().mockReturnValue({
  address: '',
  balance: '0',
  nonce: 0
});

const useGetIsLoggedIn = jest.fn().mockReturnValue(false);

export {
  useGetLoginInfo,
  useGetAccountInfo,
  useGetIsLoggedIn
}; 