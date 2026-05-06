import { Order } from '../../domain/Order';
import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetOrderByIdUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }
    return order;
  }
}
