# TDD - Test Driven Development

**Projeto:** Sisters Lab Completo  
**Data:** 30/04/2026  
**Status:** Em andamento (Sprint 02/03)

---

## 1. Visão Geral

Este documento descreve a estratégia de Test Driven Development (TDD) adotada no projeto Sisters Lab Completo, um sistema ERP híbrido para e-commerce de calçados premium.

### Princípios TDD
- **Red-Green-Refactor:** Escrever testes que falham, implementar código, refatorar
- **Clean Architecture:** Testes seguem a hierarquia de camadas (Domain → Use Cases → Adapters)
- **Cobertura Crítica:** Foco em regras de negócio e fluxos essenciais
- **Automação:** Testes executados em CI/CD (planejado)

---

## 2. Arquitetura de Testes

### 2.1 Backend (TypeScript + Jest + Supertest)

```
backend/src/__tests__/
├── unit/                      # Testes Unitários
│   ├── lead.test.ts           # Entidade Lead (domínio)
│   ├── order.test.ts          # Entidade Order (domínio)
│   ├── purchase.test.ts       # Entidade Purchase (domínio)
│   ├── wishlist.test.ts       # Entidade Wishlist (domínio)
│   ├── CreateLeadUseCase.test.ts
│   ├── CreateOrderUseCase.test.ts
│   ├── CreateCampaignUseCase.test.ts
│   ├── GetSettingsUseCase.test.ts
│   ├── ListCustomersUseCase.test.ts
│   ├── ReceiveInventoryUseCase.test.ts
│   ├── WishlistUseCases.test.ts    # Wishlist use cases
│   └── controllers/
│       └── product.controller.test.ts
├── integration/                # Testes de Integração
│   ├── leads.test.ts          # API REST Leads
│   ├── orders.test.ts         # API REST Orders
│   ├── purchases.test.ts      # API REST Purchases
│   ├── upload.test.ts         # Upload de imagens
│   └── wishlist.test.ts      # API REST Wishlist
├── performance.test.ts         # Testes de carga
└── setup.ts                   # Configuração global
```

### 2.2 Frontend (Jest + Testing Library + MSW)

```
shop-varejo/src/__tests__/
├── contexts/
│   └── AuthContext.test.tsx   # Contexto de autenticação
├── hooks/
│   └── useWishlist.test.ts    # Hook wishlist
└── mocks/
    ├── setupTests.ts          # Configuração Jest
    ├── server.ts              # MSW server
    └── handlers.ts            # Mock handlers API
```

---

## 3. Backend - Testes Implementados

### 3.1 Testes Unitários (Domínio)

| Arquivo | Entidade | Cenários Testados |
|---------|----------|-------------------|
| `lead.test.ts` | Lead | Criação, status flow (NEW→CONTACTED→CONVERTED), validações |
| `order.test.ts` | Order | State machine, cálculo desconto (0-5-10%), total, impostos |
| `purchase.test.ts` | Purchase | Criação, recebimento inventário, validações |
| `wishlist.test.ts` | Wishlist | Criação, userId, productId, relacionamentos |

### 3.2 Testes Unitários (Use Cases)

| Arquivo | Use Case | Cenários Testados |
|---------|----------|-------------------|
| `CreateLeadUseCase.test.ts` | CreateLead + Wishlist | Criação com SKU opcional, integração Wishlist |
| `CreateOrderUseCase.test.ts` | CreateOrder | Criação pedido, validação estoque, descontos |
| `CreateCampaignUseCase.test.ts` | CreateCampaign | Criação campanha, validações datas |
| `GetSettingsUseCase.test.ts` | GetSettings | Buscar configurações, fallback default |
| `ListCustomersUseCase.test.ts` | ListCustomers | Paginação, filtros |
| `ReceiveInventoryUseCase.test.ts` | ReceiveInventory | Receber mercadoria, atualizar estoque |
| `WishlistUseCases.test.ts` | Wishlist (3 casos) | Add, Remove, Get wishlist, validações |

### 3.3 Testes Unitários (Controllers)

| Arquivo | Controller | Cenários Testados |
|---------|------------|-------------------|
| `product.controller.test.ts` | ProductController | CRUD, validações, respostas HTTP |

### 3.4 Testes de Integração (API)

| Arquivo | Endpoint | Cenários Testados |
|---------|----------|-------------------|
| `leads.test.ts` | `/api/leads` | GET, POST, PUT, DELETE, filtros, paginação |
| `orders.test.ts` | `/api/orders` | Criação, status updates, descontos, auth |
| `purchases.test.ts` | `/api/purchases` | Criação, recebimento, relatórios |
| `upload.test.ts` | `/api/products/:sku/image` | Upload imagem, validação tipo, erros |
| `wishlist.test.ts` | `/api/v1/wishlist` | POST, GET, DELETE, auth, validações |
| `leads.test.ts` | `/api/v1/leads` | Criação SKU opcional (201), validação (400) |

### 3.5 Testes de Performance

| Arquivo | Cenário | Métrica |
|---------|---------|---------|
| `performance.test.ts` | Carga API | 100 req/s, latência < 200ms |

**Total Backend:** 21 arquivos de teste, ~161+ (CreateLeadUseCase: 10/10 ✅, lead-wishlist-real: 2/2 ✅) testes individuais

---

## 4. Frontend - Testes Implementados

### 4.1 Contextos

| Arquivo | Contexto | Cenários Testados |
|---------|----------|-------------------|
| `AuthContext.test.tsx` | AuthContext | Login, logout, persistência cookie, role check |

### 4.2 Hooks

| Arquivo | Hook | Cenários Testados |
|---------|------|-------------------|
| `useWishlist.test.ts` | useWishlist | Add/remove itens, persistência localStorage |

### 4.3 Mocks (MSW)

| Arquivo | Responsabilidade |
|---------|------------------|
| `handlers.ts` | Mock API endpoints (auth, products, orders) |
| `server.ts` | Configuração MSW server |
| `setupTests.ts` | Setup Jest + Testing Library |

**Total Frontend:** 3 arquivos de teste, ~10+ testes individuais

---

## 5. Cobertura de Testes

### 5.1 Backend (Estimada)

| Camada | Cobertura | Status |
|--------|-----------|--------|
| Domain Entities | 95% | ✅ Completo |
| Use Cases | 90% | ✅ Maior parte |
| Controllers | 75% | 🔄 Em progresso |
| Middlewares | 60% | 🔄 Em progresso |
| Infrastructure | 45% | ⚠️ Pendente |

### 5.2 Frontend (Estimada)

| Camada | Cobertura | Status |
|--------|-----------|--------|
| Contexts | 80% | ✅ Principal |
| Hooks | 90% | ✅ Completo |
| Components | 30% | ⚠️ Pendente |
| Pages | 10% | ⚠️ Pendente |
| Server Actions | 20% | ⚠️ Pendente |

---

## 6. TDD na Prática

### 6.1 Ciclo de Desenvolvimento

```bash
# 1. RED: Escrever teste que falha
npm test -- --testNamePattern="deve criar lead"

# 2. GREEN: Implementar código mínimo
# (Implementar CreateLeadUseCase)

# 3. REFACTOR: Melhorar código mantendo testes verdes
npm test
```

### 6.2 Exemplo: Lead Domain (TDD)

**Passo 1 - Teste (Red):**
```typescript
// lead.test.ts
it('deve criar lead com status NEW', () => {
  const lead = Lead.create({ name: 'Dalmo', email: 'dalmo@test.com' });
  expect(lead.status).toBe(LeadStatus.NEW);
});
```

**Passo 2 - Implementação (Green):**
```typescript
// Lead.ts
static create(props: CreateLeadProps): Lead {
  return new Lead({ ...props, status: LeadStatus.NEW });
}
```

**Passo 3 - Refatoração (Refactor):**
```typescript
// Adicionar validações, logs, etc.
```

---

## 7. Como Rodar os Testes

### 7.1 Backend

```bash
cd backend
npm test                    # Todos os testes
npm test -- --watch         # Watch mode
npm test -- --coverage      # Com cobertura
npm test -- lead.test.ts    # Teste específico
```

### 7.2 Frontend

```bash
cd shop-varejo
npm test                    # Todos os testes
npm test -- --watch         # Watch mode
npm test -- --coverage      # Com cobertura
```

### 7.3 Todos (Raiz)

```bash
npm test                    # Backend + Frontend (se configurado)
```

---

## 8. Pendências e Próximos Passos

### 8.1 Backend (Prioritários)

- [x] **Wishlist tests:** Domain, Use Cases, Integration (NOVO)
- [ ] **AuthService tests:** Refresh token, logout, expired token
- [ ] **ProductVariant tests:** Criação, validações, stock updates
- [ ] **DiscountService tests:** Edge cases (valores limite)
- [ ] **Middleware tests:** AuthMiddleware, RBAC, rate limiting
- [ ] **Campaigns API tests:** Integração completa
- [ ] **Customers API tests:** Integração completa
- [ ] **Product History API tests:** Auditoria
- [ ] **Paginação tests:** Orders, Purchases, Leads

### 8.2 Frontend (Prioritários)

- [ ] **Components tests:** ProductCard, ProductMagnifier, FloatingWhatsApp
- [ ] **Pages tests:** Homepage, Login, Register, Wishlist
- [ ] **Server Actions tests:** lead.actions.ts, order actions
- [ ] **API Routes tests:** /api/auth/*, /api/orders
- [ ] **CartContext tests:** Carrinho completo
- [ ] **useFontSize tests:** Acessibilidade zoom
- [ ] **E2E tests:** Cypress/Playwright (planejado)

### 8.3 Infraestrutura

- [ ] **CI/CD:** GitHub Actions rodando testes automáticos
- [ ] **Coverage reports:** Integração com Codecov
- [ ] **Performance:** Testes regressão de performance
- [ ] **A11Y tests:** jest-axe em componentes críticos

---

## 9. Padrões e Convenções

### 9.1 Nomenclatura

- **Unitários:** `*.test.ts` (ex: `lead.test.ts`)
- **Integração:** `*.test.ts` em pasta `integration/`
- **Performance:** `*.test.ts` com sufixo descritivo
- **Frontend:** `*.test.tsx` para componentes React

### 9.2 Estrutura de Teste

```typescript
describe('Classe/Sistema', () => {
  describe('método especifico', () => {
    it('deve fazer algo esperado', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 9.3 Mocks e Stubs

- **Backend:** Repositories mockados via Container (DI)
- **Frontend:** MSW para API, jest.mock para módulos

---

## 10. Métricas de Qualidade

| Métrica | Backend | Frontend | Meta |
|---------|---------|----------|------|
| Total Testes | 161+ (CreateLeadUseCase: 10/10 ✅, lead-wishlist-real: 2/2 ✅) | 10+ | - |
| Cobertura (%) | ~82% | ~30% | >80% |
| Testes/Arquivo | ~1.2 | ~0.25 | >0.8 |
| Tempo Execução | <30s | <15s | <60s |

---

## 11. Integração Contínua (Planejado)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - run: cd backend && npm test -- --coverage
  frontend:
    runs-on: ubuntu-latest
    steps:
      - run: cd shop-varejo && npm test -- --coverage
```

---

## 12. Referências

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [TDD by Example - Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

**Última atualização:** 30/04/2026  
**Próxima revisão:** Após conclusão Sprint 02  
**Módulo Wishlist:** Implementado com 3 novos arquivos de teste (domain, use cases, integration)
