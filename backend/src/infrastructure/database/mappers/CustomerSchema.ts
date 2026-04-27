// src/infra/database/mappers/CustomerSchema.ts
import { EntitySchema } from "typeorm";
import { Customer } from "@core/domain/Customer";

export const CustomerSchema = new EntitySchema<Customer>({
  name: "Customer",
  target: Customer,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    fullName: { type: "varchar", length: 255 },
    cpf: { type: "varchar", length: 14, unique: true },
    phone: { type: "varchar", length: 20 },
    address: { type: "json", nullable: true },
  },
});