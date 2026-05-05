import { Request, Response, NextFunction } from 'express';
import { CreateOrderUseCase, UpdateOrderStatusUseCase, CancelOrderUseCase, ListOrdersUseCase, GetOrderByIdUseCase } from '@core/use-cases/orders/OrderUseCases';
import { ConfirmPaymentUseCase } from '@core/use-cases/orders/ConfirmPaymentUseCase';
import { GetOrderPixUseCase } from '@core/use-cases/orders/GetOrderPixUseCase';
import { CreateOrderDTO, UpdateOrderStatusDTO } from '@core/dto/OrderDTO';
import { OrderStatus, PaymentMethod } from '@core/domain/Order';
import { DiscountService } from '@core/domain/services/DiscountService';
import { container } from '@core/container/Container';
import { createOrderSchema, updateOrderStatusSchema, applyDiscountSchema } from '../validations/order.validation';
import { FulfillmentType } from '@core/domain/ProductVariant';
import { BadRequestError } from '@core/errors/CustomErrors';
import { authService } from '@infrastructure/auth/AuthService';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class OrderController {
  private createOrderUseCase: CreateOrderUseCase;
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  private cancelOrderUseCase: CancelOrderUseCase;
  private listOrdersUseCase: ListOrdersUseCase;
  private getOrderByIdUseCase: GetOrderByIdUseCase;
  private confirmPaymentUseCase: ConfirmPaymentUseCase;
  private getOrderPixUseCase: GetOrderPixUseCase;
  private discountService?: DiscountService;

  constructor() {
    this.createOrderUseCase = container.createOrderUseCase();
    this.updateOrderStatusUseCase = container.updateOrderStatusUseCase();
    this.cancelOrderUseCase = container.cancelOrderUseCase();
    this.listOrdersUseCase = container.listOrdersUseCase();
    this.getOrderByIdUseCase = container.getOrderByIdUseCase();
    this.confirmPaymentUseCase = container.confirmPaymentUseCase();
    this.getOrderPixUseCase = container.getOrderPixUseCase();
  }

  private getDiscountService(): DiscountService {
    if (!this.discountService) {
      this.discountService = container.discountService();
    }
    return this.discountService;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawData = createOrderSchema.parse(req.body);

      const itemsWithPrices = await Promise.all(
        rawData.items.map(async (item: any) => {
          const productRepo = container.productRepository();
          const variant = await productRepo.findVariantById(item.variantId);

          if (!variant) {
            throw new BadRequestError(`Variant ${item.variantId} not found`);
          }

          if (variant.fulfillmentType === FulfillmentType.IN_STOCK && variant.stock < item.quantity) {
            throw new BadRequestError(`Insufficient stock for SKU ${item.sku}. Available: ${variant.stock}`);
          }

          if (variant.fulfillmentType === FulfillmentType.IN_STOCK) {
            variant.decreaseStock(item.quantity);
            await productRepo.updateVariant(variant);
          }

          return {
            variantId: item.variantId,
            sku: item.sku,
            productName: item.productName,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            fulfillmentType: variant.fulfillmentType
          };
        })
      );

      const data: CreateOrderDTO = {
        ...rawData,
        items: itemsWithPrices
      };

      const user = (req as any).user;
      const order = await this.createOrderUseCase.execute(
        data,
        user?.id,
        req.ip,
        req.get('user-agent')
      );
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as OrderStatus | undefined;
      const customerId = req.query.customerId ? parseInt(req.query.customerId as string, 10) : undefined;
      const orders = await this.listOrdersUseCase.execute(status, customerId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      const order = await this.getOrderByIdUseCase.execute(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      const data = updateOrderStatusSchema.parse(req.body) as UpdateOrderStatusDTO;
      const order = await this.updateOrderStatusUseCase.execute(id, data.status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      const order = await this.cancelOrderUseCase.execute(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async applyDiscount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }
      const data = applyDiscountSchema.parse(req.body);
      const order = await this.getOrderByIdUseCase.execute(id);

      const oldDiscount = order.discount;
      order.applyDiscount(data.discountAmount);

      if (oldDiscount !== order.discount) {
        const discountService = this.getDiscountService();
        const user = (req as any).user;
        const discountPercent = order.subtotal > 0 ? Math.round(order.discount / order.subtotal * 100) : 0;

        await discountService.applyDiscountWithAudit({
          orderId: order.id,
          subtotalInCents: order.subtotal,
          discountInCents: order.discount,
          discountPercent,
          source: 'manual',
          userId: user?.id,
          ip: req.ip,
          userAgent: req.get('user-agent')
        });
      }

      const orderRepo = container.orderRepository();
      await orderRepo.update(order);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async refreshSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }

      const order = await this.getOrderByIdUseCase.execute(id);
      if (!order || order.status !== OrderStatus.PENDING) {
        throw new BadRequestError('Cannot refresh session for non-pending order');
      }

      const user = (req as any).user;
      const tokens = authService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.json({
        orderId: order.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      });
    } catch (error) {
      next(error);
    }
  }

  async getPix(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }

      const result = await this.getOrderPixUseCase.execute(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
      }

      const user = (req as any).user;
      
      const order = await this.confirmPaymentUseCase.execute(
        id, 
        user?.id, 
        req.ip, 
        req.get('user-agent')
      );
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
}