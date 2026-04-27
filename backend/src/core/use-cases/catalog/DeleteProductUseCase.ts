import { IProductRepository } from "@core/interfaces/IProductRepository";
import { IOrderRepository } from "@core/interfaces/IOrderRepository";
import { NotFoundError, ConflictError } from "@core/errors/CustomErrors";
import { OrderStatus } from "@core/domain/Order";

export class DeleteProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository
  ) {}

  async execute(sku: string): Promise<void> {
    const product = await this.productRepository.findBySku(sku);

    if (!product) {
      throw new NotFoundError("Product", sku);
    }

    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const activeOrders = await this.orderRepository.findAll(
          undefined,
          undefined
        );

        const hasActiveOrders = activeOrders.some(order => 
          order.items.some(item => item.sku === variant.sku) &&
          order.status !== OrderStatus.CANCELLED &&
          order.status !== OrderStatus.DELIVERED
        );

        if (hasActiveOrders) {
          throw new ConflictError(`Product has active orders`);
        }
      }
    }

    await this.productRepository.delete(product.id!);
  }
}