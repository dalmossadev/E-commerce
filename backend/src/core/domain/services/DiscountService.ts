import { IAuditRepository } from "@core/interfaces/IAuditRepository";

export interface ProgressiveDiscountRule {
  minQuantity: number;
  discountPercent: number;
}

export class DiscountService {
  private static readonly PROGRESSIVE_DISCOUNTS: ProgressiveDiscountRule[] = [
    { minQuantity: 10, discountPercent: 5 },
    { minQuantity: 20, discountPercent: 10 },
    { minQuantity: 50, discountPercent: 15 },
    { minQuantity: 100, discountPercent: 20 }
  ];

  constructor(private auditRepository?: IAuditRepository) {}

  calculateProgressiveDiscount(totalItems: number, subtotalInCents: number): number {
    if (totalItems < 10 || subtotalInCents <= 0) {
      return 0;
    }

    let applicableDiscount = 0;

    for (const rule of DiscountService.PROGRESSIVE_DISCOUNTS) {
      if (totalItems >= rule.minQuantity) {
        const discountAmount = Math.floor(subtotalInCents * rule.discountPercent / 100);
        if (discountAmount > applicableDiscount) {
          applicableDiscount = discountAmount;
        }
      }
    }

    return applicableDiscount;
  }

  validateDiscountAmount(discountInCents: number, subtotalInCents: number): boolean {
    if (discountInCents < 0) {
      return false;
    }
    if (discountInCents > subtotalInCents) {
      return false;
    }
    return true;
  }

  async applyDiscountWithAudit(params: {
    orderId: number;
    subtotalInCents: number;
    discountInCents: number;
    discountPercent: number;
    source: 'manual' | 'progressive';
    userId?: number;
    ip?: string;
    userAgent?: string;
  }): Promise<void> {
    if (!this.auditRepository) {
      return;
    }

    const details = JSON.stringify({
      orderId: params.orderId,
      subtotal: params.subtotalInCents,
      discountAmount: params.discountInCents,
      discountPercent: params.discountPercent,
      source: params.source
    });

    await this.auditRepository.saveLog({
      userId: params.userId,
      action: 'ORDER_DISCOUNT_APPLIED',
      entity: 'Order',
      entityId: params.orderId.toString(),
      newValue: details,
      ip: params.ip,
      userAgent: params.userAgent
    });
  }
}
