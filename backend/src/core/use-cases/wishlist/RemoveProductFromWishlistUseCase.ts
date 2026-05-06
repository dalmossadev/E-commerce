import { IWishlistRepository } from "../../interfaces/IWishlistRepository";
import { NotFoundError } from "../../errors/CustomErrors";

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
