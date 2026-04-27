import { EntitySchema } from "typeorm";
import { ProductHistory } from "@core/domain/ProductHistory";

export const ProductHistorySchema = new EntitySchema<ProductHistory>({
  name: "ProductHistory",
  target: ProductHistory,
  tableName: "product_history",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    productId: { type: "int" },
    action: { type: "varchar", length: 10 },
    dataSnapshot: { type: "json" }, // No MySQL, usamos 'json'
    changedBy: { type: "varchar", length: 100, nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
});