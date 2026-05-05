// src/adapters/http/routes/site.routes.ts
import { Router } from "express";
import { SiteConfigController } from "../controllers/SiteConfigController";
import { GetSiteInfoUseCase } from "../../../core/use-cases/site/GetSiteInfoUseCase";
import { TypeORMSiteConfigRepository } from "../../../infrastructure/database/repositories/TypeORMSiteConfigRepository";

const siteRouter = Router();

// Injeção de dependência manual (Factory Pattern)
const siteConfigRepository = new TypeORMSiteConfigRepository();
const getSiteInfoUseCase = new GetSiteInfoUseCase(siteConfigRepository);
const controller = new SiteConfigController(getSiteInfoUseCase);

siteRouter.get("/info", (req, res, next) => controller.getInfo(req, res, next));

export { siteRouter };
