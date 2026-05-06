import { ICouponRepository } from "@core/interfaces/ICouponRepository";
import { Coupon } from "@core/domain/Coupon";

export class ListCouponsUseCase {
  constructor(private couponRepository: ICouponRepository) {}

  async execute(): Promise<Coupon[]> {
    return await this.couponRepository.findAll();
  }
}
