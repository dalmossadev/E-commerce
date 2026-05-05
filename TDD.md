# TDD - Test Driven Development
## Sisters Lab Completo

**Data:** 04/05/2026
**Status:** MVP Financeiro Concluído (Sprint 02)
**Versão:** 1.7.0

---

## 1. Visão Geral

Sistema ERP híbrido full-stack para e-commerce de calçados premium. TDD aplicado em todas as camadas seguindo Clean Architecture.

### Princípios
- **Red-Green-Refactor:** Escrever testes que falham → implementar → refatorar
- **Clean Architecture:** Testes seguem hierarquia Domain → Use Cases → Adapters
- **Cobertura Crítica:** Foco em regras de negócio e fluxos essenciais
- **Sem mock de persistência:** Testes de integração usam banco real

---

## 2. Stack Técnica

| Tecnologia | Versão |
|------------|--------|
| TypeScript (backend) | 5.4.5 |
| TypeScript (frontend) | 5.5 |
| Express | 5.2.1 |
| Next.js | 14 (App Router) |
| TypeORM | 0.3.28 |
| MySQL | 8+ (local, sem Docker) |
| JWT | - |
| Jest | 29.7.0 |
| Zod | 4.3.6 |
| Tailwind CSS | 3.4 |
| Supertest | - |
| MSW | - |
| Testing Library | - |

### Arquitetura
- **Clean Architecture** — Domain, Use Cases, Interfaces, Infrastructure, Adapters
- **SOLID** — SRP, OCP, LSP, ISP, DIP
- **MVC** — Model (Domain + Repositories), View (DTOs), Controller (HTTP)
- **DI Container** — Inversão de dependência via Container.ts
- **Design System P&B** — #000000, #FFFFFF, #00FF00 (imutáveis)

---

## 3. Estrutura de Pastas

### 3.1 Backend (`backend/`)

```
backend/
└── src/
    ├── adapters/http/
    │   ├── controllers/
    │   │   ├── LeadController.ts
    │   │   ├── ProductController.ts
    │   │   ├── SupplierController.ts
    │   │   ├── OrderController.ts
    │   │   ├── PurchaseController.ts
    │   │   ├── CampaignController.ts
    │   │   ├── CustomerController.ts
    │   │   ├── ProductHistoryController.ts
    │   │   ├── SettingsController.ts
    │   │   └── PaymentController.ts
    │   ├── middlewares/
    │   │   ├── AuthMiddleware.ts
    │   │   ├── ErrorHandler.ts
    │   │   ├── LogMiddleware.ts
    │   │   ├── RateLimitMiddleware.ts
    │   │   └── ValidationMiddleware.ts
    │   ├── routes/
    │   │   ├── admin.routes.ts
    │   │   ├── auth.routes.ts
    │   │   ├── health.routes.ts
    │   │   ├── lead.routes.ts
    │   │   ├── product.routes.ts
    │   │   ├── supplier.routes.ts
    │   │   ├── user.routes.ts
    │   │   ├── order.routes.ts
    │   │   ├── purchase.routes.ts
    │   │   ├── campaign.routes.ts
    │   │   ├── customer.routes.ts
    │   │   ├── product-history.routes.ts
    │   │   ├── settings.routes.ts
    │   │   ├── wishlist.routes.ts
    │   │   └── payment.routes.ts
    │   └── validations/
    │       ├── lead.validation.ts
    │       ├── product.validation.ts
    │       ├── supplier.validation.ts
    │       ├── order.validation.ts
    │       ├── purchase.validation.ts
    │       ├── campaign.validation.ts
    │       ├── customer.validation.ts
    │       └── settings.validation.ts
    ├── core/
    │   ├── container/
    │   │   └── Container.ts
    │   ├── domain/
    │   │   ├── Product.ts
    │   │   ├── ProductVariant.ts
    │   │   ├── Lead.ts
    │   │   ├── Order.ts
    │   │   ├── OrderItem.ts
    │   │   ├── Purchase.ts
    │   │   ├── PurchaseItem.ts
    │   │   ├── Wishlist.ts
    │   │   ├── User.ts
    │   │   ├── Supplier.ts
    │   │   ├── Customer.ts
    │   │   ├── Campaign.ts
    │   │   ├── AuditLog.ts
    │   │   ├── ProductHistory.ts
    │   │   ├── Settings.ts
    │   │   ├── UserProfile.ts
    │   │   ├── Payment.ts
    │   │   └── services/
    │   │       ├── SkuService.ts
    │   │       └── DiscountService.ts
    │   ├── dto/
    │   │   ├── AuthDTO.ts
    │   │   ├── LeadDTO.ts
    │   │   ├── ProductDTO.ts
    │   │   ├── SupplierDTO.ts
    │   │   ├── OrderDTO.ts
    │   │   ├── PurchaseDTO.ts
    │   │   ├── CampaignDTO.ts
    │   │   ├── CustomerDTO.ts
    │   │   ├── SettingsDTO.ts
    │   │   ├── WishlistDTO.ts
    │   │   └── PaymentDTO.ts
    │   ├── errors/
    │   │   ├── AppError.ts
    │   │   └── CustomErrors.ts
    │   └── interfaces/
    │       ├── IProductRepository.ts
    │       ├── IUserRepository.ts
    │       ├── ISupplierRepository.ts
    │       ├── ILeadRepository.ts
    │       ├── IAuditRepository.ts
    │       ├── IOrderRepository.ts
    │       ├── IPurchaseRepository.ts
    │       ├── ICampaignRepository.ts
    │       ├── ICustomerRepository.ts
    │       ├── ISettingsRepository.ts
    │       ├── IWishlistRepository.ts
    │       ├── IPaymentRepository.ts
    │       ├── IProductSKU.ts
    │       └── IAuthService.ts
    ├── infrastructure/
    │   ├── auth/AuthService.ts
    │   ├── cache/cache.ts
    │   ├── pix/PixService.ts
    │   ├── database/
    │   │   ├── mappers/
    │   │   │   ├── ProductSchema.ts
    │   │   │   ├── ProductVariantSchema.ts
    │   │   │   ├── LeadSchema.ts
    │   │   │   ├── SupplierSchema.ts
    │   │   │   ├── UserSchema.ts
    │   │   │   ├── OrderSchema.ts
    │   │   │   ├── OrderItemSchema.ts
    │   │   │   ├── PurchaseSchema.ts
    │   │   │   ├── PurchaseItemSchema.ts
    │   │   │   ├── CampaignSchema.ts
    │   │   │   ├── CustomerSchema.ts
    │   │   │   ├── SettingsSchema.ts
    │   │   │   ├── WishlistSchema.ts
    │   │   │   ├── VariantHistorySchema.ts
    │   │   │   └── PaymentSchema.ts
    │   │   ├── repositories/
    │   │   │   ├── TypeORMProductRepository.ts
    │   │   │   ├── TypeORMLeadRepository.ts
    │   │   │   ├── TypeORMUserRepository.ts
    │   │   │   ├── TypeORMSupplierRepository.ts
    │   │   │   ├── TypeORMAuditRepository.ts
    │   │   │   ├── TypeORMOrderRepository.ts
    │   │   │   ├── TypeORMPurchaseRepository.ts
    │   │   │   ├── TypeORMCampaignRepository.ts
    │   │   │   ├── TypeORMCustomerRepository.ts
    │   │   │   ├── TypeORMSettingsRepository.ts
    │   │   │   ├── TypeORMWishlistRepository.ts
    │   │   │   ├── TypeORMVariantHistoryRepository.ts
    │   │   │   └── TypeORMPaymentRepository.ts
    │   │   ├── subscribers/VariantAuditSubscriber.ts
    │   │   ├── migrations/
    │   │   ├── data-source.ts
    │   │   └── server-init.ts
    │   ├── logger/logger.ts
    │   ├── swagger/swagger.ts
    │   └── upload/upload.ts
    ├── __tests__/
    │   ├── unit/
    │   │   ├── lead.test.ts
    │   │   ├── order.test.ts
    │   │   ├── purchase.test.ts
    │   │   ├── wishlist.test.ts
    │   │   ├── CreateLeadUseCase.test.ts
    │   │   ├── CreateOrderUseCase.test.ts
    │   │   ├── CreateCampaignUseCase.test.ts
    │   │   ├── GetSettingsUseCase.test.ts
    │   │   ├── ListCustomersUseCase.test.ts
    │   │   ├── ReceiveInventoryUseCase.test.ts
    │   │   ├── WishlistUseCases.test.ts
    │   │   ├── GeneratePaymentQRCodeUseCase.test.ts
    │   │   ├── AuthService.test.ts          ← pendente
    │   │   ├── DiscountService.test.ts      ← pendente
    │   │   └── controllers/
    │   │       └── product.controller.test.ts
    │   ├── integration/
    │   │   ├── leads.test.ts
    │   │   ├── orders.test.ts
    │   │   ├── purchases.test.ts
    │   │   ├── upload.test.ts
    │   │   └── wishlist.test.ts
    │   ├── performance.test.ts
    │   └── setup.ts
    └── server.ts
```

### 3.2 Frontend (`shop-varejo/`)

```
shop-varejo/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── refresh/route.ts
│   │   ├── orders/route.ts
│   │   └── products/[sku]/route.ts
│   ├── produtos/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── [sku]/page.tsx
│   ├── wishlist/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/
│   ├── actions/
│   │   ├── lead.actions.ts
│   │   └── order.actions.ts
│   ├── components/
│   │   ├── features/ProductCard.tsx
│   │   ├── ui/
│   │   │   ├── ProductCardSkeleton.tsx
│   │   │   └── ProductGridSkeleton.tsx
│   │   ├── FeaturedSection.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ImageWithFallback.tsx
│   │   ├── FloatingCart.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── WishlistQuickModal.tsx
│   │   ├── LeadInterestModal.tsx
│   │   ├── FontSizeControls.tsx
│   │   ├── SkipToContent.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── OrderStatusTimeline.tsx
│   │   └── PixQRCodeDisplay.tsx
│   ├── constants/
│   │   └── site-config.ts       ← SITE_INFO, CATEGORIES, IMAGE_BASE_URL
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── SettingsContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWishlist.ts
│   │   ├── useWishlistFlow.ts
│   │   ├── useLeadModal.ts
│   │   ├── useMagnifier.ts
│   │   ├── useFontSize.ts
│   │   └── usePixPayment.ts
│   ├── lib/api/
│   │   ├── client.ts
│   │   ├── errors.ts
│   │   └── services/
│   │       ├── productService.ts
│   │       ├── orderService.ts
│   │       ├── authService.ts
│   │       ├── leadService.ts
│   │       ├── purchaseService.ts
│   │       └── settingsService.ts
│   ├── modules/
│   │   ├── order-controller.ts
│   │   ├── lead-controller.ts
│   │   └── purchase-controller.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   ├── lead.types.ts
│   │   ├── purchase.types.ts
│   │   └── settings.types.ts
│   └── __tests__/
│       ├── contexts/AuthContext.test.tsx
│       ├── hooks/useWishlist.test.ts
│       └── mocks/
│           ├── setupTests.ts
│           ├── server.ts
│           └── handlers.ts
├── public/img/catalogo/          ← imagens webp dos produtos
├── middleware.ts
├── next.config.js
├── tailwind.config.js
├── babel.config.js
└── .env.local
```

---

## 4. Banco de Dados

### 4.1 Colunas físicas — ATENÇÃO

As tabelas `orders` e `order_items` usam **camelCase** diretamente no MySQL.
O TypeORM **não deve usar** `name: 'snake_case'` nessas tabelas.

**orders:**
```
id, customerId, customerName, customerEmail, customerPhone,
shippingAddress, subtotal, discount, total,
status, paymentMethod, notes,
createdAt, updatedAt, paymentConfirmedAt
```

**order_items:**
```
id, orderId, variantId, sku, productName,
color, size, quantity, unitPrice, totalPrice, fulfillmentType
```

### 4.2 Regra geral de mapeamento
- Sempre rodar `DESCRIBE tabela` antes de criar ou alterar um EntitySchema
- Não assumir snake_case — verificar o nome físico real
- `imageUrl` NÃO existe no banco — gerado dinamicamente no Use Case
- Valores monetários: `int` (centavos) — nunca float

### 4.3 Tabelas existentes
```
products, product_variants, leads, orders, order_items,
purchases, purchase_items, users, settings, wishlists,
campaigns, customers, variant_history, audit_logs, payments,
financial_transactions
```

### 4.4 Variáveis de ambiente

**Backend (`backend/.env`):**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=senha
DB_NAME=sisterslabdb
JWT_SECRET=secret
APP_URL=http://localhost:3001
PIX_KEY=557187833065
PIX_NAME=Sisters Lab
PIX_CITY=SALVADOR
PIX_HMAC_SECRET=secret
```

**Frontend (`shop-varejo/.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=secret
```

---

## 5. Entidades de Domínio

### 5.1 Product
```typescript
class Product {
  id: number;
  name: string;
  brand?: string | null;
  category: ProductCategory;
  basePrice?: number | null;     // centavos
  originalPrice?: number;        // centavos
  badge?: ProductBadge;
  specs?: Record<string, any>;
  featured: boolean;
  inStock: boolean;
  imageName: string;             // filename: "produto-6.webp"
  imageUrl?: string | null;      // gerado dinamicamente — NÃO existe no banco
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
// imageUrl gerado em Use Cases:
// product.imageUrl = `${APP_URL}/img/catalogo/${product.imageName}`
```

### 5.2 Order
```typescript
enum OrderStatus { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }
enum PaymentMethod { PIX, CREDIT_CARD, BOLETO }

class Order {
  id: number;
  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  subtotal: number;              // centavos
  discount: number;              // centavos
  total: number;                 // centavos — campo físico no banco
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  paymentConfirmedAt?: Date;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;

  calculateTotal(): number;      // retorna subtotal - discount
  canTransitionTo(status): boolean;
  // State machine:
  // PENDING → PAID, CANCELLED
  // PAID → SHIPPED, CANCELLED
  // SHIPPED → DELIVERED
}
```

### 5.3 Payment (PIX)
```typescript
enum PaymentStatus { PENDING, CONFIRMED, EXPIRED, FAILED }

class Payment {
  id: number;
  orderId: number;
  amount: number;                // centavos
  status: PaymentStatus;
  pixPayload: string;            // BR Code EMV
  pixQRCodeBase64: string;       // imagem base64
  expiresAt: Date;               // 30 min após criação
  confirmedAt?: Date;
  createdAt: Date;
}
```

### 5.4 FinancialTransaction (Ledger Contábil)
```typescript
enum TransactionType { INCOME, EXPENSE, FEE, REFUND }
enum TransactionStatus { PENDING, SETTLED, CANCELLED }
enum ReferenceType { ORDER, PURCHASE, OTHER }

class FinancialTransaction {
  id: number;
  referenceId?: number;          // orderId ou purchaseId
  referenceType?: ReferenceType;
  type: TransactionType;
  amount: number;                // centavos
  status: TransactionStatus;
  paymentMethod?: string;
  provider?: string;             // Ex: 'INFINITEPAY'
  expectedSettlementDate?: Date;
  settledAt?: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. Regras de Negócio

### 6.1 Estoque Híbrido
| Tipo | Comportamento |
|------|---------------|
| IN_STOCK | Bloqueia se quantity > stock |
| ON_DEMAND | **Nunca valida estoque** — permite sempre |

### 6.2 Desconto Progressivo
| Qtd itens | Desconto |
|-----------|----------|
| 0–4 | 0% |
| 5–9 | 5% |
| 10+ | 10% |

### 6.3 PIX e Fluxo Financeiro (Ledger)
| Etapa | Detalhe |
|-------|---------|
| Geração | `GET /api/v1/orders/:id/pix` — retorna BR Code EMV e expira em 30min |
| Simulação (Dev) | `POST /api/v1/dev/simulate-payment` — bypass local sem webhook |
| Confirmação Webhook | `POST /api/v1/webhooks/infinitepay` — validação via HMAC signature |
| Ledger: INCOME | Gera `FinancialTransaction` automática (100% do total) com status `SETTLED` |
| Ledger: FEE | Gera `FinancialTransaction` automática de `FEE` (ex: R$ 0,99 InfinitePay) |
| Resultado | Order vai para `PAID`, registros contábeis criados, auditoria (AuditLog) salva. |

### 6.4 Wishlist + Lead
| Ação | Comportamento |
|------|---------------|
| Coração (não logado) | WishlistQuickModal → Lead PENDING → wishlist + carrinho |
| Coração (logado) | Lead PENDING → wishlist + carrinho |
| Remover coração | Remove wishlist + carrinho — Lead permanece |

---

## 7. Endpoints da API

### Auth
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### Produtos
```
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:sku
PUT    /api/v1/products/:sku
DELETE /api/v1/products/:sku
POST   /api/v1/products/:sku/image
GET    /api/v1/products/:sku/history
GET    /api/v1/history
```

### Pedidos
```
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status
POST   /api/v1/orders/:id/cancel
GET    /api/v1/orders/:id/pix           ← PIX MVP
PATCH  /api/v1/orders/:id/confirm-payment ← admin only
```

### Wishlist
```
GET    /api/v1/wishlist
POST   /api/v1/wishlist
DELETE /api/v1/wishlist/:id
```

### PIX / Pagamentos / Contabilidade
```
GET    /api/v1/orders/:id/pix
PATCH  /api/v1/orders/:id/confirm-payment
POST   /api/v1/dev/simulate-payment       ← (Apenas em ambiente DEV)
POST   /api/v1/webhooks/infinitepay       ← (Webhook protegido por HMAC)
```

### ERP
```
GET/POST/PUT/DELETE /api/v1/campaigns
GET/POST/PUT/DELETE /api/v1/customers
GET/PATCH           /api/v1/settings
GET/POST/DELETE     /api/v1/wishlist
GET/POST            /api/v1/purchases
POST                /api/v1/purchases/:id/receive
GET/POST/PATCH/DELETE /api/v1/leads
```

---

## 8. Testes Implementados

### 8.1 Backend

| Arquivo | Cenários | Status |
|---------|----------|--------|
| `performance.test.ts` | 9 carga/latência | ✅ |
| `lead.test.ts` | 15 domínio Lead | ✅ |
| `CreateLeadUseCase.test.ts` | 10 criação + wishlist | ✅ |
| `product.controller.test.ts` | 6 CRUD HTTP | ✅ |
| `leads.test.ts` (integration) | 8 API REST | ✅ |
| `order.test.ts` | 26 state machine + desconto | ✅ |
| `purchase.test.ts` | 14 domínio | ✅ |
| `CreateOrderUseCase.test.ts` | 6 criação pedido | ✅ |
| `ReceiveInventoryUseCase.test.ts` | 6 receber estoque | ✅ |
| `orders.test.ts` (integration) | 8 API REST | ✅ |
| `purchases.test.ts` (integration) | 6 API REST | ✅ |
| `wishlist.test.ts` (domain) | domínio Wishlist | ✅ |
| `WishlistUseCases.test.ts` | Add/Remove/Get | ✅ |
| `wishlist.test.ts` (integration) | API REST | ✅ |
| `GeneratePaymentQRCodeUseCase.test.ts` | PIX BRCode + CRC16 | ✅ |
| `lead-wishlist-real.test.ts` | persistência real DB | ✅ |
| `CreateCampaignUseCase.test.ts` | - | 🔄 Pendente |
| `ListCustomersUseCase.test.ts` | - | 🔄 Pendente |
| `GetSettingsUseCase.test.ts` | - | 🔄 Pendente |
| `AuthService.test.ts` | refresh, logout, expirado | 🔄 Pendente |
| `DiscountService.test.ts` | edge cases | 🔄 Pendente |

**Total backend: 163+ testes passando**

### 8.2 Frontend

| Arquivo | Cenários | Status |
|---------|----------|--------|
| `AuthContext.test.tsx` | login, logout, cookie, role | ✅ |
| `useWishlist.test.ts` | add/remove, localStorage | ✅ |
| MSW handlers | mock endpoints | ✅ |
| `useFontSize.test.ts` | A+/A-, persistência | 🔄 Pendente |
| CartContext tests | carrinho completo | 🔄 Pendente |
| Components tests | ProductCard, Magnifier | 🔄 Pendente |
| Pages tests | Homepage, Login, Wishlist | 🔄 Pendente |

**Total frontend: 10+ testes passando**

---

## 9. Status dos Módulos

### 9.1 Backend
| Módulo | Status |
|--------|--------|
| Products CRUD + SKU | ✅ |
| ProductVariant + FulfillmentType híbrido | ✅ |
| VariantAuditSubscriber (shadow table) | ✅ |
| Leads CRUD + status flow | ✅ |
| Auth JWT (login, register, refresh) | ✅ |
| Orders + state machine + DiscountService | ✅ |
| Purchases + ReceiveInventory | ✅ |
| Campaigns CRUD + paginação | ✅ |
| Customers CRUD + paginação | ✅ |
| Product History API | ✅ |
| Settings API (chave-valor) | ✅ |
| Wishlist API | ✅ |
| Upload de imagem (Multer) | ✅ |
| PIX InfinitePay + Webhook HMAC | ✅ |
| Ledger Financeiro (FinancialTransactions) | ✅ |
| Simulação DEV de Pagamentos | ✅ |
| Paginação Orders/Purchases/Leads | 🔄 |
| Auditoria lead confirmado | 🔄 |

### 9.2 Frontend
| Módulo | Status |
|--------|--------|
| Catálogo com imagens | ✅ |
| CartContext + FloatingCart + CartDrawer | ✅ |
| Wishlist (coração + modal) | ✅ |
| useWishlistFlow (lead + wishlist + cart) | ✅ |
| WhatsApp Integration | ✅ |
| useFontSize + botões A+/A- | ✅ |
| Product Magnifier | ✅ |
| SettingsContext (dados via API) | ✅ |
| AuthContext + login/register | ✅ |
| Middleware proteção de rotas | ✅ |
| PixQRCodeDisplay | ✅ |
| Área admin (confirmar pagamento) | ✅ |
| Skeleton loaders | 🔄 |

---

## 10. Problemas Conhecidos

| Problema | Causa | Status |
|----------|-------|--------|
| Limite de taxa InfinitePay em DEV | IPs dinâmicos podem não receber webhook | 🔄 Pendente (Usar ngrok) |

### Resolvidos
| Problema | Solução | Versão |
|----------|---------|--------|
| Ausência de Fluxo Contábil | Criada tabela financial_transactions gerada nos webhooks e manual. | 1.7.0 |
| PIX não confirmava | Endpoint /dev/simulate-payment e /webhooks criados e ativos. | 1.6.5 |
| QRCode exibe R$ 0,00 | Corrigido uso do `total` e conversões centavos. | 1.6.0 |
| OrderSchema columns bug | Resolvido mapeamento camelCase/snake_case nativo do banco. | 1.6.0 |
| No metadata for AuditLogModel | Fix no AppDataSource e injeção do schema. | 1.6.0 |
| variant17 não encontrada | variantId enviado como string em vez de number | 1.5.1 |
| imageUrl no ProductSchema | removido do schema — gerado dinamicamente | 1.4.1 |
| UserSchema sem campo name | ALTER TABLE + mapeamento | 1.3.0 |
| Login quebrado (productRepository) | userRepository corrigido em auth.routes.ts | 1.5.0 |

---

## 11. Ciclo TDD

```bash
# RED
npm test -- --testNamePattern="deve criar pedido"

# GREEN
# implementar CreateOrderUseCase

# REFACTOR
npm test
```

### Estrutura padrão de teste
```typescript
describe('Classe/Sistema', () => {
  describe('método específico', () => {
    it('deve fazer algo esperado', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Comandos
```bash
# Backend
cd backend && npm test
cd backend && npm test -- --coverage
cd backend && npm test -- lead.test.ts

# Frontend
cd shop-varejo && npm test
cd shop-varejo && npm test -- --coverage
```

---

## 12. Cobertura Estimada

| Camada | Backend | Frontend | Meta |
|--------|---------|----------|------|
| Domain Entities | 95% | — | >90% |
| Use Cases | 90% | — | >85% |
| Controllers | 75% | — | >70% |
| Middlewares | 60% | — | >60% |
| Infrastructure | 45% | — | >40% |
| Contexts/Hooks | — | 80% | >80% |
| Components | — | 30% | >60% |
| Pages | — | 10% | >40% |

---

## 13. Próximos Passos

### Sprint 02 (Concluída 🚀)
- [x] Corrigir valor R$ 0,00 no QRCode PIX
- [x] Implementar botão confirmar pagamento (admin)
- [x] Rota DEV de simulação de pagamentos
- [x] Criação de Fluxo de Caixa / Ledger Contábil (FinancialTransaction)
- [x] Webhook da InfinitePay (automação HMAC)

### Sprint 03 (Pendente)
- [ ] AuthService.test.ts e DiscountService.test.ts
- [ ] Paginação em Orders, Purchases e Leads
- [ ] Skeleton loaders no frontend
- [ ] Dashboard Financeiro / Gráficos de Contabilidade no Admin
- [ ] CI/CD GitHub Actions
- [ ] A11Y tests com jest-axe
- [ ] E2E Cypress/Playwright
- [ ] Build produção

---

## 14. Histórico de Versões

| 1.7.0 | 2026-05-04 | Sincronização arquitetural TDD (Auditor). Fluxo de Ledger Financeiro implementado. Integração PIX Automática concluída. Bugfixes críticos TypeORM. |
| 1.6.0 | 2026-05-04 | Merge TDD v1.5.0 + TDD separado. Wishlist módulo completo. PIX MVP em progresso. Correção mapeamento camelCase orders. 163+ testes. |
| 1.5.0 | 2026-05-02 | Frontend completo: catálogo, cart, wishlist, auth, PIX tela. Login restaurado. |
| 1.4.1 | 2026-04-29 | imageUrl dinâmica via APP_URL |
| 1.4.0 | 2026-04-28 | ERP Medium: Campaigns, Customers, History, Settings |
| 1.3.0 | 2026-04-27 | Security: UserSchema name, Seed Admin. Frontend-Bridge |
| 1.2.0 | 2026-04-27 | Integração Frontend-Backend |
| 1.1.0 | 2026-04-27 | Sales, Procurement, Catalog, QA |

---

**Autor: Dalmo Pereira / Agentes Antigravity**
*Atualizado: 2026-05-04 | v1.7.0*