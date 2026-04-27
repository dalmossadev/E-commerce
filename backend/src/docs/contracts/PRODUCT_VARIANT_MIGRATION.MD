
**RELATORIO DE MUDANÇAS**
---

### 📄 `docs/contracts/PRODUCT_VARIANTS_MIGRATION.md`

# 🚀 Mapeamento de Transição: Sistema de Variantes (SKU Inteligente)

Este documento descreve as alterações necessárias para implementar a estrutura de **Produtos e Variantes**, permitindo o controle de estoque por cor e tamanho com geração de SKU determinístico.

---

## 1. Novo Contrato de Entrada (Request DTO)
O `ProductController` passará a aceitar um objeto "Pai" com uma matriz de atributos para geração das variantes.

```json
{
  "name": "Tênis Runner Pro",
  "brand": "SistersLab",
  "category": "Esporte",
  "basePrice": 19990,
  "attributes": {
    "colors": ["Preto", "Azul"],
    "sizes": ["38", "39", "40"]
  }
}
```

---

## 2. Mapa de Dependências e Impactos

### 🔹 Camada de Domínio (Core)
* **Entidade `Product`**: Adição dos campos `brand` e `basePrice`. Remoção do campo `sku` (que migra para a variante).
* **Nova Entidade `ProductVariant`**: Conterá `sku`, `color`, `size`, `price` e `stock`.
* **`SkuService`**: Implementação da lógica de normalização e concatenação (BRD-NAME-CAT-COL-SIZ).

### 🔹 Camada de Aplicação (Use Cases)
* **`CreateProductUseCase`**:
    1. Recebe o `ProductDTO`.
    2. Instancia o `Product` (Pai).
    3. Utiliza o `ProductVariantService` para gerar a lista de SKUs únicos.
    4. Persiste o Produto e suas Variantes em uma transação única.

### 🔹 Camada de Infraestrutura (Database)
* **Tabela `products`**: Armazena informações globais.
* **Tabela `product_variants`**: Relacionamento 1:N com `products`.
    * *Foreign Key*: `product_id`.
    * *Index*: `sku` (Unique).

---

## 3. Fluxo de Execução (Pipeline)

1.  **Controller**: Valida se `attributes.colors` e `attributes.sizes` estão presentes.
2.  **SkuService**: Recebe os dados brutos e devolve strings normalizadas (ex: `SIS-RUNNER-ESP-PRE-38`).
3.  **VariantService**: Faz o produto cartesiano (Cores x Tamanhos) para criar a lista de objetos.
4.  **Repository**: Executa o `INSERT` do produto pai e, em seguida, um `batch insert` das variantes.

---

## 4. Mudanças no Banco de Dados (Checklist de SQL)



- [ ] Criar Migration para adicionar `brand` em `products`.
- [ ] Criar Migration para a tabela `product_variants`.
- [ ] Mover registros existentes de `products` para `product_variants` (para não perder dados atuais).
- [ ] Adicionar restrição de unicidade no campo `sku` da nova tabela.

---

### Próxima Ação Sugerida

Com esse mapa em mãos, a primeira alteração prática deve ser a **atualização do Model/Entity do TypeORM**. Se o banco não estiver pronto para receber o relacionamento, o código vai falhar.

**Podemos começar criando a definição das novas Entidades (Pai e Variantes) seguindo esse padrão do .md?**