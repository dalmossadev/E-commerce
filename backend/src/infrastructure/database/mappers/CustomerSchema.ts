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
      inverseSide: "customer",
      cascade: true
    }
  }
});