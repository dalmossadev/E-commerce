import { Order, OrderStatus, PaymentMethod } from '@core/domain/Order';
import { OrderItem } from '@core/domain/Order';
import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { DiscountService } from '@core/domain/services/DiscountService';
import { IPaymentProvider } from '@core/interfaces/IPaymentProvider';
import { CreateOrderDTO, CreateOrderItemDTO } from '@core/dto/OrderDTO';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';
import { ProductVariant, FulfillmentType } from '@core/domain/ProductVariant';

interface IOrderValidator {
  validate(data: CreateOrderDTO): void;
}

interface IOrderFactory {
  create(data: CreateOrderDTO): Order;
}

class OrderValidator implements IOrderValidator {
  validate(data: CreateOrderDTO): void {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Order must have at least one item');
    }
    if (!data.customerName?.trim()) {
      throw new BadRequestError('Customer name is required');
    }
    if (!data.customerEmail?.trim()) {
      throw new BadRequestError('Customer email is required');
    }
    if (!data.customerPhone?.trim()) {
      throw new BadRequestError('Customer phone is required');
    }
  }
}

class OrderFactory implements IOrderFactory {
  create(data: CreateOrderDTO): Order {
    const order = new Order();
    order.customerId = data.customerId;
    order.customerName = data.customerName!.trim();
    order.customerEmail = data.customerEmail!.trim();
    order.customerPhone = data.customerPhone!.trim();
    order.shippingAddress = data.shippingAddress?.trim();
    order.paymentMethod = data.paymentMethod;
    order.notes = data.notes?.trim();
    order.status = OrderStatus.PENDING;

    const items = data.items!.map(itemData => {
      const item = new OrderItem();
      item.variantId = itemData.variantId;
      item.sku = itemData.sku;
      item.productName = itemData.productName;
      item.color = itemData.color;
      item.size = itemData.size;
      item.quantity = itemData.quantity;
      item.unitPrice = itemData.unitPrice;
      item.fulfillmentType = itemData.fulfillmentType;
      item.totalPrice = itemData.quantity * itemData.unitPrice;
      return item;
    });

    order.items = items;
    order.calculateTotal();
    return order;
  }
}

export class CreateOrderUseCase {
  private validator: IOrderValidator;
  private factory: IOrderFactory;

  constructor(
    private orderRepository: IOrderRepository,
    private productRepository?: IProductRepository,
    private discountService?: DiscountService,
    private paymentProvider?: IPaymentProvider
  ) {
    this.validator = new OrderValidator();
    this.factory = new OrderFactory();
  }

  async execute(data: CreateOrderDTO, userId?: number, ip?: string, userAgent?: string): Promise<any> {
    this.validator.validate(data);
    await this.validateStock(data.items!);

    const order = this.factory.create(data);

    const oldDiscount = order.discount;
    order.calculateProgressiveDiscount(this.discountService);

    if (this.discountService && order.discount > oldDiscount && order.discountSource === 'progressive') {
      const discountPercent = Math.round(order.discount / order.subtotal * 100);
      await this.discountService.applyDiscountWithAudit({
        orderId: order.id || 0,
        subtotalInCents: order.subtotal,
        discountInCents: order.discount,
        discountPercent,
        source: 'progressive',
        userId,
        ip,
        userAgent
      });
    }

    const savedOrder = await this.orderRepository.save(order);

    let qrCodePayload: string | undefined;
    let qrCodeBase64: string | undefined;

    if (this.paymentProvider && savedOrder.paymentMethod === PaymentMethod.PIX) {
      try {
        const charge = await this.paymentProvider.generateCharge(
          savedOrder.id.toString(),
          savedOrder.total,
          `Pedido #${savedOrder.id} - Sisters Lab`
        );
        savedOrder.paymentProvider = 'infinitepay';
        savedOrder.paymentExternalId = charge.externalId;
        savedOrder.paymentStatus = 'PENDING';
        savedOrder.paymentQrCode = charge.qrCodePayload; // Saving raw payload to DB
        await this.orderRepository.update(savedOrder);
        
        qrCodePayload = charge.qrCodePayload;
        qrCodeBase64 = charge.qrCodeBase64;
      } catch (error) {
        console.error('Failed to generate PIX charge during order creation:', error);
      }
    }

    return {
      ...savedOrder,
      qrCodePayload,
      qrCodeBase64
    };
  }

  private async validateStock(items: CreateOrderItemDTO[]): Promise<void> {
    if (!this.productRepository) {
      return;
    }

    for (const item of items) {
      const variant = await this.productRepository.findVariantById(item.variantId);
      if (!variant) {
        throw new NotFoundError('ProductVariant', item.variantId);
      }

      if (variant.fulfillmentType === FulfillmentType.IN_STOCK && variant.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for SKU ${item.sku}. Available: ${variant.stock}`);
      }
    }
  }
}

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

export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(status?: OrderStatus, customerId?: number): Promise<Order[]> {
    return await this.orderRepository.findAll(status, customerId);
  }
}

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
