// src/infrastructure/database/mappers/AddressSchema.ts
import { EntitySchema } from "typeorm";
import { Address } from "@core/domain/Address";

export const AddressSchema = new EntitySchema<Address>({
  name: "Address",
  target: Address,
  tableName: "addresses",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    street: { type: "varchar", length: 255 },
    number: { type: "varchar", length: 20 },
    complement: { type: "varchar", length: 255, nullable: true },
    neighborhood: { type: "varchar", length: 100 },
    city: { type: "varchar", length: 100 },
    state: { type: "varchar", length: 2 },
    zipCode: { type: "varchar", length: 10 },
    latitude: { type: "decimal", precision: 10, scale: 8, nullable: true },
    longitude: { type: "decimal", precision: 11, scale: 8, nullable: true },
    isMain: { type: "boolean", default: false },
    tag: { type: "varchar", length: 50, nullable: true },
    customerId: { type: "int", nullable: true },
    supplierId: { type: "int", nullable: true },
  },
  relations: {
    customer: {
      type: "many-to-one",
      target: "Customer",
      joinColumn: { name: "customerId" },
      onDelete: "CASCADE",
      nullable: true
    },
    supplier: {
      type: "many-to-one",
      target: "Supplier",
      joinColumn: { name: "supplierId" },
      onDelete: "CASCADE",
      nullable: true
    }
  }
});
