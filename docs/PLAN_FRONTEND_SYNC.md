# Plano de Sincronização: Fornecedores (Fullstack)

Este plano descreve as etapas para refletir os novos campos de fornecedores no Frontend e garantir que o fluxo de dados (API/Rotas) suporte as novas informações.

## 📋 Objetivos
1. Atualizar o fluxo de dados no Backend (DTOs, Validações e Use Cases).
2. Criar/Atualizar a interface de gestão de fornecedores no Frontend (`shop-varejo`).
3. Adicionar o acesso à gestão de fornecedores na Sidebar administrativa.

## 🛠️ Alterações Sugeridas

### 1. Backend (Data Flow Refinement)
- **DTOs (`backend/src/core/dto/SupplierDTO.ts`)**: Adicionar `tradeName`, `phone`, `website`, `status` aos DTOs de criação e atualização.
- **Validações (`backend/src/adapters/http/validations/supplier.validation.ts`)**: Incluir os novos campos no schema Zod.
- **Use Cases (`backend/src/core/use-cases/SupplierUseCases.ts`)**:
  - `CreateSupplierUseCase`: Mapear novos campos para a entidade.
  - `UpdateSupplierUseCase`: Permitir a atualização dos novos campos.

### 2. Frontend (UI/UX - Admin)
- **Sidebar (`shop-varejo/src/components/admin/Sidebar.tsx`)**: Adicionar o item "Fornecedores".
- **Gestão de Fornecedores (`shop-varejo/src/app/admin/suppliers/page.tsx`)**:
  - Criar tela de listagem (Tabela Industrial).
  - Criar modal/formulário para criação e edição com os novos campos.
- **Serviços API**: Criar ou atualizar o serviço que consome a API de `/suppliers`.

## 🚀 Cronograma de Execução

### FASE 1: Backend & Contrato (Leonardo Backend)
- [x] Atualizar `SupplierDTO.ts`.
- [x] Atualizar `supplier.validation.ts`.
- [x] Atualizar `SupplierUseCases.ts`.
- [x] Corrigir erro `ER_INVALID_DEFAULT` no `SupplierSchema.ts` (Ajustado `precision: 0`).
- [x] Testar rotas via ferramenta de API (Verificação técnica via Proxy realizada).

### FASE 2: Frontend Foundation (UX Architect)
- [x] Mapear as necessidades de input (máscaras de telefone/CNPJ).
- [x] Definir layout da tabela de fornecedores (Regra: Bordas Quadradas).

### FASE 3: Frontend Implementation (UI Developer)
- [x] Adicionar link na Sidebar.
- [x] Implementar `SuppliersPage` e componentes de formulário.
- [x] Integrar com o Backend via Hooks e Proxy API.

## 🔴 Regras Críticas (Protocolo v1.6)
- [x] **Regra 8**: Nenhum commit sem autorização do Dalmo.
- [x] **Design Industrial**: Bordas 100% quadradas, paleta Preto/Branco/Verde Neon.
- [x] **Feedback Visual**: Implementado estado de loading e feedback de erro.

---
**Status do Plano:** ✅ CONCLUÍDO.
