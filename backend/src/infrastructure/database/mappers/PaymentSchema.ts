// src/infrastructure/database/mappers/PaymentSchema.ts
import { EntitySchema } from "typeorm";
import { Payment, PaymentStatus, PaymentMethod } from "@core/domain/Payment";

export const PaymentSchema = new EntitySchema<Payment>({
  name: "Payment",
  target: Payment,
  tableName: "payments",
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    orderId: { type: "int" },
    amount: { type: "int" },
    method: { type: "varchar", length: 20 },
    status: { type: "varchar", length: 20, default: PaymentStatus.PENDING },
    externalId: { type: "varchar", length: 255, nullable: true },
    qrCode: { type: "text", nullable: true },
    pixPayload: { type: "text", nullable: true },
    expiresAt: { type: "timestamp", nullable: true },
    paidAt: { type: "timestamp", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: { name: "orderId" },
      onDelete: "CASCADE",
    },
  },
});
