import { ICouponRepository } from "@core/interfaces/ICouponRepository";

export class ValidateCouponUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(code: string, orderAmount: number): Promise<{
    valid: boolean;
    discountAmount: number;
    type: string;
    value: number;
    message?: string;
  }> {
    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon) {
      return { valid: false, discountAmount: 0, type: '', value: 0, message: "Cupom não encontrado." };
    }

    if (!coupon.active) {
      return { valid: false, discountAmount: 0, type: '', value: 0, message: "Cupom inativo." };
    }

    if (coupon.expirationDate && new Date() > coupon.expirationDate) {
      return { valid: false, discountAmount: 0, type: '', value: 0, message: "Cupom expirado." };
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, discountAmount: 0, type: '', value: 0, message: "Cupom esgotado." };
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return { 
        valid: false, 
        discountAmount: 0, 
        type: '', 
        value: 0, 
        message: `Valor mínimo para este cupom é de R$ ${coupon.minOrderAmount / 100}.` 
      };
    }

    const discountAmount = coupon.calculateDiscount(orderAmount);

    return {
      valid: true,
      discountAmount,
      type: coupon.type,
      value: coupon.value
    };
  }
}
