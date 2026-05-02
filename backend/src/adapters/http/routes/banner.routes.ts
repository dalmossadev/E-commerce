import { Router } from "express";
import { BannerController } from "../../../presentation/controllers/banner-controller";
import { TypeORMBannerRepository } from "../../../infrastructure/database/repositories/TypeORMBannerRepository";

const bannerRouter = Router();
const bannerRepository = new TypeORMBannerRepository();
const bannerController = new BannerController(bannerRepository);

bannerRouter.get("/", (req, res) => bannerController.handle(req, res));

export { bannerRouter };