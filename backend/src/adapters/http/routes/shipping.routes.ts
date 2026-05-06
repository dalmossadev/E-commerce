import { Router } from "express";
import { container } from "@core/container/Container";
import { requireAuth, requireAdmin } from "@adapters/http/middlewares/AuthMiddleware";

const shippingRouter = Router();
const shippingController = container.getShippingController();

// Público: Cálculo de frete no checkout
shippingRouter.post(
  "/calculate", 
  (req, res, next) => shippingController.calculate(req, res, next)
);

// Admin: Gestão de regras
shippingRouter.get(
  "/rules", 
  requireAuth, 
  requireAdmin, 
  (req, res, next) => shippingController.list(req, res, next)
);

shippingRouter.post(
  "/rules", 
  requireAuth, 
  requireAdmin, 
  (req, res, next) => shippingController.save(req, res, next)
);

export { shippingRouter };
