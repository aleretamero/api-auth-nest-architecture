# Projeto Auth NestJs

![preview](https://auth-nestjs.vercel.app/assets/images/preview.webp)

## 💭 Descrição

## 🧠 Funcionalidades

✔️ **Registro de Usuário**

✔️ **Login e Logout de Usuário**

✔️ **Refresh Token**

✔️ **Verificar se o email é válido**

✔️ **Recuperar de Senha**

✔️ **CRUD de Usuários**

✔️ **CRUD de Dados Pessoais**

✔️ **Armazenamento local de arquivos**

✔️ **Integração com Supabase (Storage)**

✔️ **Integração com CacheManager**

✔️ **Integração com NestI18n**

✔️ **Integração com NestMailer (Nodemailer)**

✔️ **Integração com Bull**

✔️ **Integração com Postgres (TypeORM), MongoDB (Mongoose) e Redis (CacheManager e Bull)**

✔️ **Integração com Bcrypt e JWT**

✔️ **Rate Limiting**

✔️ **Server Static**


## 🖥️ Tecnologias Utilizadas

- [TypeScript](https://www.typescriptlang.org) - superset, linguagem baseada em javascript
- [NodeJs](https://nodejs.org/pt) - ambiente de execução JavaScript para várias plataformas.
- [Nestjs](https://docs.nestjs.com) - framework para aplicações NodeJs.
- [Docker](https://www.docker.com) -
- [TypeORM](https://typeorm.io) -
- [PostgreSQL](https://www.postgresql.org) -
- [Mongoose](https://mongoosejs.com) - é uma biblioteca de modelagem de objetos.
- [MongoDB](https://www.mongodb.com/pt-br) - banco de dados NoSQL
- [Redis](https://redis.io/) -
- [Prettier](https://prettier.io) - Formatador de código que mantém um estilo de código consistente.
- [ESLint](https://eslint.org) - Ferramenta de linting para identificar e corrigir problemas no código.
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - é uma biblioteca de hash de senhas
- [JsonWebToken](https://jwt.io) - é um formato compacto e autenticado de representar informações em sistemas web para autenticação e autorização.
- [Swagger](https://swagger.io) - é uma estrutura de código aberto para a documentação, criação e teste de APIs REST.
- [Handlebars](https://handlebarsjs.com) -

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
# ou
pnpm install
# ou
yarn install
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
# ou
pnpm dev
# ou
yarn dev
```

## Colaboradores 🤝🤝

| Foto                                                       | Nome                                                 |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| <img src="https://github.com/aleretamero.png" width="100"> | [Alexandre Retamero](https://github.com/aleretamero) |

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
