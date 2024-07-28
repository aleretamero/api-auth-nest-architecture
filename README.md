# Projeto Auth NestJs

![preview](https://auth-nestjs.vercel.app/assets/images/preview.webp)

## 💭 Descrição

O Projeto Auth NestJs é uma aplicação backend desenvolvida com o framework NestJS. Ele oferece uma solução completa para autenticação e autorização de usuários. A aplicação também integra diversas tecnologias para armazenamento de dados, gerenciamento de cache, envio de emails e internacionalização, visando proporcionar uma experiência robusta e escalável.

## 🧠 Funcionalidades

✔️ **Registro de Usuário** - Serviço para criação de usuário.

✔️ **Login e Logout de Usuário** - Os usuários podem se autenticar no sistema através do login e encerrar a sessão com logout.

✔️ **Refresh Token** - Sistema de renovação de tokens para manter a sessão do usuário ativa sem a necessidade de login constante.

✔️ **Verificar se o email é válido** - Serviço para verificar a validade de endereços de email fornecidos pelos usuários.

✔️ **Recuperar de Senha** - Funcionalidade para que os usuários possam recuperar suas senhas esquecidas.

✔️ **CRUD de Usuários** - Operações de criação, leitura, atualização e exclusão de dados dos usuários.

✔️ **CRUD de Dados Pessoais** - Gerenciamento de dados pessoais dos usuários, incluindo criação, leitura, atualização e exclusão.

✔️ **Armazenamento local de arquivos** - Permite o armazenamento de arquivos no servidor local.

✔️ **Integração com Supabase (Storage)** - Integração para armazenamento de arquivos utilizando Supabase.

✔️ **Integração com CacheManager** - Integração para gerenciamento de cache, melhorando a performance da aplicação.

✔️ **Integração com NestI18n** - Suporte a internacionalização (i18n) utilizando o módulo NestI18n.

✔️ **Integração com NestMailer (Nodemailer)** - Envio de emails utilizando o NestMailer, que é uma integração com o Nodemailer.

✔️ **Integração com Bull** - Gerenciamento de filas de tarefas utilizando o Bull.

✔️ **Integração com Postgres (TypeORM), MongoDB (Mongoose) e Redis (CacheManager e Bull)** - Suporte a múltiplos bancos de dados e tecnologias de armazenamento, incluindo Postgres com TypeORM, MongoDB com Mongoose, e Redis para cache e gerenciamento de filas.

✔️ **Integração com Bcrypt e JWT** - Uso de Bcrypt para hashing de senhas e JWT para autenticação de usuários.

✔️ **Rate Limiting** - Limitação de taxa para controlar o número de requisições que um usuário pode fazer em um determinado período de tempo.

✔️ **Server Static** - Serviço para servir arquivos estáticos.


## 🖥️ Tecnologias Utilizadas

- [TypeScript](https://www.typescriptlang.org) - superset, linguagem baseada em javascript
- [NodeJs](https://nodejs.org/pt) - ambiente de execução JavaScript para várias plataformas.
- [Nestjs](https://docs.nestjs.com) - framework para aplicações NodeJs.
- [Docker](https://www.docker.com) - plataforma para desenvolver, enviar e executar aplicações em contêineres.
- [TypeORM](https://typeorm.io) - ORM (Object Relational Mapper) para TypeScript e JavaScript.
- [PostgreSQL](https://www.postgresql.org) - sistema de gerenciamento de banco de dados objeto-relacional.
- [Mongoose](https://mongoosejs.com) - biblioteca de modelagem de objetos para MongoDB e Node.js.
- [MongoDB](https://www.mongodb.com/pt-br) - banco de dados NoSQL, orientado a documentos.
- [Redis](https://redis.io/) - armazenamento de estrutura de dados em memória, utilizado como banco de dados, cache e message broker.
- [Prettier](https://prettier.io) - Formatador de código que mantém um estilo de código consistente.
- [ESLint](https://eslint.org) - Ferramenta de linting para identificar e corrigir problemas no código.
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - é uma biblioteca de hash de senhas
- [JsonWebToken](https://jwt.io) - é um formato compacto e autenticado de representar informações em sistemas web para autenticação e autorização.
- [Swagger](https://swagger.io) - é uma estrutura de código aberto para a documentação, criação e teste de APIs REST.
- [Handlebars](https://handlebarsjs.com) - motor de templates JavaScript para criar templates sem lógica embarcada.

## 📂 Esquema de pastas
```
./src
├── @types
├── common
│   ├── decorators
│   ├── dtos
│   ├── exception-filters
│   ├── guards
│   ├── helpers
│   ├── pipes
│   ├── swagger
│   └── validators
├── configs
├── infra
│   ├── cache
│   ├── database
│   │   ├── mongo
│   │   └── postgres
│   │       └── migrations
│   ├── hash
│   ├── i18n
│   │   ├── locales
│   │   │   └── en
│   │   └── protocols
│   ├── jwt
│   ├── logging
│   │   └── log-error
│   │       ├── dtos
│   │       ├── models
│   │       └── queries
│   ├── mail
│   ├── queue
│   ├── rate-limiting
│   ├── server-static
│   └── storage
│       ├── local-storage
│       └── supabase
├── modules
│   ├── auth
│   │   ├── dtos
│   │   └── jobs
│   ├── health
│   └── user
│       ├── dtos
│       ├── entities
│       ├── enums
│       ├── jobs
│       └── sub-modules
│           ├── personal-data
│           │   ├── dto
│           │   └── entities
│           ├── session
│           │   ├── dtos
│           │   └── entities
│           └── user-code
│               ├── entities
│               └── enums
└── views
    ├── layouts
    └── partials
```

## 📝 Resumo da Estrutura

- @**types**: Tipos personalizados utilizados na aplicação.
- **common**: 
  - **decorators**: Decoradores personalizados.
  - **dtos**: Objetos de Transferência de Dados (DTOs).
  - **exception-filters**: Filtros de exceções.
  - **guards**: Guardas de rota.
  - **helpers**: Funções auxiliares e utilitários.
  - **pipes**: Pipes personalizados para transformação e validação.
  - **swagger**: Configurações e documentos Swagger.
  - **validators**: Validadores personalizados.
- **configs**: Arquivos de configuração.
- **infra**: Modulos de Infraestrutura da aplicação.
  - **cache**: Configuração e gerenciamento de cache.
  - **database**: Configuração de bancos de dados.
    - **mongo**: Configuração para MongoDB.
    - **postgres**: Configuração para PostgreSQL, incluindo migrações.
  - **hash**: Configuração para hashing de senhas.
  - **i18n**: Internacionalização.
    - **locales**: Arquivos de tradução.
      - **en**: Traduções em inglês.
    - **protocols**: Protocolos de internacionalização.
  - **jwt**: Configuração de JSON Web Tokens.
  - **logging**: Configuração de logs.
    - **log-error**: Logs de erro.
      - **dtos**: DTOs para logs de erro.
      - **models**: Modelos para logs de erro.
      - **queries**: Consultas para logs de erro.
  - **mail**: Configuração para envio de emails.
  - **queue**: Configuração de filas de tarefas.
  - **rate-limiting**: Limitação de taxa de requisições.
  - **server-static**: Arquivos estáticos do servidor.
  - **storage**: Armazenamento de arquivos.
    - **local-storage**: Armazenamento local.
    - **supabase**: Integração com Supabase.
- **modules**: Módulos da aplicação.
  - **auth**: Módulo de autenticação.
    - **dtos**: DTOs para autenticação.
    - **jobs**: Tarefas relacionadas à autenticação.
  - **health**: Módulo de verificação de saúde da aplicação.
- **user**: Módulo de gerenciamento de usuários.
  - **dtos**: DTOs para usuários.
  - **entities**: Entidades de usuários.
  - **enums**: Enumerações para usuários.
  - **jobs**: Tarefas relacionadas a usuários.
  - **sub-modules**: Submódulos do módulo de usuário.
    - **personal-data**: Dados pessoais dos usuários.
      - **dto**: DTOs para dados pessoais.
      - **entities**: Entidades de dados pessoais.
    - **session**: Sessões de usuário.
      - **dtos**: DTOs para sessões.
      - **entities**: Entidades de sessões.
    - **user-code**: Códigos de usuário (ex**: confirmação de e-mail).
      - **entities**: Entidades de códigos de usuário.
      - **enums**: Enumerações para códigos de usuário.
- **views**: Visualizações da aplicação.
  - **layouts**: Layouts de visualização.
  - **partials**: Partes reutilizáveis das visualizações.

## 🛠️ Modificando o projeto

### Siga as seguintes instruções para instalar e poder modificar o projeto em sua máquina:

### 📋 Pré-requisitos:

Para baixar, executar e modificar o projeto, você precisa ter instalado em sua máquina:

- [Node](https://nodejs.org/en)
- [Docker](https://www.docker.com/products/docker-desktop)
- Um gerenciador de pacotes, como o [PNPM](https://pnpm.io), [Npm](https://nodejs.org/en/) ou [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)
- [Git](https://git-scm.com/downloads)
- Editor de código ou IDE, como o [VSCode](https://code.visualstudio.com/Download)

### 🔧 Instalação e execução

1. Clone o repositório

```bash
git clone https://github.com/aleretamero/auth-nestjs.git
```

2. Acesse a pasta do projeto

```bash
cd auth-nestjs
```

3. Instale as dependências

```bash
npm install
```


4. Copie o arquivo `.env.example` e crie um arquivo `.env` na raiz do projeto colocando as variáveis com os valores corretos:
```env
  # General
  BASE_URL=http://localhost:3333
  NODE_ENV=development
  PORT=3333

  # Frontend
  FRONTEND_URL=

  # JWT
  JWT_SECRET=some-secret

  # CORS
  CORS_WHITE_LIST=http://localhost:3333

  # Postgres
  POSTGRES_HOST=localhost
  POSTGRES_PORT=5432
  POSTGRES_USER=postgres
  POSTGRES_PASS=postgres
  POSTGRES_DB=auth-nestjs
  POSTGRES_SSL=disable

  # MongoDB
  MONGO_HOST=localhost
  MONGO_PORT=27017
  MONGO_USER=root
  MONGO_PASS=root
  MONGO_DB=auth-nestjs
  MONGO_URI=mongodb://root:root@localhost:27017

  # Supabase
  SUPABASE_URL=
  SUPABASE_SERVICE_ROLE=

  # Mail
  MAIL_HOST=
  MAIL_PORT=
  MAIL_USER=
  MAIL_PASS=

  # Cache
  CACHE_REDIS_HOST=localhost
  CACHE_REDIS_PORT=6379

  # Queue
  QUEUE_REDIS_HOST=localhost
  QUEUE_REDIS_PORT=6380

  # API Portfolio
  API_PORTFOLIO_URL=
  API_PORTFOLIO_TOKEN=
  API_PORTFOLIO_PROJECT_ID=
```

 ***insira os valores das variáveis vazias.***

5. Crie o container no docker com

```bash
docker compose up -d
```

6. Inicie o servidor de desenvolvimento do projeto

```bash
npm run dev
```

## Colaboradores 🤝🤝

| Foto                                                       | Nome                                                 |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| <img src="https://github.com/aleretamero.png" width="100"> | [Alexandre Retamero](https://github.com/aleretamero) |

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
