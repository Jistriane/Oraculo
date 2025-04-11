// Importa as extensões do Jest para o DOM
import '@testing-library/jest-dom';

// Configura o ambiente de teste
beforeAll(() => {
  // Mock do localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock do sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

  // Mock do matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock do objeto window.elrond
  Object.defineProperty(window, 'elrond', {
    value: {
      isConnected: jest.fn(),
      login: jest.fn(),
    },
    writable: true,
  });

  // Mock do objeto window.location
  const mockLocation = {
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  };

  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
  });
}); 