import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Order } from "@core/domain/Order";
import { OrderItem } from "@core/domain/Order";
import { OrderSchema } from "../mappers/OrderSchema";
import { OrderItemSchema } from "../mappers/OrderItemSchema";
import { IOrderRepository } from "@core/interfaces/IOrderRepository";
import { OrderStatus } from "@core/domain/Order";

export class TypeORMOrderRepository implements IOrderRepository {
  private repository: Repository<Order>;
  private itemRepository: Repository<OrderItem>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderSchema);
    this.itemRepository = AppDataSource.getRepository(OrderItemSchema);
  }

  async save(order: Order): Promise<Order> {
    const savedOrder = await this.repository.save(order);
    
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        item.orderId = savedOrder.id;
        await this.itemRepository.save(item);
      }
    }
    
    return this.findById(savedOrder.id) as Promise<Order>;
  }

  async findById(id: number): Promise<Order | undefined> {
    const order = await this.repository.findOne({ 
      where: { id },
      relations: ['items']
    });
    return order || undefined;
  }

  async findAll(status?: OrderStatus, customerId?: number): Promise<Order[]> {
    const queryBuilder = this.repository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    }

    queryBuilder.orderBy('order.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

  async update(order: Order): Promise<Order> {
    await this.repository.save(order);
    
    if (order.items && order.items.length > 0) {
      await this.itemRepository.delete({ orderId: order.id });
      
      for (const item of order.items) {
        item.orderId = order.id;
        await this.itemRepository.save(item);
      }
    }
    
    return this.findById(order.id) as Promise<Order>;
  }

  async delete(id: number): Promise<void> {
    await this.itemRepository.delete({ orderId: id });
    await this.repository.delete(id);
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    return await this.repository.find({ 
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByExternalId(externalId: string): Promise<Order | undefined> {
    const order = await this.repository.findOne({
      where: { paymentExternalId: externalId },
      relations: ['items']
    });
    return order || undefined;
  }
}