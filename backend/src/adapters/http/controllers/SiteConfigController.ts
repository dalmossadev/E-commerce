// src/adapters/http/controllers/SiteConfigController.ts
import { Request, Response, NextFunction } from "express";
import { GetSiteInfoUseCase } from "../../../core/use-cases/site/GetSiteInfoUseCase";
import { logger } from "../../../infrastructure/logger/logger";

export class SiteConfigController {
  constructor(private getSiteInfoUseCase: GetSiteInfoUseCase) {}

  async getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await this.getSiteInfoUseCase.execute();
      
      if (!config) {
        res.status(404).json({ message: "Site configuration not found" });
        return;
      }

      res.json(config);
    } catch (error: any) {
      logger.error(`Error fetching site info: ${error.message}`);
      next(error);
    }
  }
}
