import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "@adapters/http/controllers/ProductController";
import { validate } from "@adapters/http/middlewares/ValidationMiddleware";
import { createProductSchema, updateProductSchema } from "@adapters/http/validations/product.validation";
import { container } from "@core/container/Container";
import { upload } from "@infrastructure/upload/upload";

const productRouter = Router();

const API_BASE = "/api/v1";

const productController = new ProductController(
  container.listProductsUseCase(),
  container.getProductBySkuUseCase(),
  container.createProductUseCase(),
  container.updateProductUseCase(),
  container.deleteProductUseCase(),
  container.uploadProductImageUseCase()
);

productRouter.post(
  "/",
  validate(createProductSchema),
  (req: Request, res: Response, next) => productController.create(req, res, next)
);

productRouter.get("/", (req: Request, res: Response, next: NextFunction) => productController.handle(req, res, next));

productRouter.get("/:sku", (req: Request, res: Response, next: NextFunction) => productController.getBySku(req, res, next));

productRouter.put(
  "/:sku",
  validate(updateProductSchema),
  (req: Request, res: Response, next) => productController.update(req, res, next)
);

productRouter.delete("/:sku", (req: Request, res: Response, next: NextFunction) => productController.delete(req, res, next));

productRouter.post(
  "/:sku/image",
  upload.single('image'),
  (req: Request, res: Response, next) => productController.uploadImage(req, res, next)
);

export { productRouter, API_BASE };