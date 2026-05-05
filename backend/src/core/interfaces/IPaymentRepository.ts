// src/core/interfaces/IPaymentRepository.ts
import { Payment } from "../domain/Payment";

export interface IPaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findById(id: number): Promise<Payment | null>;
  findByExternalId(externalId: string): Promise<Payment | null>;
  findByOrderId(orderId: number): Promise<Payment | null>;
  update(payment: Payment): Promise<void>;
}
