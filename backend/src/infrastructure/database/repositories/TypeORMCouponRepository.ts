import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Coupon } from "@core/domain/Coupon";
import { CouponSchema } from "../mappers/CouponSchema";
import { ICouponRepository } from "@core/interfaces/ICouponRepository";

export class TypeORMCouponRepository implements ICouponRepository {
  private repository: Repository<Coupon>;

  constructor() {
    this.repository = AppDataSource.getRepository(CouponSchema);
  }

  async findAll(): Promise<Coupon[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Coupon | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return await this.repository.findOne({ where: { code: code.toUpperCase() } });
  }

  async save(coupon: Coupon): Promise<Coupon> {
    return await this.repository.save(coupon);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async incrementUses(id: number): Promise<void> {
    await this.repository.increment({ id }, "currentUses", 1);
  }
}
