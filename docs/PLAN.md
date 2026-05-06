# Plano de Implementação: Atualização da Entidade Supplier

Este plano descreve as etapas para adicionar novos campos à tabela `supplier` e sincronizar o código backend (Domínio e Infraestrutura) seguindo o **Fullstack Master Protocol (v1.6)**.

## 📋 Objetivos
1. Atualizar o banco de dados com os novos campos via SQL.
2. Atualizar a entidade de domínio `Supplier`.
3. Atualizar o mapeamento do TypeORM (`SupplierSchema`).
4. Garantir a integridade dos dados e o alinhamento entre as camadas.

## 🛠️ Alterações Sugeridas

### 1. Banco de Dados (SQL)
Execução do comando solicitado para adicionar as colunas:
```sql
ALTER TABLE supplier
ADD COLUMN tradeName VARCHAR(255),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN website VARCHAR(255),
ADD COLUMN status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### 2. Domínio (`backend/src/core/domain/Supplier.ts`)
Adicionar as propriedades à classe `Supplier` para refletir os novos campos.
- `tradeName: string`
- `phone: string`
- `website: string`
- `status: 'ACTIVE' | 'INACTIVE'`
- `createdAt: Date`
- `updatedAt: Date`

### 3. Infraestrutura (`backend/src/infrastructure/database/mappers/SupplierSchema.ts`)
Atualizar o `EntitySchema` para incluir as novas colunas e garantir que o TypeORM reconheça os campos.

## 🚀 Cronograma de Execução

### FASE 1: Preparação e Backup
- [x] Validar a conexão atual com o banco de dados.
- [x] Verificar se já existem dados na tabela `supplier` que possam ser afetados.

### FASE 2: Atualização do Código
- [x] Modificar `backend/src/core/domain/Supplier.ts`.
- [x] Modificar `backend/src/infrastructure/database/mappers/SupplierSchema.ts`.

### FASE 3: Aplicação no Banco de Dados
- [x] Executar o comando SQL via terminal ou script de migração.

### FASE 4: Verificação
- [x] Reiniciar o servidor backend (Verificação técnica via CLI realizada).
- [x] Verificar se o TypeORM inicializa corretamente com o novo esquema.
- [x] Verificar estrutura da tabela via `DESCRIBE supplier`.

## 🔴 Regras Críticas (Protocolo v1.6)
- [x] **Não realizar Commit** sem autorização explícita (Regra 8).
- [x] **Manter Clean Architecture**: Mudanças no domínio realizadas.
- [x] **Sincronia Fullstack**: Banco e Código sincronizados.

---
**Status do Plano:** ✅ CONCLUÍDO.
