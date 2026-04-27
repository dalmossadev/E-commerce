import { Order, OrderStatus } from '@core/domain/Order';

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | undefined>;
  findAll(status?: OrderStatus, customerId?: number): Promise<Order[]>;
  update(order: Order): Promise<Order>;
  delete(id: number): Promise<void>;
  findByCustomerId(customerId: number): Promise<Order[]>;
}