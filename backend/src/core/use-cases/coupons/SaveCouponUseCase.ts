import { ICouponRepository } from "@core/interfaces/ICouponRepository";
import { Coupon } from "@core/domain/Coupon";

export class SaveCouponUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(data: any): Promise<Coupon> {
    const coupon = new Coupon({
      ...data,
      code: data.code.toUpperCase(),
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined
    });
    return await this.couponRepository.save(coupon);
  }
}
