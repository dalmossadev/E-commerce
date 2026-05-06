import { Request, Response, NextFunction } from 'express';
import { CreateOrderUseCase } from '@core/use-cases/orders/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '@core/use-cases/orders/UpdateOrderStatusUseCase';
import { CancelOrderUseCase } from '@core/use-cases/orders/CancelOrderUseCase';
import { ListOrdersUseCase } from '@core/use-cases/orders/ListOrdersUseCase';
import { GetOrderByIdUseCase } from '@core/use-cases/orders/GetOrderByIdUseCase';
import { ConfirmPaymentUseCase } from '@core/use-cases/orders/ConfirmPaymentUseCase';
import { GetOrderPixUseCase } from '@core/use-cases/orders/GetOrderPixUseCase';
import { CreateOrderDTO, UpdateOrderStatusDTO } from '@core/dto/OrderDTO';
import { OrderStatus } from '@core/domain/Order';
import { DiscountService } from '@core/domain/services/DiscountService';
import { createOrderSchema, updateOrderStatusSchema, applyDiscountSchema } from '../validations/order.validation';
import { FulfillmentType } from '@core/domain/ProductVariant';
import { BadRequestError } from '@core/errors/CustomErrors';
import { authService } from '@infrastructure/auth/AuthService';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { IOrderRepository } from '@core/interfaces/IOrderRepository';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private cancelOrderUseCase: CancelOrderUseCase,
    private listOrdersUseCase: ListOrdersUseCase,
    private getOrderByIdUseCase: GetOrderByIdUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
    private getOrderPixUseCase: GetOrderPixUseCase,
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
    private discountService: DiscountService
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawData = createOrderSchema.parse(req.body);

      const itemsWithPrices = await Promise.all(
        rawData.items.map(async (item: any) => {
          const variant = await this.productRepository.findVariantById(item.variantId);

          if (!variant) {
            throw new BadRequestError(`Variant ${item.variantId} not found`);
          }

          if (variant.fulfillmentType === FulfillmentType.IN_STOCK && variant.stock < item.quantity) {
            throw new BadRequestError(`Insufficient stock for SKU ${item.sku}. Available: ${variant.stock}`);
          }

          if (variant.fulfillmentType === FulfillmentType.IN_STOCK) {
            variant.decreaseStock(item.quantity);
            await this.productRepository.updateVariant(variant);
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
        const user = (req as any).user;
        const discountPercent = order.subtotal > 0 ? Math.round(order.discount / order.subtotal * 100) : 0;

        await this.discountService.applyDiscountWithAudit({
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

      await this.orderRepository.update(order);
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