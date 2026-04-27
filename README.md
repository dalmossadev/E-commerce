# Sisters Lab — Sistema Completo

> Plataforma completa para gestão de calçados (sob demanda + estoque)  
> Monorepo: Backend (API REST) + Frontend (E-Commerce)

---

## Visão Geral

Sistema para gestão de produtos, variações SKU, leads e pedidos em modelo híbrido (sob demanda + estoque).

### Repositórios Locais

```
sisters-lab-completo/
├── backend/              # API REST (TypeScript + Express + TypeORM + MySQL)
├── shop-varejo/          # Frontend E-Commerce (Next.js + React + Tailwind)
├── .github/              # Configurações de CI/CD
├── docs/                 # Documentação do projeto
│   ├── constitution.md   # Constituição do projeto
│   ├── prd.md            # Product Requirements Document
│   └── backlog.md        # Backlog do produto
└── scripts/              # Scripts de deploy e manutenção
    ├── deploy.sh         # Script de deploy
    └── debug_projeto.sh  # Script de debug
```

---

## Tecnologias

### Backend (API REST)
- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript 5.4
- **Framework**: Express 5
- **ORM**: TypeORM 0.3
- **Banco de Dados**: MySQL 8+
- **Autenticação**: JWT
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest + ts-jest

### Frontend (E-Commerce)
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 18
- **Styles**: Tailwind CSS 3.4
- **Language**: TypeScript 5.5
- **Icons**: Lucide React

---

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure o .env com suas credenciais MySQL
npm run dev
```

Acesse: `http://localhost:3001/api/docs`

### Frontend

```bash
cd shop-varejo
npm install
cp .env.example .env.local
# Configure NEXT_PUBLIC_API_URL
npm run dev
```

Acesse: `http://localhost:3000`

---

## Documentação

- **Backend API**: [backend/README.md](backend/README.md)
- **Frontend**: [shop-varejo/README.md](shop-varejo/README.md)
- **Análise do Sistema**: [backend/ANALYSIS.md](backend/ANALYSIS.md) (Status das rotas, infraestrutura, Testes etc)
- **PRD**: [prd.md](prd.md)
- **Constituição**: [constitution.md](constitution.md)
- **Backlog**: [backlog.md](backlog.md)

---

## Scripts Úteis

| Comando | Descrição |
|---|---|
| `./debug_projeto.sh` | Diagnóstica problemas no projeto |
| `./deploy.sh` | Deploy da aplicação |
| `cd backend && npm test` | Executa testes do backend |
| `cd shop-varejo && npm run lint` | Lint do frontend |

---

## Arquitetura

### Backend (Clean Architecture + SOLID)

```
backend/src/
├── core/              # Domínio e Casos de Uso (regras de negócio)
├── adapters/          # Adaptadores HTTP (controllers, routes)
├── infrastructure/    # Banco de dados, logs, upload
└── docs/              # Contratos e documentação
```

### Frontend (App Router)

```
shop-varejo/src/
├── app/               # Rotas e layouts (Next.js App Router)
├── components/        # Componentes React
├── modules/           # Módulos da aplicação
└── hooks/             # Custom hooks
```

---

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Licença

ISC

---

## Contato

Para dúvidas ou suporte, abra uma issue no repositório.

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
