import { Order } from '../../domain/Order';
import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { IProductRepository } from '../../interfaces/IProductRepository';
import { NotFoundError } from '../../errors/CustomErrors';
import { FulfillmentType } from '../../domain/ProductVariant';

export class CancelOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository?: IProductRepository
  ) {}

  async execute(id: number): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }

    order.cancel();

    if (this.productRepository) {
      for (const item of order.items) {
        if (item.fulfillmentType !== FulfillmentType.IN_STOCK) {
          continue;
        }

        const variant = await this.productRepository.findVariantById(item.variantId);
        if (variant) {
          variant.increaseStock(item.quantity);
          await this.productRepository.updateVariant(variant);
        }
      }
    }

    return await this.orderRepository.update(order);
  }
}
