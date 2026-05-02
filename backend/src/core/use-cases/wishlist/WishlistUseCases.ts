import { Wishlist } from "@core/domain/Wishlist";
import { IWishlistRepository } from "@core/interfaces/IWishlistRepository";
import { IProductRepository } from "@core/interfaces/IProductRepository";
import { IUserRepository } from "@core/interfaces/IUserRepository";
import { NotFoundError } from "@core/errors/CustomErrors";

export class AddProductToWishlistUseCase {
    constructor(
        private wishlistRepository: IWishlistRepository,
        private productRepository: IProductRepository,
        private userRepository: IUserRepository
    ) {}

    async execute(userId: number | undefined, productId: number, leadId?: number): Promise<Wishlist> {
        if (!userId && !leadId) {
            throw new Error("Must provide either userId or leadId to add to wishlist");
        }

        if (userId) {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new NotFoundError("User", userId);
            }
            const existing = await this.wishlistRepository.findByUserAndProduct(userId, productId);
            if (existing) return existing;
        }

        if (leadId) {
            const existing = await this.wishlistRepository.findByLeadAndProduct(leadId, productId);
            if (existing) return existing;
        }

        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new NotFoundError("Product", productId);
        }

        const wishlist = new Wishlist({
            userId,
            leadId,
            productId,
        });

        return await this.wishlistRepository.save(wishlist);
    }
}

export class RemoveProductFromWishlistUseCase {
    constructor(private wishlistRepository: IWishlistRepository) {}

    async execute(userId: number, productId: number): Promise<void> {
        const wishlist = await this.wishlistRepository.findByUserAndProduct(userId, productId);
        if (!wishlist) {
            throw new NotFoundError("Wishlist item", productId);
        }

        await this.wishlistRepository.delete(wishlist.id);
    }
}

export class GetUserWishlistUseCase {
    constructor(private wishlistRepository: IWishlistRepository) {}

    async execute(userId: number): Promise<Wishlist[]> {
        return await this.wishlistRepository.findByUserId(userId);
    }
}
