import { Wishlist } from "@core/domain/Wishlist";

export interface IWishlistRepository {
    save(wishlist: Wishlist): Promise<Wishlist>;
    findByUserAndProduct(userId: number, productId: number): Promise<Wishlist | undefined>;
    findByLeadAndProduct(leadId: number, productId: number): Promise<Wishlist | undefined>;
    findByUserId(userId: number): Promise<Wishlist[]>;
    delete(id: number): Promise<void>;
}
