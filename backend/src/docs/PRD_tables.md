# PRD - Tabelas do Banco de Dados
**Data:** 29/04/2026  
**Sistema:** Sisters Lab E-commerce (Backend TypeORM + MySQL)

---

## 1. Tabelas Principais (Domínio)

### 1.1 Product
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `name` | `varchar(255)` | Nome do produto |
| `brand` | `varchar(100)`, nullable | Marca (pode ser nulo - resilient ao legado) |
| `description` | `text` | Descrição detalhada |
| `basePrice` | `int`, nullable | Preço base em centavos (pode ser nulo) |
| `originalPrice` | `int`, nullable | Preço original para desconto |
| `imageName` | `varchar(255)` | Nome do arquivo (ex: "produto-6.webp") |
| `altText` | `varchar(255)` | Texto alternativo (acessibilidade) |
| `category` | `varchar(50)` | Categoria: destaque, eletronicos, moda, casa, esporte, beleza |
| `badge` | `varchar(50)`, nullable | Badge: novo, oferta, exclusivo, esgotando, lancamento |
| `featured` | `boolean`, default false | Aparece em destaques |
| `inStock` | `boolean`, default true | Disponível em estoque |
| `specs` | `json`, nullable | Especificações técnicas |
| `updatedBy` | `int`, nullable | FK para User (quem atualizou) |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/ProductSchema.ts`  
**Status:** ✅ Ativo (campo `imageUrl` removido - não existia no banco)

---

### 1.2 ProductVariant (SKUs)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `sku` | `varchar` | SKU único (ex: "PROD001-BLACK-P"") |
| `productId` | `int`, FK | Relacionamento com Product |
| `color` | `varchar` | Cor do variante |
| `size` | `varchar` | Tamanho do variante |
| `price` | `int` | Preço específico do variante |
| `stock` | `int` | Estoque disponível |
| `fulfillmentType` | `enum` | ON_DEMAND ou IN_STOCK |
| `inStock` | `boolean` | Disponível |

**Mapper:** `backend/src/infrastructure/database/mappers/ProductVariantSchema.ts`  
**Status:** ✅ Ativo (eager loading com Product)

---

### 1.3 User
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `email` | `varchar` | Email (único) |
| `password` | `varchar` | Senha hasheada |
| `name` | `varchar(255)`, nullable | Nome do usuário (ADICIONADO via migration) |
| `role` | `enum` | admin, supplier, customer |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/UserSchema.ts`  
**Status:** ✅ Ativo (campo `name` adicionado via ALTER TABLE)

---

### 1.4 Lead
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `sku` | `varchar` | SKU de interesse |
| `customerName` | `varchar` | Nome do lead |
| `customerPhone` | `varchar` | Telefone/WhatsApp |
| `customerEmail` | `varchar`, nullable | Email (opcional) |
| `status` | `enum` | PENDING, CONFIRMED, REJECTED |
| `notes` | `text`, nullable | Observações |
| `productId` | `int`, FK | Relacionamento com Product |
| `variantId` | `int`, FK | Relacionamento com ProductVariant |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/LeadSchema.ts`  
**Status:** ✅ Ativo

---

### 1.5 Order
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `customerId` | `int`, FK | Cliente |
| `status` | `enum` | PENDING, PAID, SHIPPED, DELIVERED, CANCELLED |
| `totalAmount` | `int` | Valor total em centavos |
| `paymentMethod` | `varchar` | credit_card, debit_card, pix, boleto |
| `whatsappMessageId` | `varchar`, nullable | ID da mensagem WhatsApp |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/OrderSchema.ts`  
**Status:** ✅ Ativo

---

### 1.6 OrderItem
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `orderId` | `int`, FK | Pedido |
| `productId` | `int`, FK | Produto |
| `variantId` | `int`, FK | Variante |
| `quantity` | `int` | Quantidade |
| `unitPrice` | `int` | Preço unitário em centavos |

**Mapper:** `backend/src/infrastructure/database/mappers/OrderItemSchema.ts`  
**Status:** ✅ Ativo

---

### 1.7 Supplier
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `companyName` | `varchar` | Nome da empresa |
| `cnpj` | `varchar` | CNPJ |
| `contactEmail` | `varchar`, nullable | Email de contato |
| `category` | `varchar` | Categoria |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/SupplierSchema.ts`  
**Status:** ✅ Ativo

---

### 1.8 Campaign
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `name` | `varchar` | Nome da campanha |
| `description` | `text`, nullable | Descrição |
| `discountType` | `enum` | percentage, fixed_amount |
| `discountValue` | `int` | Valor do desconto |
| `startDate` | `timestamp` | Data inicial |
| `endDate` | `timestamp` | Data final |
| `active` | `boolean` | Ativa? |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/CampaignSchema.ts`  
**Status:** ✅ Ativo

---

### 1.9 Customer
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `name` | `varchar` | Nome |
| `email` | `varchar` | Email |
| `phone` | `varchar` | Telefone |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/CustomerSchema.ts`  
**Status:** ✅ Ativo

---

### 1.10 Purchase
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `supplierId` | `int`, FK | Fornecedor |
| `totalAmount` | `int` | Valor total em centavos |
| `status` | `enum` | PENDING, ORDERED, SHIPPED, RECEIVED, CANCELLED |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/PurchaseSchema.ts`  
**Status:** ✅ Ativo

---

### 1.11 PurchaseItem
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `purchaseId` | `int`, FK | Pedido de compra |
| `productId` | `int`, FK | Produto |
| `quantity` | `int` | Quantidade |
| `unitCost` | `int` | Custo unitário em centavos |

**Mapper:** `backend/src/infrastructure/database/mappers/PurchaseItemSchema.ts`  
**Status:** ✅ Ativo

---

### 1.12 Settings
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `key` | `varchar` | Chave (única) |
| `value` | `text` | Valor |
| `createdAt` | `timestamp` | Data de criação |
| `updatedAt` | `timestamp` | Data de atualização |

**Mapper:** `backend/src/infrastructure/database/mappers/SettingsSchema.ts`  
**Status:** ✅ Ativo

---

## 2. Tabelas de Auditoria (Shadow Tables)

### 2.1 VariantHistory
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `variantId` | `int`, FK | Variante alterada |
| `field` | `varchar` | Campo alterado (stock, price) |
| `oldValue` | `text` | Valor anterior |
| `newValue` | `text` | Novo valor |
| `changedBy` | `int`, FK | Usuário que alterou |
| `changedAt` | `timestamp` | Data da alteração |

**Mapper:** `backend/src/infrastructure/database/mappers/VariantHistorySchema.ts`  
**Status:** ✅ Ativo (preenchido via VariantAuditSubscriber)

---

### 2.2 AuditLog
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `action` | `varchar` | Ação realizada (ex: "lead_confirmed") |
| `entity` | `varchar` | Entidade afetada |
| `entityId` | `int` | ID da entidade |
| `details` | `text`, nullable | Detalhes JSON |
| `userId` | `int`, FK | Usuário |
| `createdAt` | `timestamp` | Data do log |

**Mapper:** `backend/src/infrastructure/database/mappers/AuditLogSchema.ts`  
**Status:** ✅ Ativo

---

### 2.3 AuditBase
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `tableName` | `varchar` | Nome da tabela |
| `operation` | `enum` | INSERT, UPDATE, DELETE |
| `recordId` | `int` | ID do registro |
| `timestamp` | `timestamp` | Data da operação |

**Mapper:** `backend/src/infrastructure/database/mappers/AuditBaseSchema.ts`  
**Status:** ✅ Ativo

---

### 2.4 AuditEntry
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `auditBaseId` | `int`, FK | AuditBase |
| `fieldName` | `varchar` | Campo alterado |
| `oldValue` | `text` | Valor anterior |
| `newValue` | `text` | Novo valor |

**Mapper:** `backend/src/infrastructure/database/mappers/AuditEntrySchema.ts`  
**Status:** ✅ Ativo

---

## 3. Tabelas de Perfil/Extensão

### 3.1 UserProfile
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `int`, PK, AI | Identificador único |
| `userId` | `int`, FK (único) | Usuário |
| `bio` | `text`, nullable | Biografia |
| `avatarUrl` | `varchar`, nullable | URL do avatar |
| `phone` | `varchar`, nullable | Telefone |
| `address` | `text`, nullable | Endereço |

**Mapper:** `backend/src/infrastructure/database/mappers/UserProfileSchema.ts`  
**Status:** ✅ Ativo

---

## 4. Resumo de Tabelas

| # | Tabela | Categoria | Status |
|---|--------|-----------|--------|
| 1 | `product` | Domínio | ✅ |
| 2 | `product_variant` | Domínio | ✅ |
| 3 | `user` | Domínio | ✅ |
| 4 | `lead` | Domínio | ✅ |
| 5 | `order` | Domínio | ✅ |
| 6 | `order_item` | Domínio | ✅ |
| 7 | `supplier` | Domínio | ✅ |
| 8 | `campaign` | Domínio | ✅ |
| 9 | `customer` | Domínio | ✅ |
| 10 | `purchase` | Compras | ✅ |
| 11 | `purchase_item` | Compras | ✅ |
| 12 | `settings` | Config | ✅ |
| 13 | `variant_history` | Auditoria | ✅ |
| 14 | `audit_log` | Auditoria | ✅ |
| 15 | `audit_base` | Auditoria | ✅ |
| 16 | `audit_entry` | Auditoria | ✅ |
| 17 | `user_profile` | Perfil | ✅ |

**Total: 17 tabelas**  
**Mapper central:** `backend/src/infrastructure/database/mappers/`  
**Banco físico:** MySQL 8+ (local, sem Docker)  
**ORM:** TypeORM 0.3.28 com EntitySchema (sem decorators no domínio)

---

**Autor:** Dalmo Pereira  
*Atualizado: 2026-04-29 | v1.0 - Documentação completa das tabelas*
