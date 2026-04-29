# TDD - Sisters Lab Backend

## Test-Driven Development Specification

---

## 1. Stack Técnica

| Tecnologia | Versão |
|------------|--------|
| TypeScript | 5.4.5 |
| Express | 5.2.1 |
| TypeORM | 0.3.28 |
| JWT (jsonwebtoken) | - |
| Jest | 29.7.0 |
| Zod | 4.3.6 |

### Arquitetura
- **Clean Architecture** - Domain, Use Cases, Interfaces, Infrastructure, Adapters
- **SOLID** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **MVC** - Model (Domain + Repositories), View (DTOs), Controller (Adapters HTTP)
- **DI Container** - Inversão de dependência via Container

---

## 2. Estrutura de Pastas

```
src/
├── adapters/http/
│   ├── controllers/
│   │   ├── LeadController.ts
│   │   ├── ProductController.ts
│   │   └── SupplierController.ts
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
│   │   └── user.routes.ts
│   └── validations/
│       ├── lead.validation.ts
│       ├── product.validation.ts
│       └── supplier.validation.ts
├── core/
│   ├── container/
│   │   └── Container.ts
│   ├── domain/
│   │   ├── Product.ts (Entidade Rica)
│   │   ├── ProductVariant.ts (Entidade Rica)
│   │   ├── Lead.ts (Entidade Rica)
│   │   ├── User.ts
│   │   ├── Supplier.ts
│   │   ├── Customer.ts
│   │   ├── Campaign.ts
│   │   ├── AuditLog.ts
│   │   ├── ProductHistory.ts
│   │   ├── Settings.ts
│   │   ├── UserProfile.ts
│   │   └── services/SkuService.ts (OCP - ISkuFormatter)
│   ├── dto/
│   │   ├── AuthDTO.ts
│   │   ├── LeadDTO.ts
│   │   ├── ProductDTO.ts
│   │   └── SupplierDTO.ts
│   ├── errors/
│   │   ├── AppError.ts
│   │   └── CustomErrors.ts
│   └── interfaces/
│       ├── IProductRepository.ts
│       ├── IUserRepository.ts
│       ├── ISupplierRepository.ts
│       ├── ILeadRepository.ts
│       ├── IAuditRepository.ts
│       ├── IProductSKU.ts
│       └── IAuthService.ts
├── infrastructure/
│   ├── auth/AuthService.ts (implementa IAuthService)
│   ├── cache/cache.ts
│   ├── database/
│   │   ├── mappers/ (TypeORM Schemas)
│   │   │   ├── ProductSchema.ts
│   │   │   ├── ProductVariantSchema.ts
│   │   │   ├── LeadSchema.ts
│   │   │   ├── SupplierSchema.ts
│   │   │   ├── UserSchema.ts
│   │   │   ├── VariantHistorySchema.ts (Shadow Table)
│   │   │   └── ...
│   │   ├── repositories/
│   │   │   ├── TypeORMProductRepository.ts
│   │   │   ├── TypeORMLeadRepository.ts
│   │   │   ├── TypeORMUserRepository.ts
│   │   │   ├── TypeORMSupplierRepository.ts
│   │   │   └── TypeORMAuditRepository.ts
│   │   ├── subscribers/VariantAuditSubscriber.ts
│   │   ├── data-source.ts
│   │   └── server-init.ts
│   ├── logger/logger.ts
│   ├── swagger/swagger.ts
│   └── upload/upload.ts
├── __tests__/
│   ├── setup.ts
│   ├── performance.test.ts (9 testes)
│   ├── integration/leads.test.ts (8 testes)
│   └── unit/
│       ├── lead.test.ts (15 testes)
│       ├── CreateLeadUseCase.test.ts (7 testes)
│       └── controllers/
│           └── product.controller.test.ts (6 testes)
└── server.ts
```

---

## 3. Entidades (POO - Entidades Ricas)

### 3.1 Product
```typescript
class Product {
  id: number;
  name: string;
  brand?: string | null;        // ✅ NULLABLE: Aceita nulos para resiliência contra legados
  category: ProductCategory;
  basePrice?: number | null;     // ✅ NULLABLE: Aceita nulos para resiliência contra legados
  originalPrice?: number;
  badge?: ProductBadge;
  specs?: Record<string, any>;
  featured: boolean;
  inStock: boolean;
  imageName: string;             // Nome do arquivo (ex: tenis-runner-pro.webp)
  imageUrl?: string | null;       // URL completa gerada dinamicamente pelo Use Case
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;

  // Métodos de negócio (Entidade Rica)
  get discountPercentage(): number;
  get hasDiscount(): boolean;
  get hasVariants(): boolean;
  get totalStock(): number;
  get isFeatured(): boolean;
  markAsFeatured(): void;
  unmarkAsFeatured(): void;
  applyDiscount(newPrice: number): void;
  removeDiscount(): void;
  updateBasePrice(newPrice: number): void;
  updateCategory(category: ProductCategory): void;
  addVariant(variant: ProductVariant): void;
  removeVariant(sku: string): void;
  findVariantBySku(sku: string): ProductVariant | undefined;
  updateStock(quantity: number): void;
}
```

### 3.1.1 Image Handling (Frontend-Side)
- **Backend:** Retorna apenas `imageName` (ex: "produto-6.webp") no DTO
- **Frontend:** Next.js serve `public/` na raiz, então `/img/catalogo/{imageName}` resolve para `shop-varejo/public/img/catalogo/{imageName}`
- **ProductCard.tsx:** Constrói `imageSrc` localmente:
  ```typescript
  const imageSrc = imageName
    ? `/img/catalogo/${imageName}`
    : '/img/catalogo/produto-default.webp';
  ```
- **Vantagem:** Imagens servidas pelo Next.js em `localhost:3000`, não pelo backend em `localhost:3001`
- **next.config.js:** Remote patterns para `localhost:3001` não são mais necessários

### 3.1.2 Mapeamento TypeORM (ProductSchema.ts)
```typescript
{
  brand: { type: "varchar", length: 100, nullable: true },      // ✅ Atualizado
  basePrice: { type: "int", nullable: true },                   // ✅ Atualizado
  imageName: { type: "varchar", length: 255 },                // ✅ Apenas imageName no banco
  // imageUrl NÃO existe no banco - gerado dinamicamente no Use Case
}
```
- **Nota:** Campo `imageUrl` REMOVIDO do ProductSchema.ts (coluna não existia no banco, causava erro 500).

### 3.2 ProductVariant
```typescript
enum FulfillmentType {
  ON_DEMAND = 'ON_DEMAND',
  IN_STOCK = 'IN_STOCK'
}

class ProductVariant {
  id?: number;
  sku: string;
  productId: number;
  color: string;
  size: string;
  price: number;
  private _stock: number; // encapsulado
  fulfillmentType: FulfillmentType;
  inStock: boolean;

  // Getter/Setter com validação
  get stock(): number;
  set stock(value: number); // valida negativo para IN_STOCK

  // Métodos de negócio (Entidade Rica)
  isOnDemand(): boolean;
  isInStock(): boolean;
  requiresStock(): boolean;
  decreaseStock(amount: number): void;
  increaseStock(amount: number): void;
}
```

### 3.3 Lead
```typescript
enum LeadStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

class Lead {
  id: number;
  sku: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: LeadStatus;
  notes?: string;
  productId?: number;
  variantId?: number;
  createdAt: Date;
  updatedAt: Date;

  // Construtor com estado inicial PENDING
  constructor(props?: Partial<Lead>);

  // Métodos de negócio (Entidade Rica)
  confirm(): void;
  reject(): void;
  isPending(): boolean;
  isConfirmed(): boolean;
  isRejected(): boolean;
  updateNotes(notes: string): void;
}
```

### 3.3 ProductResponseDTO
```typescript
export interface ProductResponseDTO {
  id: number;
  name: string;
  brand?: string | null;           // ✅ Nullable conforme entidade
  category: ProductCategory;
  basePrice?: number | null;        // ✅ Nullable conforme entidade
  description?: string;
  originalPrice?: number | null;
  badge?: ProductBadge | null;
  specs?: Record<string, unknown>;
  featured: boolean;
  inStock: boolean;
  imageName: string;               // Apenas o filename: "produto-6.webp"
  createdAt: Date;
  updatedAt: Date;
}
```
- **Nota:** DTO agora retorna apenas `imageName` (sem `imageUrl`)
- **Frontend:** Constrói o caminho localmente usando `/img/catalogo/{imageName}`

### 3.4 User
```typescript
enum UserRole {
  ADMIN = 'admin',
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer'
}

class User {
  id: number;
  email: string;
  password: string;
  name?: string;  // ✅ Mapeado no UserSchema.ts (VARCHAR(255), nullable)
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.5 Supplier
```typescript
class Supplier {
  id: number;
  companyName: string;
  cnpj: string;
  contactEmail?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. Interfaces (SOLID - Dependency Inversion)

### 4.1 Repositories
```typescript
interface IProductRepository
interface IUserRepository
interface ISupplierRepository
interface ILeadRepository
interface IAuditRepository
```

### 4.2 Serviços
```typescript
interface IAuthService {
  generateTokens(user: { id: number; email: string; role: UserRole }): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}
```

### 4.3 SkuService (OCP - Open/Closed Principle)
```typescript
interface ISkuFormatter {
  format(input: SkuInput): string;
}

class DefaultSkuFormatter implements ISkuFormatter {
  format(input: SkuInput): string; // {brand}-{name}-{category}-{color}-{size}
}

class SkuService {
  constructor(formatter?: ISkuFormatter);
  generate(input: SkuInput): string;
  setFormatter(formatter: ISkuFormatter): void; // Aberto para extensão
}
```

---

## 5. Casos de Uso

### 5.1 Products
| Use Case | Descrição | Status |
|---------|----------|--------|
| CreateProductUseCase | Cria produto + variantes (cartesian product) | ✅ COMPLETO |
| ListProductsUseCase | Lista com filtros/paginação (retorna imageName) | ✅ COMPLETO |
| GetProductBySkuUseCase | Busca por SKU (retorna imageName) | ✅ COMPLETO |
| SeedProductsUseCase | Seed de dados | ✅ COMPLETO |
| UpdateProductUseCase | Atualiza produto | ❌ NÃO IMPLEMENTADO |
| DeleteProductUseCase | Remove produto | ❌ NÃO IMPLEMENTADO |

### 5.1.1 Change Log (v1.4.2 - 2026-04-29)
- ✅ **ListProductsUseCase.ts:** Removida lógica de gerar URL completa (APP_URL)
- ✅ **GetProductBySkuUseCase.ts:** Removida lógica de gerar URL completa
- ✅ **ProductResponseDTO:** Removido campo `imageUrl` (agora retorna apenas `imageName`)
- ✅ **Product.ts:** `imageUrl` agora é campo comum (não getter)
- ✅ **Imagens:** Servidas localmente pelo Next.js em `localhost:3000`

### 5.2 Leads
| Use Case | Descrição | Status |
|---------|----------|--------|
| CreateLeadUseCase | Cria lead (PENDING) | ✅ COMPLETO |
| ListLeadsUseCase | Lista leads | ✅ COMPLETO |
| GetLeadByIdUseCase | Busca lead por ID | ✅ COMPLETO |
| UpdateLeadStatusUseCase | Atualiza status | ✅ COMPLETO |
| DeleteLeadUseCase | Remove lead | ✅ COMPLETO |
| CountLeadsUseCase | Conta leads por status | ✅ COMPLETO |

### 5.3 Auth
| Use Case | Descrição | Status |
|---------|----------|--------|
| AuthUseCases.login() | Login JWT | ✅ COMPLETO |
| AuthUseCases.register() | Registro | ✅ COMPLETO |
| AuthUseCases.refreshToken() | Refresh token | ✅ COMPLETO |

### 5.4 Suppliers
| Use Case | Descrição | Status |
|---------|----------|--------|
| CreateSupplierUseCase | Cria supplier | ✅ COMPLETO |
| ListSuppliersUseCase | Lista suppliers | ✅ COMPLETO |
| GetSupplierByIdUseCase | Busca supplier | ✅ COMPLETO |
| UpdateSupplierUseCase | Atualiza supplier | ✅ COMPLETO |
| DeleteSupplierUseCase | Remove supplier | ✅ COMPLETO |

---

## 6. API Endpoints

### 6.1 Products
| Método | Endpoint | Descrição | Auth | Status |
|--------|----------|-----------|------|--------|
| GET | `/api/v1/products` | Listar com filtros + imageName | Não | ✅ |
| POST | `/api/v1/products` | Criar | Não | ✅ |
| GET | `/api/v1/products/:sku` | Buscar por SKU + imageName | Não | ✅ |
| PUT | `/api/v1/products/:sku` | Atualizar | - | ❌ NÃO IMPLEMENTADO |
| DELETE | `/api/v1/products/:sku` | Deletar | - | ❌ NÃO IMPLEMENTADO |

### 6.2 Leads
| Método | Endpoint | Descrição | Auth | Status |
|--------|----------|----------|------|--------|
| GET | `/api/v1/leads` | Listar | Não | ✅ |
| POST | `/api/v1/leads` | Criar | Não | ✅ |
| GET | `/api/v1/leads/:id` | Buscar | Não | ✅ |
| PATCH | `/api/v1/leads/:id` | Atualizar status | Admin | ✅ |
| DELETE | `/api/v1/leads/:id` | Deletar | Admin | ✅ |

### 6.3 Suppliers
| Método | Endpoint | Descrição | Auth | Status |
|--------|----------|----------|------|--------|
| GET | `/api/v1/suppliers` | Listar | Não | ✅ |
| POST | `/api/v1/suppliers` | Criar | Não | ✅ |
| GET | `/api/v1/suppliers/:id` | Buscar | Não | ✅ |
| PUT | `/api/v1/suppliers/:id` | Atualizar | Não | ✅ |
| DELETE | `/api/v1/suppliers/:id` | Deletar | Não | ✅ |

### 6.4 Users
| Método | Endpoint | Descrição | Auth | Status |
|--------|----------|----------|------|--------|
| GET | `/api/v1/users` | Listar | Admin | ✅ |
| POST | `/api/v1/users` | Criar | Admin | ✅ |
| GET | `/api/v1/users/:id` | Buscar | Auth | ✅ |
| PUT | `/api/v1/users/:id` | Atualizar | Auth | ✅ |
| DELETE | `/api/v1/users/:id` | Deletar | Admin | ✅ |

### 6.5 Auth
| Método | Endpoint | Descrição | Auth | Status |
|--------|----------|----------|------|--------|
| POST | `/api/v1/auth/login` | Login | Não | ✅ |
| POST | `/api/v1/auth/register` | Registro | Não | ✅ |
| POST | `/api/v1/auth/refresh` | Refresh | Não | ✅ |

### 6.6 Admin
| Método | Endpoint | Descrição | Auth | Status |
|--------|----------|----------|------|--------|
| GET | `/api/v1/admin/dashboard` | Dashboard | Admin | ✅ COMPLETO |
| GET | `/api/v1/admin/stats` | Estatísticas | Admin | ✅ COMPLETO |

### 6.7 Health
| Método | Endpoint | Descrição | Status |
|--------|----------|------------|--------|
| GET | `/api/health` | Health check | ✅ |
| GET | `/api/health/ready` | Readiness | ✅ |
| GET | `/api/health/live` | Liveness | ✅ |

---

## 7. Middlewares

### 7.1 Auth
```typescript
authenticate()      // Valida JWT
authorize(roles)     // Verifica role
requireAdmin        // Somente admin
requireSupplier    // Admin + Supplier
requireCustomer    // Todos autenticados
```

### 7.2 Rate Limiting
```typescript
defaultRateLimit    // 100 req/min
authRateLimit       // 5 req/15min
```

### 7.3 Validation (Zod)
```typescript
validate(schema)     // Zod validation (parseAsync)
```

---

## 8. DI Container

### 8.1 Tokens Registrados
```typescript
'IProductRepository'
'IUserRepository'
'ISupplierRepository'
'ILeadRepository'
'IAuditRepository'
'SkuService'
'IAuthService'
'ListProductsUseCase'
'CreateProductUseCase'
'GetProductBySkuUseCase'
'CreateLeadUseCase'
'ListLeadsUseCase'
'GetLeadByIdUseCase'
'UpdateLeadStatusUseCase'
'DeleteLeadUseCase'
'CountLeadsUseCase'
'AuthUseCases'
'CreateSupplierUseCase'
'ListSuppliersUseCase'
'GetSupplierByIdUseCase'
'UpdateSupplierUseCase'
'DeleteSupplierUseCase'
```

### 8.2 Injeção de AuthUseCases
```typescript
Container.registerSingleton('AuthUseCases', () => new AuthUseCases(
  Container.resolve(userRepositoryToken),  // IUserRepository
  Container.resolve(authServiceToken)       // IAuthService
));
```

---

## 9. Testes

### 9.1 Test Suites
| Suite | Testes | Status |
|-------|--------|--------|
| performance.test.ts | 9 | ✅ PASS |
| lead.test.ts | 15 | ✅ PASS |
| product.controller.test.ts | 6 | ✅ PASS |
| CreateLeadUseCase.test.ts | 7 | ✅ PASS |
| leads.test.ts (integration) | 8 | ✅ PASS |

### 9.2 Performance Tests
| Metrica | Limite | Real | Status |
|---------|--------|------|--------|
| 1000 SKU generation | < 100ms | 3ms | ✅ PASS |
| Cache get/set | < 5ms | 1ms | ✅ PASS |
| Cache TTL | 150ms | 151ms | ✅ PASS |
| Large cache operations (1000) | < 500ms | 4ms | ✅ PASS |
| Product entity creation (1000) | < 200ms | 4ms | ✅ PASS |
| DTO transformation (1000) | < 100ms | 1ms | ✅ PASS |

### 9.3 Unit Tests
| Categoria | Testes |
|------------|--------|
| Lead Entity | 5 |
| LeadStatus | 3 |
| ProductVariant | 7 |
| FulfillmentType | 2 |
| CreateLeadUseCase | 7 |
| Use Cases Logic | 3 |

---

## 10. Regras de Negócio

### 10.1 SKU
- ✅ Único e imutável
- ✅ Formato: `{brand}-{name}-{category}-{color}-{size}`
- ✅ Validação: brand, name, category, color, size são obrigatórios

### 10.2 FulfillmentType
- ✅ `ON_DEMAND` - Sob demanda (não controla estoque)
- ✅ `IN_STOCK` - Em estoque (stock >= 0, impede negativo)

### 10.3 Lead Status
- ✅ `PENDING` - Estado inicial (construtor)
- ✅ `CONFIRMED` - Confirmado via confirm()
- ✅ `REJECTED` - Rejeitado via reject()

---

## 11. Erros Customizados

```typescript
class NotFoundError extends AppError { }      // 404
class UnauthorizedError extends AppError { }  // 401
class ForbiddenError extends AppError { }     // 403
class ValidationError extends AppError { }    // 400
class ConflictError extends AppError { }      // 409
class BadRequestError extends AppError { }    // 400
class InternalServerError extends AppError { } // 500
```

---

## 12. Cobertura de Testes

**Total: 45 testes passando**

| Módulo | Testes |
|--------|--------|
| Performance | 9 |
| Lead + ProductVariant | 15 |
| Product Controller | 6 |
| CreateLeadUseCase | 7 |
| Leads Validation (integration) | 8 |

---

## 13. Infraestrutura

### 13.1 Database
- ✅ TypeORM 0.3.28 configurado
- ✅ Entity Schemas em `mappers/` (isolados das entidades de domínio)
- ✅ Seed de produtos
- ✅ Auditoria de variantes via `VariantAuditSubscriber`
- ✅ **UserSchema atualizado:** coluna `name VARCHAR(255) NULL` adicionada (migration executada)
- ✅ **ProductSchema corrigido:** REMOVIDO campo `imageUrl` (não existia no banco, causava erro 500)
- ✅ **Variável APP_URL:** Adicionada no `.env` (ex: `http://localhost:3001`)

### 13.2 TypeORM Schemas (Shadow Tables)
```typescript
ProductVariantSchema  // EntitySchema para ProductVariant
ProductSchema         // EntitySchema para Product
LeadSchema           // EntitySchema para Lead
SupplierSchema       // EntitySchema para Supplier
UserSchema           // EntitySchema para User
VariantHistorySchema // Shadow table para auditoria
```

### 13.3 VariantAuditSubscriber
```typescript
@EventSubscriber()
export class VariantAuditSubscriber implements EntitySubscriberInterface<ProductVariant> {
  async afterUpdate(event: UpdateEvent<ProductVariant>) {
    // Registra alterações de stock e price em VariantHistorySchema
  }
}
```

### 13.4 Cache
- ✅ Sistema de cache em memória
- ✅ TTL configurável
- ✅ Operações < 5ms

### 13.5 Logging
- ✅ Winston configurado
- ✅ Logs de requisição via LogMiddleware

### 13.6 API Documentation
- ✅ Swagger UI disponível em `/api/docs`

### 13.7 Upload
- ✅ Multer configurado

---

## 14. Boas Práticas Implementadas

### 14.1 Clean Architecture
- ✅ **Domain** (core/domain) - Entidades e regras de negócio
- ✅ **Use Cases** (core/use-cases) - Lógica de aplicação
- ✅ **Interfaces** (core/interfaces) - Contratos (DIP)
- ✅ **Infrastructure** (infrastructure) - Implementações concretas
- ✅ **Adapters** (adapters/http) - Camada de entrega MVC

### 14.2 SOLID
- ✅ **S**ingle Responsibility: Entidades ricas com métodos de negócio
- ✅ **O**pen/Closed: SkuService com ISkuFormatter
- ✅ **L**iskov Substitution: Interfaces para repositórios
- ✅ **I**nterface Segregation: IAuthService, IProductRepository, etc.
- ✅ **D**ependency Inversion: Use Cases dependem de interfaces, não implementações

### 14.3 MVC
- ✅ **Model**: Domain entities + Repositories
- ✅ **View**: DTOs
- ✅ **Controller**: Adapters HTTP Controllers

### 14.4 Clean Code
- ✅ Variáveis em inglês
- ✅ Nomes descritivos
- ✅ Sem 'new' em Controllers (uso de DI Container)
- ✅ Tratamento de erros explícito (nunca catch vazio)

---

## 15. Funcionalidades Faltantes

### 🔴 Prioridade Alta
| Item | Descrição |
|------|-----------|
| UpdateProductUseCase | PUT /api/v1/products/:sku |
| DeleteProductUseCase | DELETE /api/v1/products/:sku |

### 🟡 Prioridade Média
| Item | Descrição |
|------|-----------|
| Campaigns CRUD | Entidade existe sem API |
| Customers CRUD | Entidade existe sem API |
| Product History API | Entidade existe sem endpoint |
| Settings API | Entidade existe sem endpoint |
| Upload de imagens | Configurado mas não usado |
| Notificações email | Lead confirmation sem email |
| Paginação completa | Só products tem |

---

## 16. Módulos Implementados (Agents)

### 16.1 Refatoração de Interface (v1.4.0 - INÍCIO)
**Diretriz do PRD.md:**
- ✅ **Identidade Visual (Cores):** CONGELADA. As cores atuais (Preto #000, Branco #FFF, Verde Neon #00FF00) são imutáveis.
- 🛠️ **Moldura e Layout:** FLEXÍVEL. Agentes UX e UI têm liberdade técnica para remodelar estrutura, componentes e disposição para maximizar conversão.

**Agentes Responsáveis:**
- **Agent UX:** Otimização da hierarquia de informação e fluxos de usuário.
- **Agent UI:** Remodelagem visual da "moldura", garantindo uso exclusivo da paleta pré-estabelecida.

### 16.2 Sales (Orders) - ✅ COMPLETO
| Arquivo | Descrição |
|---------|-----------|
| `src/core/domain/Order.ts` | Entidade rica com state machine |
| `src/core/domain/OrderItem.ts` | Item do pedido |
| `src/core/interfaces/IOrderRepository.ts` | Interface de repositório |
| `src/core/use-cases/orders/OrderUseCases.ts` | Create, Update, Cancel, List |
| `src/infrastructure/database/mappers/OrderSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/mappers/OrderItemSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/repositories/TypeORMOrderRepository.ts` | Repositório |
| `src/adapters/http/controllers/OrderController.ts` | Controller |
| `src/adapters/http/routes/order.routes.ts` | Rotas REST |
| `src/adapters/http/validations/order.validation.ts` | Zod validation |

**Endpoints:**
- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/status`
- `POST /api/v1/orders/:id/cancel`

### 16.3 ERP Medium - ✅ COMPLETO (v1.4.0)

#### 16.3.1 Campaigns CRUD
| Arquivo | Descrição |
|---------|-----------|
| `src/core/interfaces/ICampaignRepository.ts` | Interface |
| `src/core/use-cases/campaigns/CreateCampaignUseCase.ts` | Criar |
| `src/core/use-cases/campaigns/ListCampaignsUseCase.ts` | Listar paginado |
| `src/core/use-cases/campaigns/GetCampaignByIdUseCase.ts` | Buscar por ID |
| `src/core/use-cases/campaigns/UpdateCampaignUseCase.ts` | Atualizar |
| `src/core/use-cases/campaigns/DeleteCampaignUseCase.ts` | Remover |
| `src/core/dto/CampaignDTO.ts` | DTO |
| `src/infrastructure/database/mappers/CampaignSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/repositories/TypeORMCampaignRepository.ts` | Repositório |
| `src/adapters/http/controllers/CampaignController.ts` | Controller |
| `src/adapters/http/routes/campaign.routes.ts` | Rotas |
| `src/adapters/http/validations/campaign.validation.ts` | Zod |

**Endpoints:**
- `GET /api/v1/campaigns` (paginação)
- `POST /api/v1/campaigns`
- `GET /api/v1/campaigns/:id`
- `PUT /api/v1/campaigns/:id`
- `DELETE /api/v1/campaigns/:id`

#### 16.3.2 Customers CRUD
| Arquivo | Descrição |
|---------|-----------|
| `src/core/interfaces/ICustomerRepository.ts` | Interface |
| `src/core/use-cases/customers/CreateCustomerUseCase.ts` | Criar |
| `src/core/use-cases/customers/ListCustomersUseCase.ts` | Listar paginado |
| `src/core/use-cases/customers/GetCustomerByIdUseCase.ts` | Buscar por ID |
| `src/core/use-cases/customers/UpdateCustomerUseCase.ts` | Atualizar |
| `src/core/use-cases/customers/DeleteCustomerUseCase.ts` | Remover |
| `src/core/dto/CustomerDTO.ts` | DTO |
| `src/infrastructure/database/mappers/CustomerSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/repositories/TypeORMCustomerRepository.ts` | Repositório |
| `src/adapters/http/controllers/CustomerController.ts` | Controller |
| `src/adapters/http/routes/customer.routes.ts` | Rotas |
| `src/adapters/http/validations/customer.validation.ts` | Zod |

**Endpoints:**
- `GET /api/v1/customers` (paginação)
- `POST /api/v1/customers`
- `GET /api/v1/customers/:id`
- `PUT /api/v1/customers/:id`
- `DELETE /api/v1/customers/:id`

#### 16.3.3 Product History API
| Arquivo | Descrição |
|---------|-----------|
| `src/core/interfaces/IVariantHistoryRepository.ts` | Interface |
| `src/core/use-cases/history/ListProductHistoryUseCase.ts` | Listar histórico |
| `src/core/dto/ProductHistoryDTO.ts` | DTO |
| `src/infrastructure/database/repositories/TypeORMProductHistoryRepository.ts` | Repositório |
| `src/adapters/http/controllers/ProductHistoryController.ts` | Controller |
| `src/adapters/http/routes/product-history.routes.ts` | Rotas |

**Endpoints:**
- `GET /api/v1/products/:sku/history` (histórico por variante)
- `GET /api/v1/history` (histórico geral, admin)

#### 16.3.4 Settings API
| Arquivo | Descrição |
|---------|-----------|
| `src/core/interfaces/ISettingsRepository.ts` | Interface |
| `src/core/use-cases/settings/GetSettingsUseCase.ts` | Listar/Obter |
| `src/core/use-cases/settings/UpdateSettingUseCase.ts` | Atualizar |
| `src/core/dto/SettingsDTO.ts` | DTO |
| `src/infrastructure/database/mappers/SettingsSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/repositories/TypeORMSettingsRepository.ts` | Repositório |
| `src/adapters/http/controllers/SettingsController.ts` | Controller |
| `src/adapters/http/routes/settings.routes.ts` | Rotas |
| `src/adapters/http/validations/settings.validation.ts` | Zod |

**Endpoints:**
- `GET /api/v1/settings` (admin)
- `PATCH /api/v1/settings/:key` (admin)

#### 16.3.5 Lead Audit
- **Arquivo:** `src/core/use-cases/lead/UpdateLeadStatusUseCase.ts`
- **Lógica:** Ao confirmar lead (status `CONFIRMED`), registra evento `lead_confirmed` no AuditLog via `IAuditRepository`

### 16.2 Procurement (Purchases) - ✅ COMPLETO
| Arquivo | Descrição |
|---------|-----------|
| `src/core/domain/Purchase.ts` | Entidade rica com receiveInventory |
| `src/core/domain/PurchaseItem.ts` | Item do pedido de compra |
| `src/core/interfaces/IPurchaseRepository.ts` | Interface de repositório |
| `src/core/use-cases/procurement/CreatePurchaseOrderUseCase.ts` | Criar pedido |
| `src/core/use-cases/procurement/ReceiveInventoryUseCase.ts` | Receber mercadoria |
| `src/core/use-cases/procurement/ListPurchasesUseCase.ts` | Listar |
| `src/infrastructure/database/mappers/PurchaseSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/mappers/PurchaseItemSchema.ts` | TypeORM Schema |
| `src/infrastructure/database/repositories/TypeORMPurchaseRepository.ts` | Repositório |
| `src/adapters/http/controllers/PurchaseController.ts` | Controller |
| `src/adapters/http/routes/purchase.routes.ts` | Rotas REST |
| `src/adapters/http/validations/purchase.validation.ts` | Zod validation |

**Endpoints:**
- `GET /api/v1/purchases`
- `POST /api/v1/purchases`
- `POST /api/v1/purchases/:id/receive`

### 16.3 Catalog (Update/Delete) - ✅ COMPLETO
| Arquivo | Descrição |
|---------|-----------|
| `src/core/use-cases/catalog/UpdateProductUseCase.ts` | Atualizar produto |
| `src/core/use-cases/catalog/DeleteProductUseCase.ts` | Deletar produto (verifica orders ativas) |

**Endpoints (adicionados):**
- `PUT /api/v1/products/:sku`
- `DELETE /api/v1/products/:sku`

### 16.4 QA Tests - ✅ COMPLETO
| Arquivo | Testes |
|---------|--------|
| `src/__tests__/unit/order.test.ts` | 26 |
| `src/__tests__/unit/purchase.test.ts` | 14 |
| `src/__tests__/unit/CreateOrderUseCase.test.ts` | 6 |
| `src/__tests__/unit/ReceiveInventoryUseCase.test.ts` | 6 |
| `src/__tests__/integration/orders.test.ts` | 8 |
| `src/__tests__/integration/purchases.test.ts` | 6 |

---

## 16. Novos Módulos (Agent ERP Medium v1.4)

### 16.1 Campaigns CRUD
| Arquivo | Descrição |
|---------|-----------|
| `src/core/dto/CampaignDTO.ts` | CreateCampaignDTO, UpdateCampaignDTO, CampaignQueryDTO |
| `src/core/use-cases/campaign/CampaignUseCases.ts` | CreateCampaignUseCase, ListCampaignsUseCase, GetCampaignByIdUseCase, UpdateCampaignUseCase, DeleteCampaignUseCase |
| `src/infrastructure/database/repositories/TypeORMCampaignRepository.ts` | Implementação ICampaignRepository com paginação |
| `src/adapters/http/controllers/CampaignController.ts` | Controller com CRUD completo (POST, GET, PATCH, DELETE) |
| `src/adapters/http/routes/campaign.routes.ts` | Rotas `/api/v1/campaigns` |
| `src/adapters/http/validations/campaign.validation.ts` | Schemas Zod para create/update |
| `src/infrastructure/database/mappers/CampaignSchema.ts` | Atualizado com createdAt/updatedAt |

### 16.2 Customers CRUD
| Arquivo | Descrição |
|---------|-----------|
| `src/core/dto/CustomerDTO.ts` | CreateCustomerDTO, UpdateCustomerDTO, CustomerQueryDTO |
| `src/core/use-cases/customers/CustomerUseCases.ts` | CreateCustomerUseCase, ListCustomersUseCase, GetCustomerByIdUseCase, UpdateCustomerUseCase, DeleteCustomerUseCase |
| `src/infrastructure/database/repositories/TypeORMCustomerRepository.ts` | Implementação ICustomerRepository com paginação |
| `src/adapters/http/controllers/CustomerController.ts` | Controller com CRUD completo |
| `src/adapters/http/routes/customer.routes.ts` | Rotas `/api/v1/customers` |
| `src/adapters/http/validations/customer.validation.ts` | Schemas Zod para create/update |
| `src/infrastructure/database/mappers/CustomerSchema.ts` | Atualizado com createdAt/updatedAt |

### 16.3 Product History API
| Arquivo | Descrição |
|---------|-----------|
| `src/core/domain/VariantHistory.ts` | Entidade de domínio VariantHistory |
| `src/infrastructure/database/repositories/TypeORMVariantHistoryRepository.ts` | Repositório para consulta de histórico |
| `src/adapters/http/controllers/ProductHistoryController.ts` | Controller para expor VariantHistory |
| `src/adapters/http/routes/product-history.routes.ts` | Rotas `/api/v1/product-history` |
| `src/infrastructure/database/mappers/VariantHistorySchema.ts` | Valores monetários em bigint (centavos) |

### 16.4 Settings API
| Arquivo | Descrição |
|---------|-----------|
| `src/core/dto/SettingsDTO.ts` | CreateSettingsDTO, UpdateSettingsDTO |
| `src/core/use-cases/settings/SettingsUseCases.ts` | GetSettingsUseCase, ListSettingsUseCase, CreateSettingsUseCase, UpdateSettingsUseCase, DeleteSettingsUseCase |
| `src/infrastructure/database/repositories/TypeORMSettingsRepository.ts` | Implementação ISettingsRepository |
| `src/adapters/http/controllers/SettingsController.ts` | Controller chave-valor |
| `src/adapters/http/routes/settings.routes.ts` | Rotas `/api/v1/settings` |
| `src/adapters/http/validations/settings.validation.ts` | Schemas Zod |

### 16.5 Lead Audit
| Arquivo | Descrição |
|---------|-----------|
| `src/core/use-cases/LeadUseCases.ts` | UpdateLeadStatusUseCase atualizado para registrar no AuditLog quando status = CONFIRMED |

### 16.6 Pagination
- Campaign e Customer implementam paginação igual ao Products (query params: page, limit, sortBy, sortOrder, search)
- Retorno padrão: `{ data, total, page, limit, totalPages }`

### 16.7 Container.ts
- Novos tokens: `campaignRepositoryToken`, `customerRepositoryToken`, `settingsRepositoryToken`
- Registro de todos os novos Use Cases
- UpdateLeadStatusUseCase recebe `IAuditRepository` para auditoria

---

## 17. Integração Frontend-Backend (Shop Varejo)

### 17.1 Visão Geral
- **Frontend:** Next.js (porta 3000)
- **Backend:** Node.js/Express (porta 3001)
- **Objetivo:** Exibir produtos dinâmicos da API no frontend

### 17.2 Configuração
| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` |

### 17.3 API Routes (Next.js)
| Endpoint | Descrição |
|----------|-----------|
| `GET /api/products` | Proxy para backend `/api/v1/products` |
| `GET /api/products/:sku` | Buscar produto por SKU |

### 17.4 Componentes Atualizados
| Componente | Alteração |
|------------|-----------|
| `FeaturedSection.tsx` | Client Component com `useEffect` + fetch para API |
| `ProductGrid.tsx` | Client Component com `useEffect` + fetch para API |
| `ProductCard.tsx` | Suporta props `product` (API) ou `sku` (legacy) |
| `page.tsx` | Simplificado para usar ProductGrid com API |
| `ImageWithFallback.tsx` | Componente com fallback para imagens 404 |

### 17.5 Módulo Frontend-Sales (Agent Frontend-Bridge)
**Arquivos Criados/Atualizados:**
| Arquivo | Descrição |
|---------|-----------|
| `src/app/api/orders/route.ts` | Proxy para backend `/api/v1/orders` (porta 3001) |
| `src/app/checkout/page.tsx` | Formulário de checkout com `paymentMethod` |
| `src/app/orders/page.tsx` | Listagem de pedidos autenticada via cookie `__session` |
| `src/contexts/CartContext.tsx` | Contexto de carrinho (localStorage) |
| `src/components/providers/ClientProviders.tsx` | Integração do `CartProvider` |

**Funcionalidades:**
- ✅ **Desconto Progressivo:** 5% (10+ itens), 10% (20+), 15% (50+), 20% (100+)
- ✅ **Máquina de Estados:** `PENDING → PAID → SHIPPED → DELIVERED`
- ✅ **Autenticação:** Validação via cookie `__session` (JWT)
- ✅ **Checkout:** Captura `paymentMethod` e itens do carrinho
- ✅ **Orders:** Listagem com status visual e histórico do cliente

### 17.5 Dados dos Produtos (MySQL)
| id | Nome | imageName | Status |
|----|------|-----------|--------|
| 1 | Tênis Runner Pro X | produto-4.webp | ✅ |
| 2 | Mochila Urban Carry 30L | produto-5.webp | ✅ |
| 3 | Tenis Ultra Speed | produto-20.webp | ✅ (com descrição) |
| 4 | Tenis Ultra Speed Pro | produto-6.webp | ✅ |

### 17.6 Imagens Disponíveis
```
/public/img/catalogo/
├── produto-3.webp a produto-20.webp
├── tenis-runner-pro.webp
└── tenis-lowstep.webp
```

---

## 18. Problemas Conhecidos (QA)

### 18.1 Testes com Falhas
| Teste | Problema | Status |
|-------|----------|--------|
| `orders.test.ts` | `TypeError: Container.discountService is not a function` | ✅ CORRIGIDO |
| `order.test.ts` | Progressive discounts calculando errado (x10) | ✅ CORRIGIDO |

### 18.2 Correções de Segurança (Agent Security)
**1. UserSchema.ts - Campo `name` faltante**
- **Problema:** Entidade `User` tinha campo `name?: string`, mas `UserSchema.ts` não mapeava essa coluna
- **Causa:** `synchronize: false` no TypeORM, coluna nunca foi criada no MySQL
- **Solução:** 
  - Adicionado `name: { type: "varchar", length: 255, nullable: true }` no UserSchema.ts
  - Executada migration manual: `ALTER TABLE user ADD COLUMN name VARCHAR(255) NULL AFTER password`
- **Status:** ✅ Corrigido e testado

**2. Seed de Admin (QA)**
- **Arquivo:** `src/seed-admin.ts`
- **Credenciais:** `admin@sisterslab.com` / `password123`
- **Role:** `admin`
- **Status:** ✅ Usuário criado e validado com login 201

**3. AuthService.ts**
- **Status:** ✅ Já implementava corretamente `generateTokens()` com `user.name`
- **Registro:** `src/core/use-cases/AuthUseCases.ts` salva `user.name` no banco

### 18.3 Servidor
- ✅ Porta 3001 inicia corretamente
- ✅ Todas as rotas disponíveis

---

## 19. Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.4.2 | 2026-04-29 | **Correção Image Handling:** Removido `imageUrl` do DTO e Use Cases. Imagens agora servidas pelo Next.js (`localhost:3000`) usando apenas `imageName`. Removida dependência de `APP_URL`. Builds passaram em frontend e backend. |
| 1.4.1 | 2026-04-29 | **Correção Mapeamento:** REMOVIDO `imageUrl` do ProductSchema.ts (coluna inexistente). **ImageUrl Dinâmica:** Use Cases agora geram URL completa usando `APP_URL` + `imageName`. **Product.ts:** `imageUrl` agora é campo comum (não getter). **Build:** `npm run build` passou. |
| 1.3.0 | 2026-04-27 | **Agent Security:** Correção UserSchema (campo `name`), Seed Admin, QA validado. **Agent Frontend-Bridge:** Módulo frontend-sales completo (checkout, orders, cart) |
| 1.2.1 | 2026-04-27 | QA: Problemas de testes registrados |
| 1.2.0 | 2026-04-27 | Integração Frontend-Backend (Shop Varejo) |
| 1.1.0 | 2026-04-27 | Módulos Sales, Procurement, Catalog CRUD, QA Tests |
| 1.0.9 | 2026-04-27 | Performance tests, VariantAuditSubscriber, Mappers |
| 1.0.8 | 2026-04-27 | IAuthService, DIP completo, Entidades Ricas |
| 1.0.7 | 2026-04-26 | SkuService OCP, Lead/PV métodos |
| 1.0.6 | 2026-04-26 | Refatorações SOLID |

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-29 | v1.4.2 - CORREÇÃO: ImageUrl removido do DTO/Use Cases. Imagens servidas pelo Next.js (localhost:3000) via imageName*
