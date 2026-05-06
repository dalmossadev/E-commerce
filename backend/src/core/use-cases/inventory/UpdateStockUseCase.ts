import { IProductRepository } from "@core/interfaces/IProductRepository";
import { ProductVariant } from "@core/domain/ProductVariant";

export class UpdateStockUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(variantId: number, quantity: number): Promise<ProductVariant> {
    const variant = await this.productRepository.findVariantById(variantId);
    if (!variant) throw new Error("Variante não encontrada");

    variant.stock = quantity;
    return await this.productRepository.updateVariant(variant);
  }
}
