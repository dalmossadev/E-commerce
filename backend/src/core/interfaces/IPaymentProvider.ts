export interface ChargeResponse {
  externalId: string;
  qrCodePayload: string;
  qrCodeBase64: string;
  expiresAt: Date;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';

export interface IPaymentProvider {
  generateCharge(orderId: string, amountCents: number, description: string): Promise<ChargeResponse>;
  getChargeStatus(externalId: string): Promise<PaymentStatus>;
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
