import { EntitySchema } from "typeorm";
import { ProductVariant } from "@core/domain/ProductVariant";

export const ProductVariantSchema = new EntitySchema<ProductVariant>({
  name: "ProductVariant",
  target: ProductVariant,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    sku: { type: "varchar", length: 100, unique: true },
    productId: { type: "int" },
    color: { type: "varchar", length: 50, nullable: true },
    size: { type: "varchar", length: 20, nullable: true },
    price: { type: "int" },
    stock: { type: "int", default: 0 },
    fulfillmentType: { type: "varchar", length: 20, name: "fulfillment_type", nullable: true },
    inStock: { type: "boolean", name: "in_stock", nullable: true },
  },
  relations: {
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: { name: "productId" },
      inverseSide: "variants",
      onDelete: "CASCADE",
    },
  },
});