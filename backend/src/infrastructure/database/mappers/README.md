## Schemas do TypeORM (Mappers)

Esta pasta contém os **EntitySchema** do TypeORM que mapeiam as entidades de domínio para o banco de dados MySQL.

- **Padrão**: Usamos `EntitySchema` em vez de decoradores (`@Entity`, `@Column`) para manter o desacoplamento.
- **Localização**: Os schemas definem como os dados são persistidos no banco, não as regras de negócio.
- **Entidades mapeadas**: ProductSchema, ProductVariantSchema, UserSchema, CustomerSchema, SupplierSchema, OrderSchema, OrderItemSchema, PurchaseSchema, PurchaseItemSchema, CampaignSchema, SettingsSchema, AuditLogSchema, ProductHistorySchema, VariantHistorySchema

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
