# Starchain Identity Frontend

Este projeto é uma aplicação React com TypeScript, utilizando Vite como bundler e Tailwind CSS para estilização. O projeto integra com a blockchain MultiversX através do SDK oficial, permitindo autenticação e interação com smart contracts.

## 🚀 Tecnologias Utilizadas

- React 18.2.0
- TypeScript 5.3.3
- Vite 5.1.0
- Tailwind CSS 3.4.1
- MultiversX SDK
  - @multiversx/sdk-core 14.0.1
  - @multiversx/sdk-dapp 2.24.0
  - @multiversx/sdk-metamask-provider 2.0.0

## 📋 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm run dev`

Inicia o servidor de desenvolvimento.\
Abra [http://localhost:3001](http://localhost:3001) para visualizar no navegador.

A página será recarregada automaticamente quando você fizer edições.\
Você também verá erros de lint no console.

### `npm run build`

Compila a aplicação para produção na pasta `dist`.\
Ele empacota corretamente o React em modo de produção e otimiza a build para melhor performance.

A build é minificada e os nomes dos arquivos incluem hashes.\
Sua aplicação está pronta para ser implantada!

### `npm run preview`

Visualiza a build de produção localmente.

### `npm run lint`

Executa o linter ESLint para verificar erros de código.

### `npm test`

Inicia o executor de testes Jest no modo de observação interativo.

## ⚙️ Configuração do Ambiente

O projeto utiliza as seguintes configurações principais:

- Vite como bundler principal
- Tailwind CSS para estilização
- TypeScript para tipagem estática
- ESLint para linting
- Jest para testes

## 📁 Estrutura do Projeto

```
frontend/
├── src/                # Código fonte
│   ├── components/    # Componentes React
│   ├── pages/        # Páginas da aplicação
│   ├── config/       # Configurações
│   ├── hooks/        # Hooks personalizados
│   ├── routes/       # Configuração de rotas
│   ├── services/     # Serviços e APIs
│   ├── types/        # Definições de tipos
│   ├── utils/        # Funções utilitárias
│   ├── App.tsx       # Componente principal
│   └── main.tsx      # Ponto de entrada
├── public/            # Arquivos estáticos
├── dist/              # Build de produção
├── node_modules/      # Dependências
├── vite.config.cjs    # Configuração do Vite
├── tailwind.config.cjs # Configuração do Tailwind
├── postcss.config.cjs # Configuração do PostCSS
├── package.json       # Dependências e scripts
└── tsconfig.json      # Configuração do TypeScript
```

## 📦 Dependências Principais

### Dependências de Produção
- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.22.0
- @multiversx/sdk-core 14.0.1
- @multiversx/sdk-dapp 2.24.0
- @multiversx/sdk-metamask-provider 2.0.0
- Tailwind CSS 3.4.1

### Dependências de Desenvolvimento
- TypeScript 5.3.3
- Vite 5.1.0
- ESLint 8.56.0
- Jest 29.7.0
- @testing-library/react 14.2.1

## 🔗 Configuração do MultiversX SDK

O projeto está configurado para trabalhar com:
- Wallet Connect
- MetaMask
- Web Wallet
- Extension Wallet

### Configurações de Rede
- Devnet: https://devnet-wallet.multiversx.com
- Testnet: https://testnet-wallet.multiversx.com
- Mainnet: https://wallet.multiversx.com

### Autenticação
- Native Auth habilitado
- Token de autenticação: "starchain"
- Tempo de expiração do token: 3600 segundos (1 hora)
- Tamanho do hash do bloco: 32 bytes
- Prefixo de mensagem assinada: "StarChain Identity*"

## 📚 Suporte e Documentação

Para mais informações sobre as tecnologias utilizadas:

- [Documentação do React](https://reactjs.org/docs/getting-started.html)
- [Documentação do Vite](https://vitejs.dev/guide/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do MultiversX SDK](https://docs.multiversx.com/sdk-and-tools/sdk-js/)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- [Seu Nome](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Equipe MultiversX pelo SDK
- Comunidade React
- Comunidade TypeScript 