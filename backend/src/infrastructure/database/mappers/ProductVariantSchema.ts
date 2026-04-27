import { EntitySchema } from "typeorm";
import { ProductVariant, FulfillmentType } from "@core/domain/ProductVariant";

export const ProductVariantSchema = new EntitySchema<ProductVariant>({
  name: "ProductVariant",
  target: ProductVariant,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    sku: { type: "varchar", length: 100, unique: true },
    productId: { type: "int" },
    color: { type: "varchar", length: 50 },
    size: { type: "varchar", length: 20 },
    price: { type: "int" },
    stock: { type: "int", default: 0 },
    fulfillmentType: { 
      type: "varchar", 
      length: 20,
      default: FulfillmentType.ON_DEMAND 
    },
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