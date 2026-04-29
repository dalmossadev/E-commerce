// src/infra/database/mappers/ProductSchema.ts
import { EntitySchema } from "typeorm";
import { Product } from "../../../core/domain/Product";

export const ProductSchema = new EntitySchema<Product>({
  name: "Product",
  target: Product,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    name: { type: "varchar", length: 255 },
    brand: { type: "varchar", length: 100, nullable: true },
    description: { type: "text" },
    basePrice: { type: "int", nullable: true },
    originalPrice: { type: "int", nullable: true },
    category: { type: "varchar", length: 50 },
    imageName: { type: "varchar", length: 255 },
    altText: { type: "varchar", length: 255 },
    badge: { type: "varchar", length: 50, nullable: true },
    featured: { type: "boolean", default: false },
    inStock: { type: "boolean", default: true },
    specs: { type: "json", nullable: true },
    
    // Colunas de Auditoria
    updatedBy: { type: "int", nullable: true }, 
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    // Relação com as variantes (SKUs)
    variants: {
      type: "one-to-many",
      target: "ProductVariant",
      cascade: true,
      eager: true,
      inverseSide: "product", 
    },
    
    // Relação de Auditoria: Quem foi o último a modificar o produto
    modifier: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "updatedBy" },
      onDelete: "SET NULL", // Mantém o produto mesmo se o usuário for removido
    },
  },
});