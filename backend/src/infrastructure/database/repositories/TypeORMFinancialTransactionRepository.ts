import { Repository, Between } from "typeorm";
import { AppDataSource } from "../data-source";
import { IFinancialTransactionRepository } from "@core/interfaces/IFinancialTransactionRepository";
import { FinancialTransaction, TransactionType, ReferenceType, TransactionStatus } from "@core/domain/FinancialTransaction";

export class TypeORMFinancialTransactionRepository implements IFinancialTransactionRepository {
  private repository: Repository<FinancialTransaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(FinancialTransaction);
  }

  async create(transaction: FinancialTransaction): Promise<FinancialTransaction> {
    const entity = this.repository.create(transaction);
    return await this.repository.save(entity);
  }

  async findById(id: number): Promise<FinancialTransaction | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByReference(referenceId: number, referenceType: ReferenceType): Promise<FinancialTransaction[]> {
    return await this.repository.find({ where: { referenceId, referenceType } });
  }

  async findByType(type: TransactionType): Promise<FinancialTransaction[]> {
    return await this.repository.find({ where: { type } });
  }

  async findByStatus(status: TransactionStatus): Promise<FinancialTransaction[]> {
    return await this.repository.find({ where: { status } });
  }

  async update(transaction: FinancialTransaction): Promise<FinancialTransaction> {
    return await this.repository.save(transaction);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async calculateBalanceByPeriod(startDate: Date, endDate: Date): Promise<{
    income: number;
    expense: number;
    fees: number;
    net: number;
  }> {
    const transactions = await this.repository.find({
      where: {
        settledAt: Between(startDate, endDate),
        status: TransactionStatus.SETTLED
      }
    });

    let income = 0;
    let expense = 0;
    let fees = 0;

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) income += t.amount;
      if (t.type === TransactionType.EXPENSE) expense += t.amount;
      if (t.type === TransactionType.FEE) fees += t.amount;
      if (t.type === TransactionType.REFUND) expense += t.amount;
    });

    return {
      income,
      expense,
      fees,
      net: income - expense - fees
    };
  }
}
