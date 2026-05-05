import { EntitySchema } from "typeorm";
import { FinancialTransaction, TransactionType, TransactionStatus, ReferenceType } from "@core/domain/FinancialTransaction";

export const FinancialTransactionSchema = new EntitySchema<FinancialTransaction>({
  name: "FinancialTransaction",
  tableName: "financial_transactions",
  target: FinancialTransaction,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    referenceId: {
      type: "int",
      nullable: true,
    },
    referenceType: {
      type: "enum",
      enum: ReferenceType,
      nullable: true,
    },
    type: {
      type: "enum",
      enum: TransactionType,
    },
    amount: {
      type: "int",
    },
    status: {
      type: "enum",
      enum: TransactionStatus,
      default: TransactionStatus.PENDING,
    },
    paymentMethod: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    provider: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    expectedSettlementDate: {
      type: "datetime",
      nullable: true,
    },
    settledAt: {
      type: "datetime",
      nullable: true,
    },
    description: {
      type: "varchar",
      length: 255,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
