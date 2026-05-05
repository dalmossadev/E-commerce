// src/infrastructure/database/repositories/TypeORMPaymentRepository.ts
import { Repository } from "typeorm";
import { Payment } from "../../../core/domain/Payment";
import { IPaymentRepository } from "../../../core/interfaces/IPaymentRepository";
import { AppDataSource } from "../data-source";
import { PaymentSchema } from "../mappers/PaymentSchema";

export class TypeORMPaymentRepository implements IPaymentRepository {
  private repository: Repository<Payment>;

  constructor() {
    this.repository = AppDataSource.getRepository(PaymentSchema);
  }

  async save(payment: Payment): Promise<Payment> {
    const saved = await this.repository.save(payment);
    return new Payment(saved);
  }

  async findById(id: number): Promise<Payment | null> {
    const payment = await this.repository.findOne({ where: { id } });
    return payment ? new Payment(payment) : null;
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    const payment = await this.repository.findOne({ where: { externalId } });
    return payment ? new Payment(payment) : null;
  }

  async findByOrderId(orderId: number): Promise<Payment | null> {
    const payment = await this.repository.findOne({ where: { orderId } });
    return payment ? new Payment(payment) : null;
  }

  async update(payment: Payment): Promise<void> {
    await this.repository.update(payment.id, payment);
  }
}
