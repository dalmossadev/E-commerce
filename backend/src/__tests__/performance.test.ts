import { SkuService } from '@core/domain/services/SkuService';
import { cache } from '@infrastructure/cache/cache';
import { Product } from '@core/domain/Product';
import { ProductVariant } from '@core/domain/ProductVariant';
import { Order, OrderStatus, OrderItem } from '@core/domain/Order';
import { Purchase, PurchaseStatus, PurchaseItem } from '@core/domain/Purchase';

describe('Performance & Cache Tests', () => {
  let skuService: SkuService;

  beforeEach(() => {
    skuService = new SkuService();
    cache.clear();
  });

  afterAll(() => {
    cache.clear();
  });

  describe('SKU Generation Performance', () => {
    it('should generate 1000 SKUs in under 100ms', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        skuService.generate({
          name: 'Tennis Performance',
          brand: 'Nike',
          category: 'esporte' as any,
          color: 'preto',
          size: 'p'
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    it('should generate unique SKUs', () => {
      const skus = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const sku = skuService.generate({
          name: 'Tennis',
          brand: 'Nike',
          category: 'esporte' as any,
          color: 'preto',
          size: 'p',
          uniqueId: `${i}`
        });
        skus.add(sku);
      }

      expect(skus.size).toBe(100);
    });
  });

  describe('Cache Performance', () => {
    it('should cache data and improve retrieval time', () => {
      const testData = { id: 1, name: 'Test Product' };
      
      cache.set('test-key', testData);
      
      const startTime = Date.now();
      const cached = cache.get('test-key');
      const cachedDuration = Date.now() - startTime;

      expect(cached).toEqual(testData);
      expect(cachedDuration).toBeLessThan(5);
    });

    it('should delete cache and return undefined', () => {
      cache.set('test-key', { id: 1 });
      expect(cache.has('test-key')).toBe(true);
      
      cache.delete('test-key');
      expect(cache.has('test-key')).toBe(false);
      expect(cache.get('test-key')).toBeUndefined();
    });

    it('should clear all cache', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      expect(cache.size()).toBe(3);
      
      cache.clear();
      
      expect(cache.size()).toBe(0);
    });

    it('should handle TTL expiration', async () => {
      cache.set('expire-key', 'value', 100);
      
      expect(cache.has('expire-key')).toBe(true);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(cache.has('expire-key')).toBe(false);
    });

    it('should handle large cache operations', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        cache.set(`key-${i}`, { id: i, data: `value-${i}` });
      }
      
      const setDuration = Date.now() - startTime;
      
      const getStartTime = Date.now();
      for (let i = 0; i < 1000; i++) {
        cache.get(`key-${i}`);
      }
      const getDuration = Date.now() - getStartTime;

      expect(setDuration).toBeLessThan(500);
      expect(getDuration).toBeLessThan(100);
      cache.clear();
    });
  });

  describe('Product Entity Performance', () => {
    it('should create product entity efficiently', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const product = new Product();
        product.name = `Product ${i}`;
        product.brand = 'Brand';
        product.category = 'esporte' as any;
        product.basePrice = 1000;
        product.featured = false;
        product.inStock = true;
        
        const variant = new ProductVariant();
        variant.sku = `SKU-${i}`;
        variant.color = 'preto';
        variant.size = 'p';
        variant.price = 1000;
        variant.stock = 10;
        
        product.variants = [variant];
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(200);
    });
  });

  describe('Data Transformation Performance', () => {
    it('should transform product to DTO efficiently', () => {
      const product = new Product();
      product.id = 1;
      product.name = 'Test Product';
      product.brand = 'Nike';
      product.category = 'esporte' as any;
      product.basePrice = 10000;
      product.featured = true;
      product.inStock = true;

      const variants: ProductVariant[] = [];
      for (let i = 0; i < 10; i++) {
        const variant = new ProductVariant();
        variant.sku = `SKU-${i}`;
        variant.color = 'preto';
        variant.size = 'p';
        variant.price = 10000;
        variant.stock = 10;
        variants.push(variant);
      }
      product.variants = variants;

      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        const dto = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          basePrice: product.basePrice,
          featured: product.featured,
          inStock: product.inStock,
          variants: product.variants.map(v => ({
            sku: v.sku,
            color: v.color,
            size: v.size,
            price: v.price,
            stock: v.stock
          }))
        };
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Order Entity Performance', () => {
    it('should create 1000 Order entities in under 100ms', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        const order = new Order({
          customerName: `Customer ${i}`,
          customerEmail: `customer${i}@example.com`,
          customerPhone: '+5511999999999',
          status: OrderStatus.PENDING,
          items: [{
            id: i + 1,
            orderId: i + 1,
            variantId: 1,
            sku: `SKU-${i}`,
            productName: 'Test Product',
            quantity: 1,
            unitPrice: 1000,
            totalPrice: 1000,
            fulfillmentType: 'ON_DEMAND'
          }]
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    it('should call Order.calculateTotal() 1000 times in under 50ms', () => {
      const orders: Order[] = [];
      for (let i = 0; i < 100; i++) {
        orders.push(new Order({
          customerName: `Customer ${i}`,
          customerEmail: `customer${i}@example.com`,
          customerPhone: '+5511999999999',
          status: OrderStatus.PENDING,
          items: [{
            id: i + 1,
            orderId: i + 1,
            variantId: 1,
            sku: `SKU-${i}`,
            productName: 'Test Product',
            quantity: 2,
            unitPrice: 1000,
            totalPrice: 2000,
            fulfillmentType: 'ON_DEMAND'
          }]
        }));
      }

      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        orders[i % 100].calculateTotal();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50);
    });
  });

  describe('Order State Machine Performance', () => {
    it('should perform 1000 Order status transitions in under 50ms', () => {
      const orders: Order[] = [];
      for (let i = 0; i < 100; i++) {
        orders.push(new Order({
          customerName: `Customer ${i}`,
          customerEmail: `customer${i}@example.com`,
          customerPhone: '+5511999999999',
          status: OrderStatus.PENDING,
          items: [{
            id: i + 1,
            orderId: i + 1,
            variantId: 1,
            sku: `SKU-${i}`,
            productName: 'Test Product',
            quantity: 1,
            unitPrice: 1000,
            totalPrice: 1000,
            fulfillmentType: 'ON_DEMAND'
          }]
        }));
      }

      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        const order = orders[i % 100];
        if (order.status === OrderStatus.PENDING) {
          order.transitionTo(OrderStatus.PAID);
        } else if (order.status === OrderStatus.PAID) {
          order.transitionTo(OrderStatus.SHIPPED);
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50);
    });
  });

  describe('Purchase Entity Performance', () => {
    it('should create 1000 Purchase entities in under 100ms', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        const item = new PurchaseItem({
          id: i + 1,
          purchaseId: i + 1,
          variantId: 1,
          sku: `SKU-${i}`,
          productName: 'Test Product',
          quantity: 10,
          unitCost: 500,
          totalCost: 5000
        });

        const purchase = new Purchase({
          supplierId: 1,
          supplierName: `Supplier ${i}`,
          status: PurchaseStatus.PENDING,
          items: [item]
        });
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    it('should call Purchase.calculateTotal() 1000 times in under 50ms', () => {
      const purchases: Purchase[] = [];
      for (let i = 0; i < 100; i++) {
        const item = new PurchaseItem({
          id: i + 1,
          purchaseId: i + 1,
          variantId: 1,
          sku: `SKU-${i}`,
          productName: 'Test Product',
          quantity: 5,
          unitCost: 1000,
          totalCost: 5000
        });

        purchases.push(new Purchase({
          supplierId: 1,
          supplierName: `Supplier ${i}`,
          status: PurchaseStatus.PENDING,
          items: [item]
        }));
      }

      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        purchases[i % 100].calculateTotal();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50);
    });
  });
});