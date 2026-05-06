# Plano: Integração Frontend de Categorias Relacionais

## Overview
Este plano descreve as alterações necessárias no frontend (`shop-varejo`) para suportar a nova arquitetura relacional de categorias implementada no backend. Isso inclui a mudança de strings estáticas para IDs numéricos e objetos de categoria dinâmicos.

## Project Type
WEB (Next.js + Tailwind)

## Success Criteria
- [ ] Interfaces TypeScript atualizadas para refletir o novo modelo de dados.
- [ ] Filtros de categorias na vitrine carregando dinamicamente do backend.
- [ ] Formulários de Admin (Produtos e Fornecedores) utilizando campos de seleção dinâmicos.
- [ ] SKUs gerados corretamente no frontend (se houver lógica local) ou refletindo a mudança.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **State/Data:** React Server Components + Client Hooks (Zustand/Context se houver)

## Task Breakdown

### Phase 1: Analysis & Data Models
| ID | Task | Agent | Skill | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| F1 | Mapear uso de categorias no FE | `explorer-agent` | `clean-code` | P0 | - | In: Codebase → Out: List of files using categories → Verify: All integration points identified. |
| F2 | Atualizar Interfaces TS | `frontend-specialist` | `clean-code` | P0 | F1 | In: `src/types/interfaces.ts` → Out: Updated interfaces → Verify: `Product` uses `categoryId` and `category` object. |

### Phase 2: API & Component Integration
| ID | Task | Agent | Skill | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| F3 | Implementar Fetch de Categorias | `backend-specialist` | `api-patterns` | P1 | F2 | In: `src/lib/api.ts` (ou similar) → Out: `getCategories()` function → Verify: Data fetched from `/api/v1/categories`. |
| F4 | Dinamizar Filtros de Vitrine | `frontend-specialist` | `frontend-design` | P1 | F3 | In: `page.tsx` / Filter components → Out: Dynamic list from API → Verify: Filtering products by new categoryId. |
| F5 | Atualizar Formulário de Produtos (Admin) | `frontend-specialist` | `frontend-design` | P2 | F3 | In: `src/app/admin/products/page.tsx` (ou form) → Out: Select com categorias da API → Verify: Creation works with `categoryId`. |
| F6 | Atualizar Formulário de Fornecedores (Admin) | `frontend-specialist` | `frontend-design` | P2 | F3 | In: `src/app/admin/suppliers/page.tsx` → Out: Select com categorias → Verify: Creation works. |

### Phase 3: Final Verification
| ID | Task | Agent | Skill | Priority | Dependencies | Input → Output → Verify |
|---|---|---|---|---|---|---|
| F7 | Verificação de UX e Design | `frontend-specialist` | `web-design-guidelines` | P3 | All | In: Browser → Out: Visual Check → Verify: No layout shifts, premium feel preserved. |
| F8 | Executar Lint e Build | `devops-engineer` | `lint-and-validate` | P3 | All | In: `npm run build` → Out: Success → Verify: No TS errors. |

## Phase X: Final Verification Checklist
- [ ] Lint: `npm run lint`
- [ ] No hardcoded categories in filters
- [ ] Admin forms using dynamic selects
- [ ] Product SKU reflects category choice (if applicable)

## ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: [Current Date]
