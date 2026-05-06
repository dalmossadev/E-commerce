import { IProductRepository } from "@core/interfaces/IProductRepository";
import { ProductVariant } from "@core/domain/ProductVariant";

export class ListInventoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<ProductVariant[]> {
    return await this.productRepository.findAllVariants();
  }
}
