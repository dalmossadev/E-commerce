import { Router } from "express";
import { container } from "@core/container/Container";
import { requireAuth, requireAdmin } from "@adapters/http/middlewares/AuthMiddleware";

const inventoryRouter = Router();
const inventoryController = container.getInventoryController();

inventoryRouter.get(
  "/", 
  requireAuth, 
  requireAdmin, 
  (req, res, next) => inventoryController.list(req, res, next)
);

inventoryRouter.patch(
  "/stock", 
  requireAuth, 
  requireAdmin, 
  (req, res, next) => inventoryController.updateStock(req, res, next)
);

export { inventoryRouter };
