// src/adapters/http/routes/site.routes.ts
import { Router } from "express";
import { container } from "@core/container/Container";

const siteRouter = Router();
const controller = container.getSiteConfigController();

siteRouter.get("/info", (req, res, next) => controller.getInfo(req, res, next));

export { siteRouter };
