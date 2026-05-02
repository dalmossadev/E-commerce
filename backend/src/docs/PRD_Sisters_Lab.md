# PRD - Sisters Lab Backend

## Product Requirements Document

---

## 1. Visão do Produto

Sistema backend para gerenciamento de catálogo de produtos, variações (SKUs), gestão de leads e controle de transações comerciais (Vendas e Compras), operando em modelo híbrido:
- **Sob Demanda (ON_DEMAND)**: Produtos sem controle de estoque físico
- **Estoque Físico (IN_STOCK)**: Produtos com controle de estoque obrigatório

---

## 2. Problema

Falta de controle estruturado de produtos e vendas em modelo híbrido, com necessidade de:
- Gestão de SKUs únicos por variação
- Controle de Leads para conversão manual
- Suporte a estoque futuro (sob demanda)
- Auditoria de alterações críticas

---

## 3. Solução

Sistema ERP híbrido com:
- SKU automático por variação de produto
- Leads para controle de interessados
- Módulo de Vendas (Orders)
- Módulo de Compras (Procurement)
- Auditoria via Shadow Tables

---

## 4. Entidades do Sistema (POO)

### 4.1 Product & Variants

#### Product
Entidade base para gestão de marca, categoria e atributos.

```typescript
class Product {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  basePrice: number;
  originalPrice?: number;
  badge?: ProductBadge;
  featured: boolean;
  inStock: boolean;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### ProductVariant
Controle de SKU único, cor, tamanho e preço.

```typescript
enum FulfillmentType {
  ON_DEMAND = 'ON_DEMAND',  // Sem estoque
  IN_STOCK = 'IN_STOCK'      // Estoque obrigatório >= 0
}

class ProductVariant {
  id?: number;
  sku: string;
  productId: number;
  color: string;
  size: string;
  price: number;
  stock: number;
  fulfillmentType: FulfillmentType;
  inStock: boolean;
}
```

### 4.2 Leads (Captação)

#### Lead
Registro de interesse via canais externos (WhatsApp).

```typescript
enum LeadStatus {
  PENDING = 'PENDING',    // Aguardando confirmação
  CONFIRMED = 'CONFIRMED', // Confirmado
  REJECTED = 'REJECTED'    // Rejeitado
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
}
```

### 4.3 Sales & Orders (Vendas)

#### Order
Entidade central de venda.

```typescript
enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  BOLETO = 'BOLETO'
}

class Order {
  id: number;
  customerId: number;
  totalValue: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;

  // Métodos POO
  calculateTotal(): number;
  applyDiscount(discount: number): void;
  canTransitionTo(newStatus: OrderStatus): boolean;
}
```

#### OrderItem
Vínculo de SKU ao pedido.

```typescript
class OrderItem {
  id: number;
  orderId: number;
  sku: string;
  variantId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

### 4.4 Procurement (Compras)

#### Purchase
Pedido de compra junto ao fornecedor.

```typescript
enum PurchaseStatus {
  PENDING = 'PENDING',
  ORDERED = 'ORDERED',
  SHIPPED = 'SHIPPED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

class Purchase {
  id: number;
  supplierId: number;
  totalValue: number;
  status: PurchaseStatus;
  items: PurchaseItem[];
  createdAt: Date;
  updatedAt: Date;

  // Método POO
  receiveInventory(): void; // Incremente estoque das variantes
}
```

#### PurchaseItem
Itens do pedido de compra.

```typescript
class PurchaseItem {
  id: number;
  purchaseId: number;
  variantId: number;
  quantity: number;
  unitCost: number;
}
```

---

## 5. Regras de Negócio

### 5.1 Gestão de SKU
| Regra | Descrição |
|-------|-----------|
| Imutabilidade | SKU gerado uma única vez, nunca alterado |
| Formato | `{brand}-{name}-{category}-{color}-{size}` |
| Unicidade | Cada SKU deve ser único no sistema |

### 5.2 Fluxo Híbrido de Estoque
| Cenário | Comportamento |
|---------|---------------|
| Venda IN_STOCK | Bloqueia ou alerta se `quantity > stock` |
| Venda ON_DEMAND | Permite venda sem estoque |
| Reserva | Criação de pedido reserva estoque físico |

### 5.3 Transições de Status
| Entidade | Transição Permitida |
|----------|---------------------|
| Order | PENDING → PAID → SHIPPED → DELIVERED |
| Purchase | PENDING → ORDERED → SHIPPED → RECEIVED |
| Lead | PENDING → CONFIRMED / REJECTED |

### 5.4 Auditoria
- Toda alteração de preço dispara snapshot em `VariantHistory`
- Toda alteração de estoque dispara snapshot em `VariantHistory`
- Toda transição de status de pedido é registrada

---

## 6. Use Cases

### 6.1 Catalog (Produtos)
| Use Case | Descrição |
|----------|-----------|
| CreateProduct | Cria produto com variantes |
| ListProducts | Lista com filtros e paginação |
| GetProductBySku | Busca produto por SKU |
| UpdateProduct | Atualiza produto |
| DeleteProduct | Remove produto |

### 6.2 Leads
| Use Case | Descrição |
|----------|-----------|
| CreateLead | Cria lead (status PENDING) |
| ListLeads | Lista leads |
| GetLeadById | Busca lead por ID |
| UpdateLeadStatus | Atualiza status (CONFIRMED/REJECTED) |
| DeleteLead | Remove lead |

### 6.3 Sales (Vendas)
| Use Case | Descrição |
|----------|-----------|
| CreateOrder | Cria pedido |
| UpdateOrderStatus | Atualiza status do pedido |
| CancelOrder | Cancela pedido |
| ListOrders | Lista pedidos |

### 6.4 Procurement (Compras)
| Use Case | Descrição |
|----------|-----------|
| CreatePurchaseOrder | Cria pedido de compra |
| ReceiveInventory | Recebe mercadoria e atualiza estoque |
| ListPurchases | Lista pedidos de compra |

---

## 7. API Endpoints

### 7.1 Products
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/products` | Listar com filtros |
| POST | `/api/v1/products` | Criar produto |
| GET | `/api/v1/products/:sku` | Buscar por SKU |
| PUT | `/api/v1/products/:sku` | Atualizar |
| DELETE | `/api/v1/products/:sku` | Remover |

### 7.2 Leads
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/leads` | Listar |
| POST | `/api/v1/leads` | Criar |
| GET | `/api/v1/leads/:id` | Buscar |
| PATCH | `/api/v1/leads/:id` | Atualizar status |
| DELETE | `/api/v1/leads/:id` | Remover |

### 7.3 Orders (Vendas)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/orders` | Listar |
| POST | `/api/v1/orders` | Criar |
| GET | `/api/v1/orders/:id` | Buscar |
| PATCH | `/api/v1/orders/:id/status` | Atualizar status |
| POST | `/api/v1/orders/:id/cancel` | Cancelar |

### 7.4 Purchases (Compras)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/purchases` | Listar |
| POST | `/api/v1/purchases` | Criar |
| POST | `/api/v1/purchases/:id/receive` | Receber mercadoria |

---

## 8. Arquitetura Técnica

### 8.1 Padrões
| Padrão | Aplicação |
|--------|-----------|
| Clean Architecture | Domain, Use Cases, Interfaces, Infrastructure, Adapters |
| SOLID | Interfaces para DIP, Entidades Ricas para SRP |
| MVC | Controllers → Use Cases → Repositories |
| POO | Entidades com métodos de negócio |

### 8.2 Stack
| Tecnologia | Versão |
|------------|--------|
| Node.js | - |
| TypeScript | 5.4.5 |
| Express | 5.2.1 |
| TypeORM | 0.3.28 |
| JWT | - |
| Jest | 29.7.0 |
| Zod | 4.3.6 |

### 8.3 Performance
| Métrica | Meta |
|---------|------|
| Geração de 1000 SKUs | < 100ms |
| Operações de Cache | < 5ms |

---

## 9. Critérios de Aceitação

### 9.1 Obrigatórios
- [x] SKU único e imutável
- [x] Suporte híbrido (ON_DEMAND + IN_STOCK)
- [x] Registro de leads funcional
- [x] CRUD de produtos completo

### 9.2 Pendentes
- [ ] Módulo de Vendas (Orders) - NÃO IMPLEMENTADO
- [ ] Módulo de Compras (Procurement) - NÃO IMPLEMENTADO
- [ ] Reserva de estoque - NÃO IMPLEMENTADO

---

## 10. Estrutura de Pastas

```
src/
├── adapters/http/          # Camada de entrega (MVC)
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── validations/
├── core/                   # Regras de negócio
│   ├── domain/             # Entidades Ricas
│   ├── use-cases/
│   ├── interfaces/         # Contratos (DIP)
│   ├── dto/
│   ├── errors/
│   └── container/          # DI Container
├── infrastructure/         # Implementações
│   ├── database/
│   │   ├── mappers/        # TypeORM Schemas
│   │   ├── repositories/
│   │   └── subscribers/    # Audit
│   ├── auth/
│   ├── cache/
│   └── logger/
└── __tests__/              # Testes
```

---

## 11. Histórico de Versões

| Versão | Data | Descrição |
|--------|------|------------|
| 2.0.0 | 2026-04-27 | ERP Híbrido com Vendas e Compras |
| 1.0.0 | - | Modelo inicial (Produto + Lead) |

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
