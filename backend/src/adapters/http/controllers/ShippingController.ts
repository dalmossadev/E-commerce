import { Request, Response, NextFunction } from "express";
import { CalculateShippingUseCase } from "@core/use-cases/shipping/CalculateShippingUseCase";
import { ListShippingRulesUseCase } from "@core/use-cases/shipping/ListShippingRulesUseCase";
import { SaveShippingRuleUseCase } from "@core/use-cases/shipping/SaveShippingRuleUseCase";

export class ShippingController {
  constructor(
    private calculateShippingUseCase: CalculateShippingUseCase,
    private listShippingRulesUseCase: ListShippingRulesUseCase,
    private saveShippingRuleUseCase: SaveShippingRuleUseCase
  ) {}

  async calculate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { zipCode, amount } = req.body;
      if (!zipCode || amount === undefined) {
        res.status(400).json({ error: "CEP e valor da compra são obrigatórios." });
        return;
      }
      const result = await this.calculateShippingUseCase.execute(zipCode, Number(amount));
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rules = await this.listShippingRulesUseCase.execute();
      res.json(rules);
    } catch (error: any) {
      next(error);
    }
  }

  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rule = await this.saveShippingRuleUseCase.execute(req.body);
      res.json(rule);
    } catch (error: any) {
      next(error);
    }
  }
}
