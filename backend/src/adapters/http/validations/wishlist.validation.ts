import { z } from "zod";

export const addToWishlistSchema = z.object({
    productId: z.number().int().positive("Product ID must be a positive integer"),
});
