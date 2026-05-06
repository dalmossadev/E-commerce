// src/infrastructure/database/mappers/CategorySchema.ts
import { EntitySchema } from "typeorm";
import { Category } from "@core/domain/Category";

export const CategorySchema = new EntitySchema<Category>({
  name: "Category",
  target: Category,
  tableName: "categories",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    name: { type: "varchar", length: 100 },
    slug: { type: "varchar", length: 100, unique: true },
    description: { type: "text", nullable: true },
    type: { type: "varchar", length: 20 }, // 'PRODUCT' or 'SUPPLIER'
    parentId: { type: "int", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    parent: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "parentId" },
      inverseSide: "children",
      onDelete: "SET NULL",
    },
    children: {
      type: "one-to-many",
      target: "Category",
      inverseSide: "parent",
    },
  },
});
