import { Order, OrderStatus, PaymentMethod } from '../../domain/Order';
import { OrderItem } from '../../domain/Order';
import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { IProductRepository } from '../../interfaces/IProductRepository';
import { DiscountService } from '../../domain/services/DiscountService';
import { IPaymentProvider } from '../../interfaces/IPaymentProvider';
import { ICouponRepository } from '../../interfaces/ICouponRepository';
import { IShippingRuleRepository } from '../../interfaces/IShippingRuleRepository';
import { CreateOrderDTO, CreateOrderItemDTO } from '../../dto/OrderDTO';
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors';
import { ProductVariant, FulfillmentType } from '../../domain/ProductVariant';
import { PixService } from '../../../infrastructure/pix/PixService';

export interface IOrderValidator {
  validate(data: CreateOrderDTO): void;
}

export interface IOrderFactory {
  create(data: CreateOrderDTO): Order;
}

export class OrderValidator implements IOrderValidator {
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

export class OrderFactory implements IOrderFactory {
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
  constructor(
    private orderRepository: IOrderRepository,
    private validator: IOrderValidator,
    private factory: IOrderFactory,
    private productRepository?: IProductRepository,
    private discountService?: DiscountService,
    private paymentProvider?: IPaymentProvider,
    private couponRepository?: ICouponRepository,
    private shippingRepository?: IShippingRuleRepository
  ) {}

  async execute(data: CreateOrderDTO, userId?: number, ip?: string, userAgent?: string): Promise<any> {
    this.validator.validate(data);
    await this.validateStock(data.items!);

    const order = this.factory.create(data);

    // 1. Desconto Progressivo
    order.calculateProgressiveDiscount(this.discountService);

    // 2. Cupom de Desconto
    if (data.couponCode && this.couponRepository) {
      const coupon = await this.couponRepository.findByCode(data.couponCode);
      if (coupon && coupon.isValid(order.subtotal)) {
        order.couponCode = coupon.code;
        order.couponDiscount = coupon.calculateDiscount(order.subtotal);
        order.discount += order.couponDiscount;
        order.discountSource = order.discountSource === 'none' ? 'coupon' : 'mixed';
        await this.couponRepository.incrementUses(coupon.id!);
      }
    }

    // 3. Frete
    if (data.zipCode && this.shippingRepository) {
      const shippingRule = await this.shippingRepository.findByZipCode(data.zipCode);
      if (shippingRule) {
        order.shippingCost = shippingRule.calculatePrice(order.subtotal);
      }
    }

    order.calculateTotal();

    if (this.discountService && order.discount > 0) {
      const discountPercent = Math.round(order.discount / order.subtotal * 100);
      await this.discountService.applyDiscountWithAudit({
        orderId: order.id || 0,
        subtotalInCents: order.subtotal,
        discountInCents: order.discount,
        discountPercent,
        source: order.discountSource,
        userId,
        ip,
        userAgent
      });
    }

    const savedOrder = await this.orderRepository.save(order);

    let qrCodePayload: string | undefined;
    let qrCodeBase64: string | undefined;

    if (savedOrder.paymentMethod === PaymentMethod.PIX) {
      // 1. Try InfinitePay (Real-time dynamic PIX)
      if (this.paymentProvider) {
        try {
          const charge = await this.paymentProvider.generateCharge(
            savedOrder.id.toString(),
            savedOrder.total,
            `Pedido #${savedOrder.id} - Sisters Lab`
          );
          savedOrder.paymentProvider = 'infinitepay';
          savedOrder.paymentExternalId = charge.externalId;
          savedOrder.paymentStatus = 'PENDING';
          savedOrder.paymentQrCode = charge.qrCodePayload; 
          await this.orderRepository.update(savedOrder);
          
          qrCodePayload = charge.qrCodePayload;
          qrCodeBase64 = charge.qrCodeBase64;
        } catch (error) {
          console.error('Failed to generate InfinitePay PIX charge:', error);
          // Fallback to manual PIX below
        }
      }

      // 2. Fallback to Manual PIX if InfinitePay failed or was not configured
      if (!qrCodePayload) {
        try {
          qrCodePayload = PixService.generatePixPayload({
            key: process.env.PIX_KEY || '',
            name: process.env.PIX_NAME || 'Sisters Lab',
            city: process.env.PIX_CITY || 'SALVADOR',
            amount: savedOrder.total,
            orderId: savedOrder.id
          });
          qrCodeBase64 = await PixService.generatePixQRCode(qrCodePayload);
          
          savedOrder.paymentProvider = 'manual';
          savedOrder.paymentStatus = 'PENDING';
          savedOrder.paymentQrCode = qrCodePayload;
          await this.orderRepository.update(savedOrder);
        } catch (error) {
          console.error('Failed to generate Manual PIX fallback:', error);
        }
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
