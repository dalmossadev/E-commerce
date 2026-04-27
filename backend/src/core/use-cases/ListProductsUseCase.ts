import { IProductRepository, ProductQueryOptions, PaginatedResult } from "../interfaces/IProductRepository";
import { Product } from "../domain/Product";

export class ListProductsUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(options?: ProductQueryOptions): Promise<PaginatedResult<Product>> {
        return await this.productRepository.findAll(options);
    }
}