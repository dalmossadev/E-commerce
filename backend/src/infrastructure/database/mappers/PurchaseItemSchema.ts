import { EntitySchema } from "typeorm";
import { PurchaseItem } from "@core/domain/Purchase";

export const PurchaseItemSchema = new EntitySchema<PurchaseItem>({
  name: "PurchaseItem",
  target: PurchaseItem,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    purchaseId: { type: "int" },
    variantId: { type: "int" },
    sku: { type: "varchar", length: 50 },
    productName: { type: "varchar", length: 255 },
    color: { type: "varchar", length: 50, nullable: true },
    size: { type: "varchar", length: 20, nullable: true },
    quantity: { type: "int", default: 0 },
    unitCost: { type: "bigint", default: 0 },
    totalCost: { type: "bigint", default: 0 },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});