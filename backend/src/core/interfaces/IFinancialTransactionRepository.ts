import { FinancialTransaction, TransactionType, ReferenceType, TransactionStatus } from "../domain/FinancialTransaction";

export interface IFinancialTransactionRepository {
  create(transaction: FinancialTransaction): Promise<FinancialTransaction>;
  findById(id: number): Promise<FinancialTransaction | null>;
  findByReference(referenceId: number, referenceType: ReferenceType): Promise<FinancialTransaction[]>;
  findByType(type: TransactionType): Promise<FinancialTransaction[]>;
  findByStatus(status: TransactionStatus): Promise<FinancialTransaction[]>;
  update(transaction: FinancialTransaction): Promise<FinancialTransaction>;
  delete(id: number): Promise<void>;
  
  // Queries for the Ledger
  calculateBalanceByPeriod(startDate: Date, endDate: Date): Promise<{
    income: number;
    expense: number;
    fees: number;
    net: number;
  }>;
}
