import { EntitySchema } from "typeorm";
import { Wishlist } from "../../../core/domain/Wishlist";

export const WishlistSchema = new EntitySchema<Wishlist>({
    name: "Wishlist",
    target: Wishlist,
    tableName: "wishlists",
    columns: {
        id: { type: "int", primary: true, generated: "increment" },
        userId: { type: "int", nullable: true },
        leadId: { type: "int", nullable: true },
        productId: { type: "int" },
        createdAt: { type: "timestamp", createDate: true },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            onDelete: "CASCADE",
            nullable: true,
        },
        lead: {
            type: "many-to-one",
            target: "Lead",
            joinColumn: { name: "leadId" },
            onDelete: "CASCADE",
            nullable: true,
        },
        product: {
            type: "many-to-one",
            target: "Product",
            joinColumn: { name: "productId" },
            onDelete: "CASCADE",
        },
    },
    uniques: [
        {
            name: "unique_user_product",
            columns: ["userId", "productId"],
        },
        {
            name: "unique_lead_product",
            columns: ["leadId", "productId"],
        },
    ],
});
