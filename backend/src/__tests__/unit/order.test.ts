import { Order, OrderItem, OrderStatus, PaymentMethod } from '@core/domain/Order';
import { FulfillmentType, ProductVariant } from '@core/domain/ProductVariant';

describe('Order Entity Tests', () => {
  describe('OrderStatus', () => {
    it('should have PENDING status', () => {
      expect(OrderStatus.PENDING).toBe('PENDING');
    });

    it('should have PAID status', () => {
      expect(OrderStatus.PAID).toBe('PAID');
    });

    it('should have SHIPPED status', () => {
      expect(OrderStatus.SHIPPED).toBe('SHIPPED');
    });

    it('should have DELIVERED status', () => {
      expect(OrderStatus.DELIVERED).toBe('DELIVERED');
    });

    it('should have CANCELLED status', () => {
      expect(OrderStatus.CANCELLED).toBe('CANCELLED');
    });
  });

  describe('State Machine - Valid Transitions', () => {
    it('should allow PENDING to PAID transition', () => {
      const order = new Order({ status: OrderStatus.PENDING });
      expect(order.canTransitionTo(OrderStatus.PAID)).toBe(true);
    });

    it('should allow PENDING to CANCELLED transition', () => {
      const order = new Order({ status: OrderStatus.PENDING });
      expect(order.canTransitionTo(OrderStatus.CANCELLED)).toBe(true);
    });

    it('should allow PAID to SHIPPED transition', () => {
      const order = new Order({ status: OrderStatus.PAID });
      expect(order.canTransitionTo(OrderStatus.SHIPPED)).toBe(true);
    });

    it('should allow PAID to CANCELLED transition', () => {
      const order = new Order({ status: OrderStatus.PAID });
      expect(order.canTransitionTo(OrderStatus.CANCELLED)).toBe(true);
    });

    it('should allow SHIPPED to DELIVERED transition', () => {
      const order = new Order({ status: OrderStatus.SHIPPED });
      expect(order.canTransitionTo(OrderStatus.DELIVERED)).toBe(true);
    });

    it('should reject PENDING from DELIVERED', () => {
      const order = new Order({ status: OrderStatus.DELIVERED });
      expect(order.canTransitionTo(OrderStatus.PENDING)).toBe(false);
    });

    it('should reject CANCELLED to any transition', () => {
      const order = new Order({ status: OrderStatus.CANCELLED });
      expect(order.canTransitionTo(OrderStatus.PENDING)).toBe(false);
      expect(order.canTransitionTo(OrderStatus.PAID)).toBe(false);
      expect(order.canTransitionTo(OrderStatus.SHIPPED)).toBe(false);
    });
  });

  describe('Order.calculateTotal', () => {
    it('should calculate total from items', () => {
      const items = [
        new OrderItem({ quantity: 2, unitPrice: 1000, totalPrice: 2000 }),
        new OrderItem({ quantity: 1, unitPrice: 500, totalPrice: 500 })
      ];
      const order = new Order({ items, discount: 0 });
      expect(order.subtotal).toBe(2500);
      expect(order.total).toBe(2500);
    });

    it('should apply discount correctly', () => {
      const items = [
        new OrderItem({ quantity: 1, unitPrice: 1000, totalPrice: 1000 })
      ];
      const order = new Order({ items, discount: 200 });
      expect(order.subtotal).toBe(1000);
      expect(order.total).toBe(800);
    });

    it('should not return negative total', () => {
      const items = [
        new OrderItem({ quantity: 1, unitPrice: 100, totalPrice: 100 })
      ];
      const order = new Order({ items, discount: 500 });
      expect(order.total).toBe(0);
    });
  });

  describe('Order.applyDiscount', () => {
    it('should apply valid discount', () => {
      const order = createOrderWithItems(1000);
      order.applyDiscount(100);
      expect(order.discount).toBe(100);
      expect(order.total).toBe(900);
    });

    it('should reject negative discount', () => {
      const order = createOrderWithItems(1000);
      expect(() => order.applyDiscount(-50)).toThrow('Discount cannot be negative');
    });

    it('should reject discount exceeding subtotal', () => {
      const order = createOrderWithItems(500);
      expect(() => order.applyDiscount(600)).toThrow('Discount cannot exceed subtotal');
    });

    it('should allow zero discount', () => {
      const order = createOrderWithItems(500);
      order.applyDiscount(0);
      expect(order.discount).toBe(0);
      expect(order.total).toBe(500);
    });
  });

  describe('OrderItem', () => {
    it('should calculate totalPrice from quantity and unitPrice', () => {
      const item = new OrderItem({ quantity: 3, unitPrice: 1000 });
      expect(item.totalPrice).toBe(3000);
    });

    it('should calculate totalPrice from quantity * unitPrice', () => {
      const item = new OrderItem({ quantity: 3, unitPrice: 1000, totalPrice: 2500 });
      expect(item.totalPrice).toBe(3000);
    });
  });

  describe('Hybrid Stock Logic (IN_STOCK/ON_DEMAND)', () => {
    it('should allow ON_DEMAND without stock check', () => {
      const item = new OrderItem({
        quantity: 10,
        unitPrice: 1000,
        fulfillmentType: FulfillmentType.ON_DEMAND
      });
      expect(item.fulfillmentType).toBe(FulfillmentType.ON_DEMAND);
    });

    it('should include IN_STOCK flag in order', () => {
      const item = new OrderItem({
        quantity: 5,
        unitPrice: 1000,
        fulfillmentType: FulfillmentType.IN_STOCK
      });
      expect(item.fulfillmentType).toBe(FulfillmentType.IN_STOCK);
    });
  });

  describe('Order Status Helpers', () => {
    it('should report isPending correctly', () => {
      const order = new Order({ status: OrderStatus.PENDING });
      expect(order.isPending()).toBe(true);
      expect(order.isPaid()).toBe(false);
    });

    it('should report isCancelled correctly', () => {
      const order = new Order({ status: OrderStatus.CANCELLED });
      expect(order.isCancelled()).toBe(true);
    });

    it('should report isDelivered correctly', () => {
      const order = new Order({ status: OrderStatus.DELIVERED });
      expect(order.isDelivered()).toBe(true);
    });
  });

  describe('Progressive Discounts', () => {
    it('should apply 5% discount for 10+ items', () => {
      const items = [
        new OrderItem({ quantity: 5, unitPrice: 1000, totalPrice: 5000 }),
        new OrderItem({ quantity: 5, unitPrice: 1000, totalPrice: 5000 })
      ];
      const order = new Order({ items, discount: 0 });
      order.calculateProgressiveDiscount();
      expect(order.discount).toBe(500);
      expect(order.discountSource).toBe('progressive');
    });

    it('should apply 10% discount for 20+ items', () => {
      const items = Array(20).fill(null).map(() => new OrderItem({ quantity: 1, unitPrice: 1000, totalPrice: 1000 }));
      const order = new Order({ items, discount: 0 });
      order.calculateProgressiveDiscount();
      expect(order.discount).toBe(20000);
    });

    it('should apply 15% discount for 50+ items', () => {
      const items = Array(50).fill(null).map(() => new OrderItem({ quantity: 1, unitPrice: 1000, totalPrice: 1000 }));
      const order = new Order({ items, discount: 0 });
      order.calculateProgressiveDiscount();
      expect(order.discount).toBe(75000);
    });

    it('should apply 20% discount for 100+ items', () => {
      const items = Array(100).fill(null).map(() => new OrderItem({ quantity: 1, unitPrice: 1000, totalPrice: 1000 }));
      const order = new Order({ items, discount: 0 });
      order.calculateProgressiveDiscount();
      expect(order.discount).toBe(200000);
    });

    it('should not apply progressive discount for less than 10 items', () => {
      const items = [
        new OrderItem({ quantity: 3, unitPrice: 1000, totalPrice: 3000 }),
        new OrderItem({ quantity: 3, unitPrice: 1000, totalPrice: 3000 })
      ];
      const order = new Order({ items, discount: 0 });
      order.calculateProgressiveDiscount();
      expect(order.discount).toBe(0);
    });

    it('should return progressive discount info correctly', () => {
      const items = Array(25).fill(null).map(() => new OrderItem({ quantity: 1, unitPrice: 1000, totalPrice: 1000 }));
      const order = new Order({ items, discount: 0 });
      const info = order.getProgressiveDiscountInfo();
      expect(info).not.toBeNull();
      expect(info?.quantity).toBe(25);
      expect(info?.discountPercent).toBe(10);
    });

    it('should return null when no progressive discount applies', () => {
      const items = [new OrderItem({ quantity: 5, unitPrice: 1000, totalPrice: 5000 })];
      const order = new Order({ items, discount: 0 });
      expect(order.getProgressiveDiscountInfo()).toBeNull();
    });

    it('should preserve manual discount over progressive if greater', () => {
      const items = Array(10).fill(null).map(() => new OrderItem({ quantity: 1, unitPrice: 1000, totalPrice: 1000 }));
      const order = new Order({ items, discount: 2000, discountSource: 'manual' });
      order.calculateProgressiveDiscount();
      expect(order.discount).toBe(2000);
      expect(order.discountSource).toBe('manual');
    });
  });
});

function createOrderWithItems(subtotal: number): Order {
  const item = new OrderItem({ quantity: 1, unitPrice: subtotal, totalPrice: subtotal });
  return new Order({ items: [item], discount: 0 });
}