import { EntitySchema } from "typeorm";

export const VariantHistorySchema = new EntitySchema({
  name: "VariantHistory",
  tableName: "product_variant_history",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    sku: { type: "varchar", length: 100 },
    action: { type: "varchar", length: 10 },
    oldPrice: { type: "int" },
    newPrice: { type: "int" },
    oldStock: { type: "int" },
    newStock: { type: "int" },
    changedBy: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
});