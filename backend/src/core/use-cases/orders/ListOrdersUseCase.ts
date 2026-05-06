import { Order, OrderStatus } from '../../domain/Order';
import { IOrderRepository } from '../../interfaces/IOrderRepository';

export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(status?: OrderStatus, customerId?: number): Promise<Order[]> {
    return await this.orderRepository.findAll(status, customerId);
  }
}
