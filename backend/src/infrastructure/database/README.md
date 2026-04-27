## Mapeamento de Dados (Mappers/Schemas)

Para manter o Core puro, utilizamos o **EntitySchema** do TypeORM.
- **Localização**: `src/infrastructure/database/mappers/`
- **Função**: Traduzir a classe pura do Core para as colunas reais do MySQL.
- **Entidades mapeadas**: Product, ProductVariant, User, Customer, Supplier, Order, OrderItem, Purchase, PurchaseItem, Campaign, Settings, AuditLog, ProductHistory, VariantHistory

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
