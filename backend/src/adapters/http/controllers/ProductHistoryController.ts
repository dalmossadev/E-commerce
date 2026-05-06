import { Request, Response, NextFunction } from 'express';
import { GetVariantHistoryBySkuUseCase } from '@core/use-cases/product-history/GetVariantHistoryBySkuUseCase';
import { GetAllVariantHistoryUseCase } from '@core/use-cases/product-history/GetAllVariantHistoryUseCase';

export class ProductHistoryController {
  constructor(
    private getBySkuUseCase: GetVariantHistoryBySkuUseCase,
    private getAllUseCase: GetAllVariantHistoryUseCase
  ) {}

  async getBySku(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sku = req.params.sku as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await this.getBySkuUseCase.execute(sku, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await this.getAllUseCase.execute(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
