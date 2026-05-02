# Lógica de Salvamento - LeadUseCases

## Visão Geral

O arquivo `backend/src/core/use-cases/LeadUseCases.ts` contém os casos de uso para manipulação de leads. Abaixo está a análise detalhada da lógica de salvamento.

---

## 1. CreateLeadUseCase (Criação de Lead)

### Fluxo Principal de Salvamento

1. **Validação dos Dados**
   - O método `execute(data: CreateLeadDTO)` inicia validando os campos obrigatórios através do `LeadValidator`:
     - `customerName` (nome do cliente) deve ser uma string não vazia
     - `customerPhone` (telefone) deve ser uma string não vazia
   - Se qualquer validação falhar, lança `BadRequestError` com mensagem "Nome do cliente e telefone são obrigatórios"

2. **Resolução do ProductId**
   - Se `productId` não foi fornecido mas um `sku` foi informado:
     - Busca o produto no repositório (`productRepository.findBySku(data.sku)`)
     - Se encontrado, usa o `id` do produto como `resolvedProductId`
   - Se após essa resolução não houver `resolvedProductId`, lança `BadRequestError` informando que é obrigatório um produto válido

3. **Validação do Usuário (Opcional)**
   - Se `userId` foi fornecido e o `userRepository` está disponível:
     - Verifica se o usuário existe (`userRepository.findById(finalUserId)`)
     - Se não existir, lança `NotFoundError`

4. **Criação da Entidade Lead**
   - Usa o `LeadFactory` para criar uma instância de `Lead` com os dados:
     - `sku`: trimado ou string vazia
     - `customerName`: trimado
     - `customerPhone`: trimado
     - `customerEmail`: trimado ou undefined
     - `notes`: trimado ou undefined
     - `productId`: ID resolvido
     - `variantId`: se fornecido
     - `status`: definido como `LeadStatus.PENDING`

5. **Persistência no Banco**
   - Chama `leadRepository.save(lead)` para persistir o lead
   - O retorno é o lead salvo com o ID gerado (`savedLead`)

6. **Adição à Wishlist (Opcional)**
   - Se `addProductToWishlistUseCase` está disponível:
     - Tenta adicionar o produto à wishlist do usuário
     - Passa `finalUserId`, `resolvedProductId` e `savedLead.id`
     - Em caso de erro, loga o erro e relança a exceção
   - Se não está disponível, apenas loga que não foi adicionado

7. **Retorno**
   - Retorna o `savedLead` persistido

---

## 2. UpdateLeadStatusUseCase (Atualização de Lead)

### Fluxo de Atualização

1. **Busca do Lead Existente**
   - Busca o lead pelo ID (`leadRepository.findById(id)`)
   - Se não encontrado, lança `NotFoundError`

2. **Armazenamento do Status Anterior**
   - Guarda o `oldStatus` antes da modificação para auditoria

3. **Atualização dos Campos**
   - Se `data.status` foi fornecido, atualiza o status do lead
   - Se `data.notes` foi fornecido (mesmo vazio), atualiza as notas

4. **Persistência da Atualização**
   - Chama `leadRepository.update(lead)` para salvar as alterações
   - Retorna o lead atualizado

5. **Auditoria (Quando Confirmado)**
   - Se o novo status é `CONFIRMED` e o anterior não era:
     - Salva um log de auditoria via `auditRepository.saveLog()`
     - Registra a ação `UPDATE`, entidade `Lead`, e os valores antigo/novo

---

## 3. DeleteLeadUseCase (Exclusão de Lead)

1. **Busca do Lead**
   - Busca o lead pelo ID
   - Se não encontrado, lança `NotFoundError`

2. **Exclusão**
   - Chama `leadRepository.delete(id)` para remover o lead

---

## Componentes Auxiliares

### LeadValidator
- Valida se os campos obrigatórios são strings não vazias
- Usa o método `isNonEmptyString()` para verificar o tipo e conteúdo

### LeadFactory
- Cria instâncias de `Lead` a partir do DTO
- Trata campos opcionais com `trimOrUndefined()`
- Define o status inicial como `PENDING`

---

## Fluxo de Dados

```
Entrada (CreateLeadDTO)
    ↓
Validação (LeadValidator)
    ↓
Resolução de ProductId (SKU → ID)
    ↓
Validação de UserId (se fornecido)
    ↓
Criação da Entidade (LeadFactory)
    ↓
Persistência (leadRepository.save)
    ↓
Adição à Wishlist (opcional)
    ↓
Retorno do Lead Salvo
```

---

## Repositórios Envolvidos

- `ILeadRepository`: Operações de CRUD para Lead
- `IProductRepository`: Busca de produto por SKU
- `IUserRepository`: Validação de existência do usuário
- `IAuditRepository`: Registro de logs de auditoria (para confirmação de lead)
