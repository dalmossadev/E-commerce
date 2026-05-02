import { IProductRepository } from "@core/interfaces/IProductRepository";
import { Product, ProductCategory } from "@core/domain/Product";
import { NotFoundError } from "@core/errors/CustomErrors";

export interface UpdateProductInput {
  name?: string;
  brand?: string;
  category?: ProductCategory;
  basePrice?: number;
  originalPrice?: number | null;
  badge?: string | null;
  description?: string;
  featured?: boolean;
  variants?: Array<{
    sku: string;
    price?: number;
    stock?: number;
  }>;
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(sku: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.productRepository.findBySku(sku);

    if (!product) {
      throw new NotFoundError("Product", sku);
    }

    if (input.name !== undefined) {
      product.name = input.name;
    }

    if (input.brand !== undefined) {
      product.brand = input.brand;
    }

    if (input.category !== undefined) {
      product.updateCategory(input.category);
    }

    if (input.basePrice !== undefined) {
      product.updateBasePrice(input.basePrice);
    }

    if (input.originalPrice !== undefined) {
      if (input.originalPrice === null) {
        product.removeDiscount();
      } else if (input.originalPrice > (product.basePrice ?? 0)) {
        product.applyDiscount(input.originalPrice);
      }
    }

    if (input.badge !== undefined) {
      product.badge = input.badge as any;
    }

    if (input.description !== undefined) {
      product.description = input.description;
    }

    if (input.featured !== undefined) {
      if (input.featured) {
        product.markAsFeatured();
      } else {
        product.unmarkAsFeatured();
      }
    }

    if (input.variants && input.variants.length > 0) {
      for (const variantInput of input.variants) {
        const variant = product.findVariantBySku(variantInput.sku);
        if (variant) {
          if (variantInput.price !== undefined) {
            variant.price = variantInput.price;
          }
          if (variantInput.stock !== undefined) {
            if (variantInput.stock > variant.stock) {
              variant.increaseStock(variantInput.stock - variant.stock);
            } else if (variantInput.stock < variant.stock) {
              variant.decreaseStock(variant.stock - variantInput.stock);
            }
          }
          await this.productRepository.updateVariant(variant);
        }
      }
    }

    return await this.productRepository.update(product);
  }
}