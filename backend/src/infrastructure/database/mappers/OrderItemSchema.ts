import { EntitySchema } from "typeorm";
import { OrderItem } from "@core/domain/Order";

export const OrderItemSchema = new EntitySchema<OrderItem>({
  name: "OrderItem",
  target: OrderItem,
  tableName: "order_items",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    orderId: { type: "int" },
    variantId: { type: "int" },
    sku: { type: "varchar", length: 100 },
    productName: { type: "varchar", length: 255 },
    color: { type: "varchar", length: 50, nullable: true },
    size: { type: "varchar", length: 20, nullable: true },
    quantity: { type: "int" },
    unitPrice: { type: "int" },
    totalPrice: { type: "int" },
    fulfillmentType: { type: "varchar", length: 20 }
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: { name: "orderId" },
      inverseSide: "items",
      onDelete: "CASCADE"
    }
  }
});