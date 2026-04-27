# Sisters Lab — API REST

> Sistema de gestão para calçados sob demanda e estoque  
> Arquitetura: Clean Architecture + SOLID + TypeScript + TypeORM + Express

---

## Estado do Projeto

Para conferir o detalhamento das features implementadas, dependências, testes ativos, e estatísticas globais do backend, consulte o **[Relatório de Análise (ANALYSIS.md)](ANALYSIS.md)**. O relatório atual sinaliza `132 testes passando` e o status da Autenticação JWT implementada.

---

## Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Linguagem | TypeScript 5.4 (strict) | Tipagem estática — menos bugs em regras de negócio complexas |
| Framework HTTP | Express 5 | Simplicidade, flexibilidade e ampla adoção na comunidade |
| ORM | TypeORM 0.3 | OOP nativo com Decorators — fit perfeito com Clean Architecture |
| Banco de Dados | MySQL 8+ | ACID, confiabilidade, ampla adoção |
| Validação | Zod 4 | Type-safe, integra com TypeScript sem geração de código |
| Autenticação | JWT (jsonwebtoken) | Stateless — escalável horizontalmente |
| Logs | Winston | Estruturado, níveis configuráveis |
| Testes | Jest + ts-jest | Execução direta de TypeScript sem build |
| Upload | Multer | Middleware para upload de arquivos |
| Documentação | Swagger + swagger-ui-express | Documentação interativa da API |

---

## Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- MySQL >= 8.0

---

## Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd sisters-lab-completo/backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores

# 4. Crie o banco de dados MySQL
mysql -u root -p
CREATE DATABASE sisterslabdb;

# 5. Inicie o servidor em desenvolvimento
npm run dev
```

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor em desenvolvimento com ts-node |
| `npm run build` | Build de produção (compila TypeScript) |
| `npm start` | Inicia o build de produção |
| `npm test` | Executa todos os testes com Jest |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes com relatório de cobertura |

---

## Estrutura do Projeto

```
src/
├── core/                      # Regras de negócio puras (Clean Architecture)
│   ├── domain/                # Entidades e objetos de valor
│   ├── use-cases/             # Casos de uso (orders, procurement, catalog)
│   ├── dto/                   # Data Transfer Objects
│   ├── interfaces/            # Contratos e interfaces
│   ├── errors/                # Erros específicos do domínio
│   └── container/             # Injeção de dependências
│
├── adapters/                  # Adaptadores de entrada/saída
│   └── http/                  # Camada HTTP (Express)
│       ├── controllers/       # Controladores das rotas
│       ├── routes/            # Registro das rotas por domínio
│       ├── middlewares/       # Auth, validação, logging, rate limit
│       └── validations/       # Esquemas de validação
│
├── infrastructure/            # Implementações concretas
│   ├── database/
│   │   ├── models/            # Entidades TypeORM
│   │   ├── mappers/           # Schemas que mapeiam entidades para o banco
│   │   ├── repositories/      # Implementações dos repositórios
│   │   ├── subscribers/      # Event listeners do TypeORM
│   │   └── data-source.ts     # Configuração do AppDataSource
│   ├── logger/                # Winston configurado
│   ├── swagger/               # Configuração do Swagger
│   └── upload/                # Configuração de upload de arquivos
│
├── docs/                      # Documentação e contratos
│   └── contracts/             # Contratos da API
│
├── server.ts                  # Ponto de entrada da aplicação
└── seed.ts                    # Script de seed do banco de dados
```

__tests__/
├── unit/                      # Testes unitários
│   └── controllers/           # Testes dos controladores
└── integration/               # Testes de integração
```

---

## Variáveis de Ambiente

Consulte o arquivo `.env.example` para a lista completa com documentação.

Principais variáveis:
- `PORT`: Porta do servidor (padrão: 3001)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configurações do MySQL
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: Chaves para tokens JWT

---

## Documentação da API

Em desenvolvimento, acesse: `http://localhost:3001/api/docs`

---

## Rotas Principais

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/auth/login` | Login de usuário |
| POST | `/api/v1/auth/register` | Registro de usuário |
| GET | `/api/v1/products` | Lista produtos |
| GET | `/api/v1/products/:sku` | Detalhes do produto |
| POST | `/api/v1/products` | Cria produto (admin) |
| GET | `/api/v1/suppliers` | Lista fornecedores |
| POST | `/api/v1/suppliers` | Cria fornecedor |
| GET | `/api/v1/leads` | Lista leads |
| POST | `/api/v1/leads` | Cria lead |
| GET | `/api/v1/orders` | Lista pedidos |
| POST | `/api/v1/orders` | Cria pedido |
| GET | `/api/v1/purchases` | Lista compras |
| POST | `/api/v1/purchases` | Cria compra |
| GET | `/api/v1/admin/dashboard` | Dashboard admin |
| GET | `/api/health` | Health check |

---

## Health Check

```
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-15T14:00:00.000Z",
  "database": "connected"
}
```

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
