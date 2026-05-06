import { Order, OrderStatus } from '../../domain/Order';
import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }

    order.transitionTo(status);
    return await this.orderRepository.update(order);
  }
}
