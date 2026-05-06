# Plano de Implementação: Centralização de Endereços (Ecosistema Sisters Lab) - CONCLUÍDO

Este plano descreve a reestruturação da gestão de endereços no sistema para eliminar redundância e permitir que Clientes, Fornecedores e Pedidos utilizem uma base de dados normalizada.

## 🚀 Cronograma de Execução

### FASE 1: Fundação do Banco de Dados (Data Architect)
- [x] Criar `backend/src/core/domain/Address.ts`.
- [x] Criar `backend/src/infrastructure/database/mappers/AddressSchema.ts`.
- [x] Registrar `AddressSchema` no `AppDataSource`.
- [x] Executar sincronização do Banco de Dados (Tabela `addresses` criada e `customer` refatorado).

### FASE 2: Refatoração do Backend (Leonardo Backend)
- [x] Atualizar `Customer.ts` e `CustomerSchema.ts`.
- [x] Atualizar `Supplier.ts` e `SupplierSchema.ts`.
- [x] Criar `IAddressRepository` e `TypeORMAddressRepository`.
- [x] Criar `AddressUseCases.ts` e `AddressController.ts`.

### FASE 3: API e Integração (Backend Specialist)
- [x] Criar rotas `/api/v1/addresses` no backend.
- [x] Registrar rotas no `server.ts`.
- [x] Atualizar Repositórios para carregar relações de endereços por padrão.

### FASE 4: Frontend (Frontend Specialist)
- [x] Criar Proxy API no Next.js (`/api/addresses`).
- [x] Criar hook `useAddresses.ts`.
- [x] Implementar gestão de múltiplos endereços na tela de Fornecedores.
- [x] Implementar busca automática por CEP (ViaCEP).

## 🔴 Regras Críticas (Protocolo v1.6)
- [x] **Não realizar Commit** sem autorização explícita.
- [x] **Coordenadas**: Latitude e Longitude suportadas no banco.
- [x] **Informações de Entrega**: Mantidas no `Order`.

---
**Status do Plano:** ✅ CONCLUÍDO.
