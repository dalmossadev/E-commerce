import { Request, Response } from "express";
import { IBannerRepository } from "../../interfaces/IBannerRepository";
import { ListBannersUseCase } from "../../core/use-cases/banner/ListBannerUseCase";

export class BannerController {
  private listBannersUseCase: ListBannersUseCase;

  constructor(bannerRepository: IBannerRepository) {
    this.listBannersUseCase = new ListBannersUseCase(bannerRepository);
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const banners = await this.listBannersUseCase.execute();
      return res.json(banners.map(b => b.toJSON()));
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao buscar banners" });
    }
  }
}
