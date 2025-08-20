# Test SPS Server

Servidor Node.js/Express para gerenciamento de usuários com sistema de logs.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm

## Instalação e Execução

### 1. Instale as dependências:
```bash
npm install
```

### 2. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```env
PORT=3001
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=24h
```

### 3. Execute o servidor:
```bash
npm run dev
```

O backend estará disponível em `http://localhost:3001`

## Funcionalidades

- **Autenticação JWT** para todas as rotas protegidas
- **CRUD completo** de usuários (criar, editar, excluir, listar)
- **Sistema de logs** para todas as operações
- **Banco SQLite** com tabelas automáticas
- **Validações** de dados e tipos de usuário

## Rotas da API

- `POST /auth/login` - Autenticação de usuários
- `GET /users` - Listar todos os usuários
- `POST /users` - Criar novo usuário
- `PUT /users/:id` - Editar usuário existente
- `DELETE /users/:id` - Excluir usuário
- `GET /logs` - Histórico de operações

## Usuário Padrão

- **Email**: admin@sps.com
- **Senha**: admin123
- **Tipo**: admin

## Estrutura do Projeto

```
src/
├── config/          # Configurações de ambiente
├── database/        # Camada de banco de dados
├── middlewares/     # Validações e autenticação
├── routes/          # Rotas da API
└── utils/           # Utilitários
```
