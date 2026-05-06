import { Router } from "express";
import { container } from "@core/container/Container";
import { requireAuth, requireAdmin } from "@adapters/http/middlewares/AuthMiddleware";

const couponRouter = Router();
const couponController = container.getCouponController();

// Público: Validação no checkout
couponRouter.post(
  "/validate", 
  (req, res, next) => couponController.validate(req, res, next)
);

// Admin: Gestão de cupons
couponRouter.get(
  "/", 
  requireAuth, 
  requireAdmin, 
  (req, res, next) => couponController.list(req, res, next)
);

couponRouter.post(
  "/", 
  requireAuth, 
  requireAdmin, 
  (req, res, next) => couponController.save(req, res, next)
);

export { couponRouter };
