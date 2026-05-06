import { EntitySchema } from "typeorm";
import { Order, OrderStatus } from "@core/domain/Order";

export const OrderSchema = new EntitySchema<Order>({
  name: "Order",
  target: Order,
  tableName: "orders",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    customerId: { type: "int", nullable: true },
    customerName: { type: "varchar", length: 255 },
    customerEmail: { type: "varchar", length: 255 },
    customerPhone: { type: "varchar", length: 20 },
    shippingAddress: { type: "text", nullable: true },
    subtotal: { type: "int", default: 0 },
    discount: { type: "int", default: 0 },
    discountSource: { type: "varchar", length: 20, default: 'none' },
    couponCode: { type: "varchar", length: 50, nullable: true },
    couponDiscount: { type: "int", default: 0 },
    shippingCost: { type: "int", default: 0 },
    total: { type: "int", default: 0 },
    status: { 
      type: "varchar", 
      length: 20,
      default: OrderStatus.PENDING 
    },
    paymentMethod: { 
      type: "varchar", 
      length: 20,
      nullable: true 
    },
    notes: { type: "text", nullable: true },
    paymentConfirmedAt: { type: "timestamp", nullable: true, name: "paymentConfirmedAt" },
    paymentProvider: { type: "varchar", length: 50, nullable: true },
    paymentExternalId: { type: "varchar", length: 255, nullable: true },
    paymentStatus: { type: "varchar", length: 50, nullable: true, default: 'PENDING' },
    paymentQrCode: { type: "text", nullable: true },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" }
  },
  relations: {
    items: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "order",
      cascade: true
    }
  }
});