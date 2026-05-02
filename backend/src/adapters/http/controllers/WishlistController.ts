import { Request, Response, NextFunction } from "express";
import { container } from "@core/container/Container";
import { AuthRequest } from "@adapters/http/middlewares/AuthMiddleware";
import { AddProductToWishlistUseCase } from "@core/use-cases/wishlist/WishlistUseCases";
import { RemoveProductFromWishlistUseCase } from "@core/use-cases/wishlist/WishlistUseCases";
import { GetUserWishlistUseCase } from "@core/use-cases/wishlist/WishlistUseCases";

export class WishlistController {
    private addToWishlistUseCase: AddProductToWishlistUseCase;
    private removeFromWishlistUseCase: RemoveProductFromWishlistUseCase;
    private getUserWishlistUseCase: GetUserWishlistUseCase;

    constructor() {
        this.addToWishlistUseCase = container.addToWishlistUseCase();
        this.removeFromWishlistUseCase = container.removeFromWishlistUseCase();
        this.getUserWishlistUseCase = container.getUserWishlistUseCase();
    }

    addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.sub;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const { productId } = req.body;
            const wishlist = await this.addToWishlistUseCase.execute(userId, productId);
            res.status(201).json(wishlist);
        } catch (error) {
            next(error);
        }
    };

    getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.sub;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const wishlist = await this.getUserWishlistUseCase.execute(userId);
            res.json(wishlist);
        } catch (error) {
            next(error);
        }
    };

    removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user?.sub;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const productId = parseInt(req.body.productId);
            await this.removeFromWishlistUseCase.execute(userId, productId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
