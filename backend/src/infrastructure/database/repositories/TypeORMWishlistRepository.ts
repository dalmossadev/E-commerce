import { AppDataSource } from "@infrastructure/database/data-source";
import { Wishlist } from "@core/domain/Wishlist";
import { IWishlistRepository } from "@core/interfaces/IWishlistRepository";

export class TypeORMWishlistRepository implements IWishlistRepository {
    private repository = AppDataSource.getRepository(Wishlist);

    async save(wishlist: Wishlist): Promise<Wishlist> {
        return await this.repository.save(wishlist);
    }

    async findByUserAndProduct(userId: number, productId: number): Promise<Wishlist | undefined> {
        const wishlist = await this.repository.findOne({
            where: { userId, productId },
            relations: ["product"],
        });
        return wishlist || undefined;
    }

    async findByLeadAndProduct(leadId: number, productId: number): Promise<Wishlist | undefined> {
        const wishlist = await this.repository.findOne({
            where: { leadId, productId },
            relations: ["product"],
        });
        return wishlist || undefined;
    }

    async findByUserId(userId: number): Promise<Wishlist[]> {
        return await this.repository.find({
            where: { userId },
            relations: ["product"],
            order: { createdAt: "DESC" },
        });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
