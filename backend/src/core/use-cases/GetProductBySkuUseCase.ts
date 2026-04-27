import { IProductRepository } from "../interfaces/IProductRepository";
import { Product } from "../domain/Product";
import { logger } from "../../infrastructure/logger/logger";

export class GetProductBySkuUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(sku: string): Promise<Product | null> {
        const product = await this.productRepository.findBySku(sku);
        
        if (!product) {
            logger.warn(`Tentativa de busca por SKU inexistente: ${sku}`);
        }
        
        return product;
    }
}