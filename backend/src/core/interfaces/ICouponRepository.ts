import { Coupon } from "../domain/Coupon";

export interface ICouponRepository {
  findAll(): Promise<Coupon[]>;
  findById(id: number): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  save(coupon: Coupon): Promise<Coupon>;
  delete(id: number): Promise<void>;
  incrementUses(id: number): Promise<void>;
}
