// src/infra/database/mappers/SupplierSchema.ts
import { EntitySchema } from "typeorm";
import { Supplier } from "@core/domain/Supplier";

export const SupplierSchema = new EntitySchema<Supplier>({
  name: "Supplier",
  target: Supplier,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    companyName: { type: "varchar", length: 255 },
    tradeName: { type: "varchar", length: 255, nullable: true },
    cnpj: { type: "varchar", length: 18, unique: true },
    contactEmail: { type: "varchar", length: 255 },
    phone: { type: "varchar", length: 20, nullable: true },
    website: { type: "varchar", length: 255, nullable: true },
    categoryId: { type: "int" },
    status: { 
      type: "enum", 
      enum: ["ACTIVE", "INACTIVE"], 
      default: "ACTIVE" 
    },
    createdAt: { 
      type: "timestamp", 
      precision: 0,
      createDate: true, 
      default: () => "CURRENT_TIMESTAMP" 
    },
    updatedAt: { 
      type: "timestamp", 
      precision: 0,
      updateDate: true, 
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP"
    },
  },
  relations: {
    addresses: {
      type: "one-to-many",
      target: "Address",
      inverseSide: "supplier",
      cascade: true
    },
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "categoryId" },
      onDelete: "RESTRICT",
    }
  }
});