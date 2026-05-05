// src/core/domain/Payment.ts
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BOLETO = 'BOLETO'
}

export class Payment {
  id!: number;
  orderId!: number;
  order?: any; // Type avoided for circular dependency in domain, but needed for schema
  amount!: number; // centavos
  method!: PaymentMethod;
  status!: PaymentStatus;
  externalId?: string; // ID da transação no provedor (ex: E2E ID do PIX)
  qrCode?: string; // Base64 do QRCode
  pixPayload?: string; // Código copia-e-cola
  expiresAt?: Date;
  paidAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Partial<Payment> = {}) {
    Object.assign(this, props);
    this.status = this.status || PaymentStatus.PENDING;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }

  isPaid(): boolean {
    return this.status === PaymentStatus.PAID;
  }

  markAsPaid(externalId?: string): void {
    this.status = PaymentStatus.PAID;
    this.externalId = externalId;
    this.paidAt = new Date();
    this.updatedAt = new Date();
  }

  markAsFailed(): void {
    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
  }

  isExpired(): boolean {
    if (this.status !== PaymentStatus.PENDING) return false;
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }
}