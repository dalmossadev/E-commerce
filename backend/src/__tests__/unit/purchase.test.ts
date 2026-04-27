import { Purchase, PurchaseItem, PurchaseStatus } from '@core/domain/Purchase';

describe('Purchase Entity Tests', () => {
  describe('PurchaseStatus', () => {
    it('should have PENDING status', () => {
      expect(PurchaseStatus.PENDING).toBe('PENDING');
    });

    it('should have ORDERED status', () => {
      expect(PurchaseStatus.ORDERED).toBe('ORDERED');
    });

    it('should have SHIPPED status', () => {
      expect(PurchaseStatus.SHIPPED).toBe('SHIPPED');
    });

    it('should have RECEIVED status', () => {
      expect(PurchaseStatus.RECEIVED).toBe('RECEIVED');
    });

    it('should have CANCELLED status', () => {
      expect(PurchaseStatus.CANCELLED).toBe('CANCELLED');
    });
  });

  describe('Purchase State Machine', () => {
    it('should allow PENDING to ORDERED transition', () => {
      const purchase = new Purchase({ status: PurchaseStatus.PENDING });
      expect(purchase.canTransitionTo(PurchaseStatus.ORDERED)).toBe(true);
    });

    it('should allow PENDING to CANCELLED transition', () => {
      const purchase = new Purchase({ status: PurchaseStatus.PENDING });
      expect(purchase.canTransitionTo(PurchaseStatus.CANCELLED)).toBe(true);
    });

    it('should allow ORDERED to SHIPPED transition', () => {
      const purchase = new Purchase({ status: PurchaseStatus.ORDERED });
      expect(purchase.canTransitionTo(PurchaseStatus.SHIPPED)).toBe(true);
    });

    it('should allow ORDERED to CANCELLED transition', () => {
      const purchase = new Purchase({ status: PurchaseStatus.ORDERED });
      expect(purchase.canTransitionTo(PurchaseStatus.CANCELLED)).toBe(true);
    });

    it('should allow SHIPPED to RECEIVED transition', () => {
      const purchase = new Purchase({ status: PurchaseStatus.SHIPPED });
      expect(purchase.canTransitionTo(PurchaseStatus.RECEIVED)).toBe(true);
    });

    it('should reject RECEIVED from any state', () => {
      const purchase = new Purchase({ status: PurchaseStatus.RECEIVED });
      expect(purchase.canTransitionTo(PurchaseStatus.PENDING)).toBe(false);
      expect(purchase.canTransitionTo(PurchaseStatus.ORDERED)).toBe(false);
      expect(purchase.canTransitionTo(PurchaseStatus.SHIPPED)).toBe(false);
    });

    it('should reject CANCELLED to any transition', () => {
      const purchase = new Purchase({ status: PurchaseStatus.CANCELLED });
      expect(purchase.canTransitionTo(PurchaseStatus.PENDING)).toBe(false);
      expect(purchase.canTransitionTo(PurchaseStatus.ORDERED)).toBe(false);
    });
  });

  describe('Purchase.calculateTotal', () => {
    it('should calculate total from items', () => {
      const items = [
        new PurchaseItem({ quantity: 10, unitCost: 100, totalCost: 1000 }),
        new PurchaseItem({ quantity: 5, unitCost: 200, totalCost: 1000 })
      ];
      const purchase = new Purchase({ items });
      expect(purchase.subtotal).toBe(2000);
      expect(purchase.total).toBe(2000);
    });

    it('should handle zero items', () => {
      const purchase = new Purchase({ items: [] });
      expect(purchase.subtotal).toBe(0);
      expect(purchase.total).toBe(0);
    });
  });

  describe('Purchase.receiveInventory', () => {
    it('should transition to RECEIVED from SHIPPED', () => {
      const purchase = new Purchase({ status: PurchaseStatus.SHIPPED });
      purchase.receiveInventory();
      expect(purchase.status).toBe(PurchaseStatus.RECEIVED);
    });

    it('should throw when not in SHIPPED status', () => {
      const purchase = new Purchase({ status: PurchaseStatus.PENDING });
      expect(() => purchase.receiveInventory()).toThrow('Cannot receive inventory in PENDING status');
    });

    it('should throw when already RECEIVED', () => {
      const purchase = new Purchase({ status: PurchaseStatus.RECEIVED });
      expect(() => purchase.receiveInventory()).toThrow('Cannot receive inventory in RECEIVED status');
    });
  });

  describe('PurchaseItem', () => {
    it('should calculate totalCost from quantity and unitCost', () => {
      const item = new PurchaseItem({ quantity: 5, unitCost: 1000 });
      expect(item.totalCost).toBe(5000);
    });

    it('should update quantity and recalculate totalCost', () => {
      const item = new PurchaseItem({ quantity: 5, unitCost: 1000 });
      item.updateQuantity(10);
      expect(item.quantity).toBe(10);
      expect(item.totalCost).toBe(10000);
    });

    it('should reject non-positive quantity', () => {
      const item = new PurchaseItem({ quantity: 5, unitCost: 1000 });
      expect(() => item.updateQuantity(0)).toThrow('Quantity must be positive');
      expect(() => item.updateQuantity(-1)).toThrow('Quantity must be positive');
    });
  });

  describe('Purchase Status Helpers', () => {
    it('should report isPending correctly', () => {
      const purchase = new Purchase({ status: PurchaseStatus.PENDING });
      expect(purchase.isPending()).toBe(true);
      expect(purchase.isOrdered()).toBe(false);
    });

    it('should report isOrdered correctly', () => {
      const purchase = new Purchase({ status: PurchaseStatus.ORDERED });
      expect(purchase.isOrdered()).toBe(true);
    });

    it('should report isShipped correctly', () => {
      const purchase = new Purchase({ status: PurchaseStatus.SHIPPED });
      expect(purchase.isShipped()).toBe(true);
    });

    it('should report isReceived correctly', () => {
      const purchase = new Purchase({ status: PurchaseStatus.RECEIVED });
      expect(purchase.isReceived()).toBe(true);
    });

    it('should report isCancelled correctly', () => {
      const purchase = new Purchase({ status: PurchaseStatus.CANCELLED });
      expect(purchase.isCancelled()).toBe(true);
    });
  });

  describe('Purchase.markAsOrdered', () => {
    it('should mark as ORDERED from PENDING', () => {
      const purchase = new Purchase({ status: PurchaseStatus.PENDING });
      purchase.markAsOrdered();
      expect(purchase.status).toBe(PurchaseStatus.ORDERED);
    });

    it('should throw when not in PENDING status', () => {
      const purchase = new Purchase({ status: PurchaseStatus.SHIPPED });
      expect(() => purchase.markAsOrdered()).toThrow('Cannot mark purchase as ordered');
    });
  });

  describe('Purchase.markAsShipped', () => {
    it('should mark as SHIPPED with tracking number', () => {
      const purchase = new Purchase({ status: PurchaseStatus.ORDERED });
      purchase.markAsShipped('TRACK123');
      expect(purchase.status).toBe(PurchaseStatus.SHIPPED);
      expect(purchase.trackingNumber).toBe('TRACK123');
    });

    it('should throw when not in ORDERED status', () => {
      const purchase = new Purchase({ status: PurchaseStatus.RECEIVED });
      expect(() => purchase.markAsShipped('TRACK123')).toThrow('Cannot mark purchase as shipped');
    });
  });
});