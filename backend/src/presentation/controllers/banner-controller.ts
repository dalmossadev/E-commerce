// src/presentation/controllers/banner-controller.ts
import { Request, Response, NextFunction } from "express";
import { ListBannersUseCase } from "../../core/use-cases/banner/ListBannerUseCase";
import { logger } from "../../infrastructure/logger/logger";

export class BannerController {
  constructor(private listBannersUseCase: ListBannersUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await this.listBannersUseCase.execute();
      res.json(banners.map(b => b.toJSON()));
    } catch (error: any) {
      logger.error(`Erro ao buscar banners: ${error.message}`);
      next(error);
    }
  }
}
