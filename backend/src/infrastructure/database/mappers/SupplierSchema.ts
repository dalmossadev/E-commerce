// src/infra/database/mappers/SupplierSchema.ts
import { EntitySchema } from "typeorm";
import { Supplier } from "@core/domain/Supplier";

export const SupplierSchema = new EntitySchema<Supplier>({
  name: "Supplier",
  target: Supplier,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    companyName: { type: "varchar", length: 255 },
    cnpj: { type: "varchar", length: 18, unique: true },
    contactEmail: { type: "varchar", length: 255 },
    category: { type: "varchar", length: 100 },
  },
});