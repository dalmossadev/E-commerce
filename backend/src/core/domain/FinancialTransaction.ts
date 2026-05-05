export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  FEE = 'FEE',
  REFUND = 'REFUND'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED'
}

export enum ReferenceType {
  ORDER = 'ORDER',
  PURCHASE = 'PURCHASE',
  OTHER = 'OTHER'
}

export class FinancialTransaction {
  id!: number;
  referenceId?: number;
  referenceType?: ReferenceType;
  type!: TransactionType;
  amount!: number; // Em centavos
  status!: TransactionStatus;
  paymentMethod?: string;
  provider?: string;
  expectedSettlementDate?: Date;
  settledAt?: Date;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: Partial<FinancialTransaction>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  isSettled(): boolean {
    return this.status === TransactionStatus.SETTLED;
  }

  markAsSettled(date: Date = new Date()): void {
    this.status = TransactionStatus.SETTLED;
    this.settledAt = date;
  }
}
