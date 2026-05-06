import { Router } from "express";
import { container } from "@core/container/Container";
import { authenticate } from "../middlewares/AuthMiddleware";
import { validate } from "../middlewares/ValidationMiddleware";
import { addToWishlistSchema } from "../validations/wishlist.validation";

const wishlistRouter = Router();
const wishlistController = container.getWishlistController();

wishlistRouter.post("/", authenticate, validate(addToWishlistSchema), (req, res, next) => wishlistController.addToWishlist(req, res, next));
wishlistRouter.get("/", authenticate, (req, res, next) => wishlistController.getWishlist(req, res, next));
wishlistRouter.delete("/", authenticate, (req, res, next) => wishlistController.removeFromWishlist(req, res, next));

export { wishlistRouter };
