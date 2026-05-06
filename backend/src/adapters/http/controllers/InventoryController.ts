import { Request, Response, NextFunction } from "express";
import { ListInventoryUseCase } from "@core/use-cases/inventory/ListInventoryUseCase";
import { UpdateStockUseCase } from "@core/use-cases/inventory/UpdateStockUseCase";

export class InventoryController {
  constructor(
    private listInventoryUseCase: ListInventoryUseCase,
    private updateStockUseCase: UpdateStockUseCase
  ) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await this.listInventoryUseCase.execute();
      res.json(inventory);
    } catch (error: any) {
      next(error);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { variantId, quantity } = req.body;
      const updated = await this.updateStockUseCase.execute(Number(variantId), Number(quantity));
      res.json(updated);
    } catch (error: any) {
      next(error);
    }
  }
}
