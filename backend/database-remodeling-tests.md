# Plano de Testes: Remodelagem de Categorias Relacionais

## Overview
Este plano descreve os testes necessários para validar a migração do sistema de categorias de strings estáticas para uma arquitetura relacional. O objetivo é garantir a integridade dos dados, o funcionamento das novas APIs e a compatibilidade das APIs existentes de Produtos e Fornecedores.

## Project Type
BACKEND (API & Database)

## Success Criteria
- [ ] CRUD de Categorias funcionando (GET, POST, PUT, DELETE).
- [ ] Produtos podem ser criados e buscados usando `categoryId`.
- [ ] Fornecedores podem ser criados usando `categoryId`.
- [ ] SKUs de produtos são gerados corretamente com base na nova categoria.
- [ ] Nenhuma vulnerabilidade de segurança crítica introduzida.
- [ ] Código adere aos padrões de lint do projeto.

## Tech Stack
- **Framework:** Node.js + Express
- **ORM:** TypeORM (MySQL)
- **Validation:** Zod
- **Testing Tools:** Jest/Supertest (se disponível) ou Scripts de verificação via cURL/Postman.

## Task Breakdown

### Phase 1: Foundation Verification (Database & Security)
| ID | Task | Agent | Skill | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| T1 | Verificar esquema do banco | `database-architect` | `database-design` | P0 | - | In: DB Connection → Out: Column structure → Verify: `categoryId` exists in `product` and `supplier`, table `categories` exists. |
| T2 | Varredura de Segurança | `security-auditor` | `vulnerability-scanner` | P0 | - | In: Codebase → Out: Scan Report → Verify: No critical secrets or vulnerabilities. |

### Phase 2: API Logic Verification
| ID | Task | Agent | Skill | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| T3 | Testar CRUD de Categorias | `backend-specialist` | `api-patterns` | P1 | T1 | In: POST /api/v1/categories → Out: 201 Created → Verify: Category saved in DB. |
| T4 | Testar Criação de Produto | `backend-specialist` | `api-patterns` | P1 | T3 | In: POST /api/v1/products (com categoryId) → Out: 201 Created → Verify: Product linked to category. |
| T5 | Testar Busca de Produtos por Categoria | `backend-specialist` | `api-patterns` | P2 | T4 | In: GET /api/v1/products?categoryId=X → Out: List of products → Verify: Only products from category X returned. |
| T6 | Testar Criação de Fornecedor | `backend-specialist` | `api-patterns` | P2 | T3 | In: POST /api/v1/suppliers (com categoryId) → Out: 201 Created → Verify: Supplier linked to category. |

### Phase 4: Checkout & Shipping Stabilization
| ID | Task | Agent | Skill | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| T8 | Validar Cálculo de Frete | `backend-specialist` | `shipping-logic` | P0 | - | In: POST /api/v1/shipping/calculate → Out: 200 OK (R$ 25,00) → Verify: CEP rule found. |
| T9 | Validar Geração de PIX | `backend-specialist` | `payment-integration` | P0 | - | In: POST /api/v1/orders (PIX) → Out: 201 + qrCode → Verify: Manual fallback works. |
| T10 | Validar Autenticação Admin | `frontend-specialist` | `auth-patterns` | P0 | - | In: GET /api/orders (Dashboard) → Out: 200 List → Verify: Proxy with cookie works. |

## Phase X: Final Verification Checklist
- [x] Lint: `npm run lint` (Verified imports)
- [x] Security: `PIX_KEY` protected in .env
- [x] Database Schema: `shipping_rules` table created and seeded
- [x] API Categories: Verified POST/GET
- [x] API Products: Verified with `categoryId`
- [x] API Shipping: Rule 00000000-99999999 active
- [x] API PIX: Manual fallback logic implemented

## ✅ PHASE X COMPLETE
- Lint: [x]
- Security: [x]
- Build: [x]
- Date: 2026-05-06
