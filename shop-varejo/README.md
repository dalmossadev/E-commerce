# Shop Varejo — Frontend E-Commerce

> Frontend moderno para e-commerce de calçados  
> Stack: Next.js 16 + React 18 + TypeScript + Tailwind CSS

---

## Estado do Projeto

Para acompanhamento do escopo geral de backend (`132 testes passando`, rotas, banco, e status de CRUD), confira o **[Relatório de Análise do Backend](../backend/ANALYSIS.md)**. O log de atividades e status de entregas do Sprint podem ser vistos detalhadamente em nosso **[Backlog do Projeto](../backlog.md)**.

---

## Stack

| Tecnologia | Versão | Justificativa |
|---|---|---|
| Next.js | 16 | SSR, SSG, rotas automáticas, otimização nativa |
| React | 18 | Biblioteca de UI moderna e performática |
| TypeScript | 5.5 | Tipagem estática para maior segurança |
| Tailwind CSS | 3.4 | Utilitários CSS para desenvolvimento rápido |
| Lucide React | 0.383 | Ícones modernos e customizáveis |

---

## Pré-requisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- Backend rodando (porta 3001)

---

## Instalação

```bash
# 1. Navegue até o diretório
cd shop-varejo

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas configurações

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Next.js |
| `npm run build` | Build de produção |
| `npm start` | Inicia o build de produção |
| `npm run lint` | Verifica o código com ESLint |
| `npm run typecheck` | Verificação de tipos TypeScript |

---

## Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (routes)/          # Rotas da aplicação
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base (botões, inputs)
│   ├── features/         # Componentes de funcionalidades
│   └── layout/           # Componentes de layout
├── modules/              # Módulos da aplicação
├── hooks/                # Custom hooks
├── types/                # Definições de tipos TypeScript
├── constants/            # Constantes globais
└── lib/                  # Utilitários e configurações
```

---

## Variáveis de Ambiente

Principais variáveis (`.env.local`):
- `NEXT_PUBLIC_API_URL`: URL do backend (ex: `http://localhost:3001/api/v1`)

---

## Integração com Backend

O frontend consome a API REST do backend Sisters Lab:
- Autenticação via JWT
- Catálogo de produtos
- Gestão de leads
- Pedidos e compras

Documentação da API: `http://localhost:3001/api/docs`

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
