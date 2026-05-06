import { Wishlist } from "../../domain/Wishlist";
import { IWishlistRepository } from "../../interfaces/IWishlistRepository";

export class GetUserWishlistUseCase {
    constructor(private wishlistRepository: IWishlistRepository) {}

    async execute(userId: number): Promise<Wishlist[]> {
        return await this.wishlistRepository.findByUserId(userId);
    }
}
