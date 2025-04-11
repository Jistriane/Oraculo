/** @type {import('jest').Config} */
export default {
  // Diretório raiz do projeto
  roots: ['<rootDir>/src'],

  // Extensões de arquivo que o Jest deve procurar
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Transformações de arquivo
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true
    }]
  },

  // Configurações de teste
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    html: '<!DOCTYPE html><html><head></head><body></body></html>',
    url: 'http://localhost',
    customExportConditions: ['']
  },

  // Configurações de cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts'
  ],

  // Configurações de módulo
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '@multiversx/sdk-dapp/UI/(.*)': '<rootDir>/src/__mocks__/@multiversx/sdk-dapp/UI/$1',
    '@multiversx/sdk-dapp/hooks/(.*)': '<rootDir>/src/__mocks__/@multiversx/sdk-dapp/hooks/$1',
    '@multiversx/sdk-dapp/utils/(.*)': '<rootDir>/src/__mocks__/@multiversx/sdk-dapp/utils/$1',
    '@multiversx/sdk-dapp/UI': '<rootDir>/src/__mocks__/@multiversx/sdk-dapp/UI',
    '@multiversx/sdk-dapp/hooks': '<rootDir>/src/__mocks__/@multiversx/sdk-dapp/hooks',
    '@multiversx/sdk-dapp/utils': '<rootDir>/src/__mocks__/@multiversx/sdk-dapp/utils'
  },

  // Configurações de setup
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Ignorar arquivos e diretórios
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],

  // Configurações de relatório
  verbose: true,
  
  // Configurações de timeout
  testTimeout: 10000,

  // Configurações de cobertura
  collectCoverage: true,

  // Configurações de relatório de cobertura
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Configurações de transformação ignorada
  transformIgnorePatterns: [
    '/node_modules/(?!(@multiversx/sdk-dapp)/)'
  ],

  // Configurações de extensões a serem tratadas como ESM
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}; 