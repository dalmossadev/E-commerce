import { EntitySchema } from "typeorm";
import { Purchase, PurchaseStatus } from "@core/domain/Purchase";

export const PurchaseSchema = new EntitySchema<Purchase>({
  name: "Purchase",
  target: Purchase,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    supplierId: { type: "int" },
    supplierName: { type: "varchar", length: 255 },
    subtotal: { type: "bigint", default: 0 },
    total: { type: "bigint", default: 0 },
    status: { 
      type: "varchar", 
      length: 20,
      default: PurchaseStatus.PENDING 
    },
    notes: { type: "text", nullable: true },
    expectedDeliveryDate: { type: "timestamp", nullable: true },
    trackingNumber: { type: "varchar", length: 100, nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    items: {
      type: "one-to-many",
      target: "PurchaseItem",
      inverseSide: "purchase",
      cascade: true
    }
  }
});