// src/adapters/http/routes/banner.routes.ts
import { Router } from "express";
import { BannerController } from "../../../presentation/controllers/banner-controller";
import { TypeORMBannerRepository } from "../../../infrastructure/database/repositories/TypeORMBannerRepository";
import { ListBannersUseCase } from "../../../core/use-cases/banner/ListBannerUseCase";

const bannerRouter = Router();

// Injeção de dependência manual (Factory Pattern)
const bannerRepository = new TypeORMBannerRepository();
const listBannersUseCase = new ListBannersUseCase(bannerRepository);
const bannerController = new BannerController(listBannersUseCase);

bannerRouter.get("/", (req, res, next) => bannerController.handle(req, res, next));

export { bannerRouter };