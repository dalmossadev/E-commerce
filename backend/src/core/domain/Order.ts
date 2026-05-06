import { DiscountService } from './services/DiscountService';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO'
}

export class OrderItem {
  id!: number;
  orderId!: number;
  order!: any; // Relacionamento com Order
  variantId!: number;
  sku!: string;
  productName!: string;
  color?: string;
  size?: string;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;
  fulfillmentType!: string;

  constructor(props: Partial<OrderItem> = {}) {
    Object.assign(this, props);
    if (props.quantity && props.unitPrice) {
      this.totalPrice = props.quantity * props.unitPrice;
    }
  }
}

export interface ProgressiveDiscountRule {
  minQuantity: number;
  discountPercent: number;
}

export class Order {
  id!: number;
  customerId?: number;
  customerName!: string;
  customerEmail!: string;
  customerPhone!: string;
  shippingAddress?: string;
  items!: OrderItem[];
  subtotal!: number;
  discount!: number;
  discountSource!: 'none' | 'manual' | 'progressive' | 'coupon' | 'mixed';
  couponCode?: string;
  couponDiscount!: number;
  shippingCost!: number;
  total!: number;
  status!: OrderStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  paymentConfirmedAt?: Date;
  paymentProvider?: string;
  paymentExternalId?: string;
  paymentStatus?: string;
  paymentQrCode?: string;
  createdAt!: Date;
  updatedAt!: Date;

  private static readonly PROGRESSIVE_DISCOUNTS: ProgressiveDiscountRule[] = [
    { minQuantity: 10, discountPercent: 5 },
    { minQuantity: 20, discountPercent: 10 },
    { minQuantity: 50, discountPercent: 15 },
    { minQuantity: 100, discountPercent: 20 }
  ];

  private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
  };

  constructor(props: Partial<Order> = {}) {
    Object.assign(this, props);
    this.status = this.status || OrderStatus.PENDING;
    this.discount = this.discount ?? 0;
    this.couponDiscount = this.couponDiscount ?? 0;
    this.shippingCost = this.shippingCost ?? 0;
    this.discountSource = this.discountSource || 'none';
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.subtotal = this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    // O discount aqui representa a soma de todos os descontos (progressivo + cupom)
    this.total = Math.max(0, this.subtotal - this.discount + this.shippingCost);
  }

  calculateProgressiveDiscount(discountService?: DiscountService): number {
    const totalQuantity = this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    if (discountService) {
      const discount = discountService.calculateProgressiveDiscount(totalQuantity, this.subtotal);
      if (discount > this.discount) {
        this.discount = discount;
        this.discountSource = 'progressive';
      }
    } else {
      let progressiveDiscount = 0;
      if (totalQuantity >= 100) {
        progressiveDiscount = Math.floor(this.subtotal * 20 / 10);
      } else if (totalQuantity >= 50) {
        progressiveDiscount = Math.floor(this.subtotal * 15 / 10);
      } else if (totalQuantity >= 20) {
        progressiveDiscount = Math.floor(this.subtotal * 10 / 10);
      } else if (totalQuantity >= 10) {
        progressiveDiscount = Math.floor(this.subtotal * 5 / 100);
      }

      if (progressiveDiscount > this.discount) {
        this.discount = progressiveDiscount;
        this.discountSource = 'progressive';
      }
    }

    this.calculateTotal();
    return this.discount;
  }

  getProgressiveDiscountInfo(discountService?: DiscountService): { quantity: number; discountPercent: number; discountAmount: number } | null {
    const totalQuantity = this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    if (discountService) {
      const discount = discountService.calculateProgressiveDiscount(totalQuantity, this.subtotal);
      if (discount > 0) {
        const percent = Math.round(discount / this.subtotal * 100);
        return { quantity: totalQuantity, discountPercent: percent, discountAmount: discount };
      }
    } else {
      if (totalQuantity >= 100) {
        const discountAmount = Math.floor(this.subtotal * 20 / 10);
        return { quantity: totalQuantity, discountPercent: 20, discountAmount };
      } else if (totalQuantity >= 50) {
        const discountAmount = Math.floor(this.subtotal * 15 / 10);
        return { quantity: totalQuantity, discountPercent: 15, discountAmount };
      } else if (totalQuantity >= 20) {
        const discountAmount = Math.floor(this.subtotal * 10 / 10);
        return { quantity: totalQuantity, discountPercent: 10, discountAmount };
      } else if (totalQuantity >= 10) {
        const discountAmount = Math.floor(this.subtotal * 5 / 100);
        return { quantity: totalQuantity, discountPercent: 5, discountAmount };
      }
    }

    return null;
  }

  applyDiscount(discountAmount: number): void {
    if (discountAmount < 0) {
      throw new Error('Discount cannot be negative');
    }
    if (discountAmount > this.subtotal) {
      throw new Error('Discount cannot exceed subtotal');
    }
    this.discount = discountAmount;
    this.calculateTotal();
  }

  canTransitionTo(newStatus: OrderStatus): boolean {
    const allowedTransitions = Order.VALID_TRANSITIONS[this.status] || [];
    return allowedTransitions.includes(newStatus);
  }

  transitionTo(newStatus: OrderStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (!this.canTransitionTo(OrderStatus.CANCELLED)) {
      throw new Error('Cannot cancel order in current status');
    }
    this.status = OrderStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  markAsPaid(paymentMethod: PaymentMethod): void {
    if (!this.canTransitionTo(OrderStatus.PAID)) {
      throw new Error('Cannot mark order as paid in current status');
    }
    this.paymentMethod = paymentMethod;
    this.status = OrderStatus.PAID;
    this.paymentConfirmedAt = new Date();
    this.updatedAt = new Date();
  }

  markAsShipped(): void {
    if (!this.canTransitionTo(OrderStatus.SHIPPED)) {
      throw new Error('Cannot ship order in current status');
    }
    this.status = OrderStatus.SHIPPED;
    this.updatedAt = new Date();
  }

  markAsDelivered(): void {
    if (!this.canTransitionTo(OrderStatus.DELIVERED)) {
      throw new Error('Cannot deliver order in current status');
    }
    this.status = OrderStatus.DELIVERED;
    this.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  isPaid(): boolean {
    return this.status === OrderStatus.PAID;
  }

  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  isShipped(): boolean {
    return this.status === OrderStatus.SHIPPED;
  }
}