// src/adapters/http/routes/banner.routes.ts
import { Router, Request, Response } from "express";
import { container } from "@core/container/Container";
import { upload } from "@infrastructure/upload/upload";

const bannerRouter = Router();
const bannerController = container.getBannerController();

bannerRouter.get("/", (req, res, next) => bannerController.list(req, res, next));

bannerRouter.post("/", (req: Request, res: Response, next) => bannerController.create(req, res, next));

bannerRouter.patch("/:id", (req: Request, res: Response, next) => bannerController.update(req, res, next));

bannerRouter.delete("/:id", (req: Request, res: Response, next) => bannerController.delete(req, res, next));

bannerRouter.post("/:id/image", upload.single('image'), (req: Request, res: Response, next) => bannerController.uploadImage(req, res, next));

export { bannerRouter };