# StarChain Identity

Uma plataforma descentralizada para gerenciar sua identidade e reputação na blockchain MultiversX.

## Funcionalidades

- Criação de perfil com nome e links
- Sistema de estrelas para reconhecimento
- Ranking de perfis mais bem avaliados
- Integração com carteira MultiversX (Web Wallet, Extension, MetaMask e WalletConnect)
- Cache e indexação para melhor desempenho
- Testes end-to-end automatizados
- CI/CD com GitHub Actions

## Tecnologias Utilizadas

### Frontend
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.1.0
- Tailwind CSS 3.4.1
- MultiversX SDK
  - @multiversx/sdk-core 14.0.1
  - @multiversx/sdk-dapp 2.24.0
  - @multiversx/sdk-metamask-provider 2.0.0
- React Router 6.22.0
- Jest 29.7.0 e Testing Library para testes unitários
- ESLint 8.56.0 para qualidade de código

### Smart Contract
- Rust
- MultiversX WASM

## Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Rust e cargo
- MultiversX SDK

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/starchain-identity.git
cd starchain-identity
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Para desenvolvimento
cp frontend/.env-dev frontend/.env

# Para homologação
cp frontend/.env-homolog frontend/.env

# Para produção
cp frontend/.env-prod frontend/.env
```

### Desenvolvimento

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O servidor estará disponível em [http://localhost:3001](http://localhost:3001)

2. Para compilar o smart contract:
```bash
cd contracts
cargo build
```

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila a aplicação para produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run lint`: Executa o linter ESLint
- `npm test`: Executa os testes unitários
- `npm run cypress:run`: Executa os testes E2E
- `npm run cypress:open`: Abre o Cypress para testes interativos

## Estrutura do Projeto

```
starchain-identity/
├── frontend/           # Aplicação React
│   ├── src/           # Código fonte
│   │   ├── components/# Componentes React
│   │   ├── pages/     # Páginas da aplicação
│   │   ├── config/    # Configurações
│   │   ├── hooks/     # Hooks personalizados
│   │   ├── routes/    # Configuração de rotas
│   │   ├── services/  # Serviços e APIs
│   │   ├── types/     # Definições de tipos
│   │   ├── utils/     # Funções utilitárias
│   │   ├── App.tsx    # Componente principal
│   │   └── main.tsx   # Ponto de entrada
│   ├── public/        # Arquivos estáticos
│   ├── cypress/       # Testes E2E
│   ├── .env-dev      # Variáveis ambiente desenvolvimento
│   ├── .env-homolog  # Variáveis ambiente homologação
│   ├── .env-prod     # Variáveis ambiente produção
│   ├── vite.config.cjs # Configuração do Vite
│   ├── tailwind.config.cjs # Configuração do Tailwind
│   └── package.json   # Dependências e scripts
│
├── contracts/         # Smart Contracts
│   ├── src/          # Código Rust
│   └── Cargo.toml    # Configuração do Rust
│
├── .github/          # Configurações do GitHub Actions
└── README.md         # Documentação principal
```

## Configuração MultiversX

### Redes Suportadas
- Devnet: https://devnet-wallet.multiversx.com
- Testnet: https://testnet-wallet.multiversx.com
- Mainnet: https://wallet.multiversx.com

### Configurações de Autenticação
- Native Auth habilitado
- Token de autenticação: "starchain"
- Tempo de expiração do token: 3600 segundos (1 hora)
- Tamanho do hash do bloco: 32 bytes
- Prefixo de mensagem assinada: "StarChain Identity*"

## CI/CD

O projeto utiliza GitHub Actions para:
- Executar testes automaticamente em cada pull request
- Fazer deploy automático para GitHub Pages quando código é mergeado na main

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Documentação Adicional

Para mais informações sobre as tecnologias utilizadas:

- [Documentação do React](https://reactjs.org/docs/getting-started.html)
- [Documentação do Vite](https://vitejs.dev/guide/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do MultiversX SDK](https://docs.multiversx.com/sdk-and-tools/sdk-js/)
- [Documentação do Rust](https://doc.rust-lang.org/book/) # Oraculo
