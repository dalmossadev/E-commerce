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

  async getAggregatedStats(startDate: Date, endDate: Date, interval: 'day' | 'week' | 'month' | 'year'): Promise<Array<{
    period: string;
    income: number;
    expense: number;
    net: number;
  }>> {
    const transactions = await this.repository.find({
      where: {
        settledAt: Between(startDate, endDate),
        status: TransactionStatus.SETTLED
      },
      order: { settledAt: 'ASC' }
    });

    const groups: Record<string, { income: number; expense: number; net: number }> = {};

    transactions.forEach(t => {
      let period = '';
      const date = t.settledAt!;
      
      if (interval === 'day') period = date.toISOString().split('T')[0];
      else if (interval === 'month') period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      else if (interval === 'year') period = `${date.getFullYear()}`;
      else {
        // Simple week grouping
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay()); // First day of week
        period = d.toISOString().split('T')[0];
      }

      if (!groups[period]) groups[period] = { income: 0, expense: 0, net: 0 };
      
      if (t.type === TransactionType.INCOME) groups[period].income += t.amount;
      else {
        groups[period].expense += t.amount;
      }
      groups[period].net = groups[period].income - groups[period].expense;
    });

    return Object.entries(groups).map(([period, data]) => ({
      period,
      ...data
    }));
  }
}
