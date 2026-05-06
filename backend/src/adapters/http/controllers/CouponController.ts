import { Request, Response, NextFunction } from "express";
import { ValidateCouponUseCase } from "@core/use-cases/coupons/ValidateCouponUseCase";
import { ListCouponsUseCase } from "@core/use-cases/coupons/ListCouponsUseCase";
import { SaveCouponUseCase } from "@core/use-cases/coupons/SaveCouponUseCase";

export class CouponController {
  constructor(
    private validateCouponUseCase: ValidateCouponUseCase,
    private listCouponsUseCase: ListCouponsUseCase,
    private saveCouponUseCase: SaveCouponUseCase
  ) {}

  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, amount } = req.body;
      const result = await this.validateCouponUseCase.execute(code, Number(amount));
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await this.listCouponsUseCase.execute();
      res.json(coupons);
    } catch (error: any) {
      next(error);
    }
  }

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await this.saveCouponUseCase.execute(req.body);
      res.json(coupon);
    } catch (error: any) {
      next(error);
    }
  }
}
