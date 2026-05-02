import { Request, Response } from "express";
import { ListBannersUseCase } from "../../core/use-cases/banner/ListBannerUseCase";

export class BannerController {
  constructor(private listBannersUseCase: ListBannersUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const banners = await this.listBannersUseCase.execute();
      return res.json(banners);
    } catch (error: any) {
      return res.status(500).json({ message: "Erro ao buscar banners" });
    }
  }
}