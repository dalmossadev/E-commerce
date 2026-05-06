import { IProductRepository } from "@core/interfaces/IProductRepository";
import { Product } from "@core/domain/Product";
import { logger } from "@infrastructure/logger/logger";

export class GetProductBySkuUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(sku: string): Promise<Product | null> {
        const product = await this.productRepository.findBySku(sku);
        
        if (!product) {
            logger.warn(`Tentativa de busca por SKU inexistente: ${sku}`);
            return null;
        }

        // imageUrl será construído no frontend usando imageName
        return product;
    }
}