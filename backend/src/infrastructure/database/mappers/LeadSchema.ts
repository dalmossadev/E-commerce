import { EntitySchema } from "typeorm";
import { Lead, LeadStatus } from "@core/domain/Lead";

export const LeadSchema = new EntitySchema<Lead>({
  name: "Lead",
  target: Lead,
  tableName: "leads",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    sku: { type: "varchar", length: 50, nullable: true },
    customerName: { type: "varchar", length: 255 },
    customerPhone: { type: "varchar", length: 20 },
    customerEmail: { type: "varchar", length: 255, nullable: true },
    status: { 
      type: "varchar", 
      length: 20,
      default: LeadStatus.PENDING 
    },
    notes: { type: "text", nullable: true },
    productId: { type: "int" },
    variantId: { type: "int", nullable: true },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" }
  }
});