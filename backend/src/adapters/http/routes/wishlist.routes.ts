import { Router } from "express";
import { WishlistController } from "../controllers/WishlistController";
import { authenticate } from "../middlewares/AuthMiddleware";
import { validate } from "../middlewares/ValidationMiddleware";
import { addToWishlistSchema } from "../validations/wishlist.validation";

const wishlistRouter = Router();

const wishlistController = new WishlistController();

wishlistRouter.post("/", authenticate, validate(addToWishlistSchema), wishlistController.addToWishlist);
wishlistRouter.get("/", authenticate, wishlistController.getWishlist);
wishlistRouter.delete("/", authenticate, wishlistController.removeFromWishlist);

export { wishlistRouter };
