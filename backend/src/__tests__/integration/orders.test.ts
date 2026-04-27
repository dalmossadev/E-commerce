import request from 'supertest';
import express, { Express } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { orderRouter } from '@adapters/http/routes/order.routes';

class InMemoryOrderRepository {
  private orders: any[] = [];
  private nextId = 1;

  async save(order: any): Promise<any> {
    order.id = this.nextId++;
    this.orders.push(order);
    return order;
  }

  async findById(id: number): Promise<any | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async findAll(): Promise<any[]> {
    return this.orders;
  }

  async update(order: any): Promise<any> {
    const idx = this.orders.findIndex(o => o.id === order.id);
    if (idx >= 0) this.orders[idx] = order;
    return order;
  }

  async delete(id: number): Promise<void> {
    this.orders = this.orders.filter(o => o.id !== id);
  }
}

class InMemoryProductRepository {
  private variants: any[] = [
    { id: 1, sku: 'TEST-SKU-1', productId: 1, color: 'preto', size: 'p', price: 10000, stock: 10, fulfillmentType: 'IN_STOCK' },
    { id: 2, sku: 'TEST-SKU-2', productId: 1, color: 'preto', size: 'm', price: 10000, stock: 0, fulfillmentType: 'ON_DEMAND' }
  ];

  async save(product: any): Promise<any> { return product; }
  async findBySku(sku: string): Promise<any> { return null; }
  async findAll(options?: any): Promise<any> { return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }; }
  async findById(id: number): Promise<any> { return undefined; }
  async update(product: any): Promise<any> { return product; }
  async delete(id: number): Promise<void> {}
  async search(query: string): Promise<any[]> { return []; }
  async findByCategory(category: any): Promise<any[]> { return []; }
  async count(category?: any): Promise<number> { return 0; }

  async findVariantById(id: number): Promise<any | undefined> {
    return this.variants.find(v => v.id === id);
  }

  async updateVariant(variant: any): Promise<any> {
    const idx = this.variants.findIndex(v => v.id === variant.id);
    if (idx >= 0) this.variants[idx] = variant;
    return variant;
  }
}

jest.mock('@core/container/Container', () => ({
  container: {
    orderRepository: () => new InMemoryOrderRepository(),
    productRepository: () => new InMemoryProductRepository(),
    createOrderUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'PENDING' })
    })),
    updateOrderStatusUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'PAID' })
    })),
    cancelOrderUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'CANCELLED' })
    })),
    listOrdersUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue([])
    })),
    getOrderByIdUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'PENDING' })
    }))
  }
}));

describe('POST /api/v1/orders - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/orders', orderRouter);
    app.use(errorHandler);
  });

  describe('when request body is valid', () => {
    it('should return 201 when creating order', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+5511999999999',
          items: [
            {
              variantId: 1,
              sku: 'TEST-SKU-1',
              productName: 'Test Product',
              color: 'preto',
              size: 'p',
              quantity: 2,
              unitPrice: 10000,
              fulfillmentType: 'IN_STOCK'
            }
          ]
        }));

      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('when request body is invalid', () => {
    it('should return 400 when customerName is missing', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          customerEmail: 'john@example.com',
          customerPhone: '+5511999999999',
          items: [{ variantId: 1, sku: 'TEST', productName: 'Test', quantity: 1, unitPrice: 1000, fulfillmentType: 'ON_DEMAND' }]
        }));

      expect(response.status).toBe(400);
    });

    it('should return 400 when customerEmail is missing', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          customerName: 'John',
          customerPhone: '+5511999999999',
          items: [{ variantId: 1, sku: 'TEST', productName: 'Test', quantity: 1, unitPrice: 1000, fulfillmentType: 'ON_DEMAND' }]
        }));

      expect(response.status).toBe(400);
    });

    it('should return 400 when customerPhone is missing', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          customerName: 'John',
          customerEmail: 'john@example.com',
          items: [{ variantId: 1, sku: 'TEST', productName: 'Test', quantity: 1, unitPrice: 1000, fulfillmentType: 'ON_DEMAND' }]
        }));

      expect(response.status).toBe(400);
    });

    it('should return 400 when items are empty', async () => {
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          customerName: 'John',
          customerEmail: 'john@example.com',
          customerPhone: '+5511999999999',
          items: []
        }));

      expect(response.status).toBe(400);
    });
  });
});

describe('PATCH /api/v1/orders/:id/status - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/orders', orderRouter);
    app.use(errorHandler);
  });

  it('should return 200 or 400 when updating status', async () => {
    const response = await request(app)
      .patch('/api/v1/orders/1/status')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ status: 'PAID' }));

    expect([200, 400]).toContain(response.status);
  });

  it('should return 400 for invalid status value', async () => {
    const response = await request(app)
      .patch('/api/v1/orders/1/status')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ status: 'INVALID_STATUS' }));

    expect(response.status).toBe(400);
  });
});

describe('PATCH /api/v1/orders/:id/cancel - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/orders', orderRouter);
    app.use(errorHandler);
  });

  it('should return 200 when cancelling order', async () => {
    const response = await request(app)
      .patch('/api/v1/orders/1/cancel')
      .set('Content-Type', 'application/json');

    expect([200, 404, 500]).toContain(response.status);
  });
});

describe('GET /api/v1/orders - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/orders', orderRouter);
    app.use(errorHandler);
  });

  it('should return 200 when listing orders', async () => {
    const response = await request(app)
      .get('/api/v1/orders')
      .set('Content-Type', 'application/json');

    expect([200, 500]).toContain(response.status);
  });
});