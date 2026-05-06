import { IProductRepository, ProductQueryOptions, PaginatedResult } from "@core/interfaces/IProductRepository";
import { Product } from "@core/domain/Product";

export class ListProductsUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(options?: ProductQueryOptions): Promise<PaginatedResult<Product>> {
        return await this.productRepository.findAll(options);
    }
}