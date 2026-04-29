# 📜 PROJECT CONSTITUTION: SISTERS LAB E-COMMERCE (v2.0)
**Framework de Orquestração:** OpenCode (Agentes Assíncronos)
**Localização de Negócio:** Salvador & Simões Filho, BA — Brasil
**Última Atualização:** 2026-04-29
**Conformidade:** PRD.md v2.0 · TDD.md v1.4.0 · agents.json v1.4

---

## 🎯 1. VISÃO DO PRODUTO

Sistema ERP híbrido full-stack para gestão de calçados premium. Opera em dois modelos de estoque:

- **ON_DEMAND:** Sem estoque físico — captação de leads e venda ativa via WhatsApp
- **IN_STOCK (Pronta Entrega):** Estoque físico com controle de reserva e baixa automática

Dois projetos desacoplados que se comunicam via API REST:
- **Backend:** `backend/` — porta 3001
- **Frontend:** `shop-varejo/` — porta 3000

---

## 🎨 2. IDENTIDADE VISUAL (IMUTÁVEL)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#000000` | Textos, botões primários, ícones |
| `--color-surface` | `#FFFFFF` | Fundos de página e cards |
| `--color-surface-alt` | `#F5F5F5` | Seções alternadas |
| `--color-border` | `#E0E0E0` | Bordas de cards e inputs |
| `--color-accent` | `#00FF00` | Verde Neon — destaques pontuais |

**Regras absolutas:**
- Paleta acima é **IMUTÁVEL** — nenhuma alteração sem aprovação explícita do owner
- Proibido usar outras cores para estados de erro ou status — usar ícones, bordas e labels textuais
- `border-radius: 0` em botões e inputs — estética premium minimalista
- `font-size` sempre em `rem`, nunca `px`
- `--font-scale` ajustável via botões A+/A- entre `0.875rem` e `1.375rem`

---

## ♿ 3. PILARES DE ACESSIBILIDADE (A11Y — WCAG 2.1 AA)

| Requisito | Implementação |
|-----------|---------------|
| Contraste | Mínimo 7:1 em todos os elementos (P&B puro garante isso) |
| Font Scaling | Botões A+/A- alteram `--font-scale` no `:root`, persistido em localStorage |
| Image Magnifier | Lupa HD 2x na página de detalhe do produto, navegável por teclado |
| Semântica | HTML semântico rigoroso: `section`, `article`, `nav`, `dialog`, `main` |
| ARIA | `aria-label`, `aria-live`, `aria-pressed`, `aria-modal`, `role="alert"` em todos os elementos interativos |
| Teclado | `Tab-index` lógico, `focus-visible` visível, `focus trap` em modais |
| Skip Link | `SkipToContent` como primeiro elemento de cada página, aponta para `#main-content` |

---

## 🛠️ 4. STACK TÉCNICA

### 4.1 Backend (`backend/` — porta 3001)

| Tecnologia | Versão |
|------------|--------|
| Node.js | 20+ |
| TypeScript | 5.4 |
| Express | 5.2.1 |
| TypeORM | 0.3.28 |
| MySQL | 8+ (local, sem Docker) |
| JWT | cookie httpOnly `__session` |
| Validação | Zod 4.3.6 |
| Testes | Jest 29 + ts-jest |

### 4.2 Frontend (`shop-varejo/` — porta 3000)

| Tecnologia | Versão |
|------------|--------|
| Next.js | 16 (App Router) |
| React | 18 |
| TypeScript | 5.5 |
| Tailwind CSS | 3.4 |
| Lucide React | ícones |
| Jest + Testing Library + MSW | testes |

### 4.3 Infraestrutura

- **Banco de dados:** MySQL 8+ rodando **localmente** — sem Docker
- **CI/CD:** Lint e type-check obrigatórios antes de builds
- **Variáveis de ambiente:**
  - Backend: `.env` com `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`
  - Frontend: `.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:3001`

---

## 🏗️ 5. ARQUITETURA

### 5.1 Clean Architecture (Backend)

```
adapters/http/          ← Controllers, Routes, Middlewares, Validations (Zod)
core/domain/            ← Entidades Ricas com métodos de negócio
core/use-cases/         ← Use Cases por domínio
core/interfaces/        ← Contratos (DIP)
core/dto/               ← Data Transfer Objects
core/container/         ← Dependency Injection
core/errors/            ← CustomErrors
infrastructure/
  database/mappers/     ← TypeORM EntitySchemas (NUNCA decorators no domínio)
  database/repositories/← Implementações concretas
  database/subscribers/ ← VariantAuditSubscriber (shadow table)
  auth/                 ← AuthService (JWT, bcrypt)
  upload/               ← Multer configurado
  logger/
```

### 5.2 Next.js App Router (Frontend)

```
app/
  (auth)/login/         ← Página de login
  (auth)/register/      ← Página de registro
  api/auth/             ← Route Handlers seguros (cookie httpOnly)
  api/orders/           ← Proxy de checkout
  produtos/             ← Listagem e detalhe
  wishlist/             ← Lista de desejos
  checkout/             ← Fluxo de compra
  orders/               ← Área do cliente
src/
  components/           ← Componentes React
  contexts/             ← AuthContext, CartContext
  hooks/                ← useFontSize, useWishlist, useLeadModal, useMagnifier, useAuth
  lib/api/              ← client.ts + services por domínio
  types/                ← Tipos espelhando DTOs do backend
  actions/              ← Server Actions ('use server')
```

### 5.3 Separação UX / UI

| Agente | Responsabilidade |
|--------|-----------------|
| **agent-ux** | Estrutura semântica, fluxos, A11Y, hooks de lógica e estado |
| **agent-ui** | Tokens de design, paleta P&B, tipografia, animações, skeleton loaders, hover states |

Os dois agentes **nunca** atuam no mesmo arquivo ao mesmo tempo — UX entrega primeiro, UI aplica sobre o resultado.

---

## 🤖 6. PROTOCOLO DE AGENTES (OpenCode)

### 6.1 Hierarquia v1.4

| # | Agente | Responsabilidade |
|---|--------|-----------------|
| 0 | **Orchestrator** | Gerencia 4 fases, estratégia por fase |
| 1 | **agent-erp-medium** | Campaigns, Customers, History, Settings CRUD |
| 2 | **agent-auth-frontend** | JWT frontend — Route Handlers, middleware, AuthContext |
| 3 | **agent-ux** | Semântica, A11Y, hooks de lógica |
| 4 | **agent-ui** | Design system P&B, tokens visuais |
| 5 | **agent-upload** | Upload de imagens de produto via Multer |
| 6 | **agent-qa** | Regressão 132+ testes backend + cobertura frontend |

### 6.2 Fases de Execução

| Fase | Estratégia | Agentes |
|------|------------|---------|
| 1 | Paralelo | agent-erp-medium + agent-auth-frontend |
| 2 | Sequencial | agent-ux |
| 3 | Sequencial | agent-ui |
| 4 | Paralelo | agent-upload + agent-qa |

### 6.3 Diretivas obrigatórias para todos os agentes

- **NUNCA** alterar testes existentes — apenas adicionar novos
- **NUNCA** usar `float` para valores monetários — apenas inteiros (centavos)
- **NUNCA** adicionar `border-radius` em botões ou inputs
- **NUNCA** usar `px` em `font-size` — apenas `rem`
- **NUNCA** importar código do `backend/` dentro do `shop-varejo/` ou vice-versa
- **NUNCA** expor token JWT no cliente — apenas em cookie httpOnly
- **SEMPRE** registrar tokens novos no `Container.ts`
- **SEMPRE** usar `RESTRICT` em FK — sem deleção em cascata
- **SEMPRE** usar `timestamptz` para timestamps

---

## 🔀 6.4 DIRETRIZ: FLEXIBILIDADE DE ESQUEMA vs. INTEGRIDADE DE DOMÍNIO

### Princípio Fundamental
O sistema deve priorizar a **disponibilidade dos endpoints** sobre a rigidez de tipos, garantindo resiliência contra dados legados ou inconsistentes no banco de dados.

### Regras de Mapeamento (TypeORM)
1. **Tratamento de Nulos:** Erros de mapeamento de tipos (ex: `brand` ou `basePrice` nulos no banco) devem ser resolvidos tornando os campos nullable no `EntitySchema` e na entidade de domínio.
2. **Uso de DTOs de Transformação:** Quando o banco retorna dados em formato diferente do esperado pelo domínio, utilizar DTOs ou lógica nos Use Cases para normalizar os dados antes de retornar à API.
3. **Prioridade:** O endpoint `GET /products` (e suas variações) **NUNCA** deve retornar 500 devido a problemas de mapeamento de dados. Se um campo opcional estiver nulo, a API deve retornar 200 com o campo como `null`.

### Exemplo de Aplicação (Product)
| Campo | Banco (Legado) | Mapeamento Atual | Comportamento da API |
|-------|-----------------|------------------|---------------------|
| `brand` | NULL em alguns registros | `nullable: true` no Schema + `? string \| null` na entidade | Retorna `null` no JSON, status 200 |
| `basePrice` | NULL em alguns registros | `nullable: true` no Schema + `? number \| null` na entidade | Retorna `null` no JSON, status 200 |
| `imageUrl` | Apenas filename | Use Case aplica prefixo `/img/catalogo/` | Retorna URL completa no JSON |

### Restrições de Cores e Arquitetura
- **Cores IMUTÁVEIS:** Preto `#000000`, Branco `#FFFFFF`, Verde Neon `#00FF00` — nenhuma alteração permitida.
- **Clean Architecture INTACTA:** Mapeamentos devem ser feitos em `infrastructure/database/mappers/`, nunca no domínio.

---

## 📦 7. STATUS DOS MÓDULOS

### 7.1 Backend

| Módulo | Status |
|--------|--------|
| Products CRUD + SKU imutável | ✅ Completo |
| ProductVariant + FulfillmentType híbrido | ✅ Completo |
| VariantAuditSubscriber (shadow table) | ✅ Completo |
| Leads CRUD + status flow | ✅ Completo |
| Auth JWT (login, register, refresh) | ✅ Completo |
| Orders + state machine + DiscountService | ✅ Completo |
| Purchases + ReceiveInventory | ✅ Completo |
| Campaigns CRUD + paginação | ✅ Completo |
| Customers CRUD + paginação | ✅ Completo |
| Product History API | 🔄 Em progresso |
| Settings API (chave-valor) | ✅ Completo |
| Upload de imagem (`POST /products/:sku/image`) | 🔄 Em progresso |
| Paginação em Orders/Purchases/Leads | 🔄 Em progresso |
| Auditoria de lead confirmado | 🔄 Em progresso |

### 7.2 Frontend

| Módulo | Status |
|--------|--------|
| CartContext (localStorage) | ✅ Completo |
| Módulos API (order, lead, purchase controllers) | ✅ Completo |
| Wishlist (useWishlist + Heart icon) | ✅ Completo |
| WhatsApp Integration (botão flutuante + link dinâmico) | ✅ Completo |
| useFontSize + botões A+/A- | ✅ Completo |
| Product Magnifier (lupa HD) | ✅ Completo |
| AuthContext + useAuth | 🔄 Em progresso |
| Middleware de proteção de rotas | 🔄 Em progresso |
| Páginas login/register | 🔄 Em progresso |
| Skeleton loaders | 🔄 Em progresso |
| LeadInterestModal (ON_DEMAND) | 🔄 Em progresso |
| Área do cliente `/orders` | 🔄 Em progresso |
| SkipToContent + A11Y completo | 🔄 Em progresso |

---

## 🧪 8. TESTES E QUALIDADE

### 8.1 Backend (132+ testes)

| Categoria | Qtd | Status |
|-----------|-----|--------|
| Performance | 9 | ✅ |
| Lead + ProductVariant | 15 | ✅ |
| Product Controller | 6 | ✅ |
| CreateLeadUseCase | 7 | ✅ |
| Leads Integration | 8 | ✅ |
| Orders (domínio + use cases + integração) | 26 | ✅ |
| Purchases | 14 | ✅ |
| Campaigns / Customers / Settings | 3+ | ✅ |
| AuthService + RefreshToken | 🔄 | Em progresso |
| DiscountService | 🔄 | Em progresso |

### 8.2 Frontend (10+ testes)

| Arquivo | Qtd | Status |
|---------|-----|--------|
| useWishlist.test.ts | 6 | ✅ |
| AuthContext.test.tsx | 4 | ✅ |
| useFontSize.test.ts | 🔄 | Em progresso |
| MSW handlers | 🔄 | Em progresso |

### 8.3 Comandos

```bash
# Backend
cd backend && npm test          # Jest 132+ testes
npm run lint
npm run typecheck

# Frontend
cd shop-varejo && npm test      # Jest + Testing Library
npm run lint
npm run typecheck
```

---

## 💰 9. REGRAS FINANCEIRAS (IMUTÁVEIS)

- Valores monetários em **inteiros (centavos)** — `R$ 99,90` = `9990`
- Descontos progressivos: 0–4 itens = 0% · 5–9 itens = 5% · 10+ itens = 10%
- `applyDiscount()` na entidade `Order` usa `DiscountService`
- Exibição no frontend: `(centavos / 100).toFixed(2)` com prefixo `R$`

---

## 🔐 10. SEGURANÇA

| Item | Detalhe |
|------|---------|
| Token | JWT em cookie httpOnly `__session` |
| Seed admin | `admin@sisterslab.com` / `password123` — **alterar em produção** |
| Rate Limiting | 5 req/15min em `/login` e `/register` |
| Rotas protegidas | `/checkout`, `/orders`, `/admin` |
| Rotas públicas | `/`, `/produtos`, `/login`, `/register`, `/api/auth`, `/wishlist` |
| Refresh Token | `POST /api/v1/auth/refresh` |
| UserSchema | campo `name VARCHAR(255) NULL` — já corrigido |

---

## 🗺️ 11. BACKLOG

### Sprint 02 (Em andamento)
- [ ] Product History API exposta
- [ ] Upload de imagem funcionando end-to-end
- [ ] Paginação em Orders, Purchases e Leads
- [ ] Navegação por teclado no Magnifier (Tab-index)
- [ ] Lógica "Pronta Entrega" regional (Salvador / Simões Filho)

### Sprint 03 (Pendente)
- [ ] WhatsApp Sales Flow completo (botão P&B + link dinâmico + rastreio)
- [ ] Audit final de A11Y (score > 90 no Lighthouse)
- [ ] Build de produção (MySQL local + variáveis de ambiente de produção)

---

## 📋 12. CONVENÇÕES DE CÓDIGO

| Regra | Padrão |
|-------|--------|
| Nomes de variáveis e funções | inglês |
| Comentários para lógica complexa | português (opcional) |
| Entidades de domínio | Sem decorators TypeORM — apenas EntitySchema na infra |
| Novos Use Cases | Pasta por domínio em `core/use-cases/{dominio}/` |
| Novos tokens DI | Registrar em `Container.ts` como singleton |
| Validações de entrada | Zod no adapter HTTP — nunca no domínio |

---

*Autor: Dalmo Pereira*
*Atualizado: 2026-04-29*