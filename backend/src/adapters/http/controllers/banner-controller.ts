// src/presentation/controllers/banner-controller.ts
import { Request, Response, NextFunction } from "express";
import { ListBannersUseCase } from "@core/use-cases/banner/ListBannerUseCase";
import { CreateBannerUseCase } from "@core/use-cases/banner/CreateBannerUseCase";
import { UpdateBannerUseCase } from "@core/use-cases/banner/UpdateBannerUseCase";
import { DeleteBannerUseCase } from "@core/use-cases/banner/DeleteBannerUseCase";
import { UploadBannerImageUseCase } from "@core/use-cases/banner/UploadBannerImageUseCase";
import { logger } from "@infrastructure/logger/logger";

export class BannerController {
  constructor(
    private listBannersUseCase: ListBannersUseCase,
    private createBannerUseCase: CreateBannerUseCase,
    private updateBannerUseCase: UpdateBannerUseCase,
    private deleteBannerUseCase: DeleteBannerUseCase,
    private uploadBannerImageUseCase?: UploadBannerImageUseCase
  ) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await this.listBannersUseCase.execute();
      res.json(banners.map((b: any) => b.toJSON()));
    } catch (error: any) {
      logger.error(`Erro ao buscar banners: ${error.message}`);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = await this.createBannerUseCase.execute(req.body);
      res.status(201).json(banner.toJSON());
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const banner = await this.updateBannerUseCase.execute(id, req.body);
      res.json(banner.toJSON());
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.deleteBannerUseCase.execute(id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const type = req.body.type as 'desktop' | 'mobile';
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: "Nenhuma imagem enviada" });
        return;
      }

      if (this.uploadBannerImageUseCase) {
        const imageUrl = await this.uploadBannerImageUseCase.execute(id, type, file);
        res.json({ imageUrl });
      } else {
        res.status(501).json({ message: "Upload não configurado" });
      }
    } catch (error: any) {
      next(error);
    }
  }
}
