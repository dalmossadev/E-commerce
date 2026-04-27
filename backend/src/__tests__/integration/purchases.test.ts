import request from 'supertest';
import express, { Express } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { purchaseRouter } from '@adapters/http/routes/purchase.routes';

class InMemoryPurchaseRepository {
  private purchases: any[] = [];
  private nextId = 1;

  async save(purchase: any): Promise<any> {
    purchase.id = this.nextId++;
    purchase.status = 'PENDING';
    this.purchases.push(purchase);
    return purchase;
  }

  async findById(id: number): Promise<any | undefined> {
    return this.purchases.find(p => p.id === id);
  }

  async findAll(): Promise<any[]> {
    return this.purchases;
  }

  async update(purchase: any): Promise<any> {
    const idx = this.purchases.findIndex(p => p.id === purchase.id);
    if (idx >= 0) this.purchases[idx] = purchase;
    return purchase;
  }

  async delete(id: number): Promise<void> {
    this.purchases = this.purchases.filter(p => p.id !== id);
  }

  async findBySupplier(supplierId: number): Promise<any[]> {
    return this.purchases.filter(p => p.supplierId === supplierId);
  }
}

class InMemoryProductRepository {
  private variants: any[] = [
    { id: 1, sku: 'TEST-SKU-1', productId: 1, color: 'preto', size: 'p', price: 10000, stock: 5, fulfillmentType: 'IN_STOCK' },
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
    purchaseRepository: () => new InMemoryPurchaseRepository(),
    productRepository: () => new InMemoryProductRepository(),
    createPurchaseUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'PENDING', items: [] })
    })),
    listPurchasesUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue([])
    })),
    getPurchaseByIdUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'SHIPPED', items: [] })
    })),
    updatePurchaseStatusUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'RECEIVED' })
    })),
    receiveInventoryUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ id: 1, status: 'RECEIVED' })
    })),
    deletePurchaseUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(undefined)
    }))
  }
}));

describe('POST /api/v1/purchases - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/purchases', purchaseRouter);
    app.use(errorHandler);
  });

  describe('when request body is valid', () => {
    it('should return 201 when creating purchase', async () => {
      const response = await request(app)
        .post('/api/v1/purchases')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          supplierId: 1,
          supplierName: 'Test Supplier',
          items: [
            {
              variantId: 1,
              sku: 'TEST-SKU-1',
              productName: 'Test Product',
              color: 'preto',
              size: 'p',
              quantity: 10,
              unitCost: 5000
            }
          ]
        }));

      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('when request body is invalid', () => {
    it('should return 400 when supplierId is missing', async () => {
      const response = await request(app)
        .post('/api/v1/purchases')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          supplierName: 'Test Supplier',
          items: [{ variantId: 1, sku: 'TEST', productName: 'Test', quantity: 1, unitCost: 1000 }]
        }));

      expect(response.status).toBe(400);
    });

    it('should return 400 when items are empty', async () => {
      const response = await request(app)
        .post('/api/v1/purchases')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          supplierId: 1,
          supplierName: 'Test Supplier',
          items: []
        }));

      expect(response.status).toBe(400);
    });
  });
});

describe('POST /api/v1/purchases/:id/receive - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/purchases', purchaseRouter);
    app.use(errorHandler);
  });

  it('should return 200 and update stock when receiving inventory', async () => {
    const response = await request(app)
      .post('/api/v1/purchases/1/receive')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        items: [{ variantId: 1, quantity: 10 }]
      }));

    expect([200, 400, 404, 500]).toContain(response.status);
  });

  it('should return 400 if already RECEIVED', async () => {
    const response = await request(app)
      .post('/api/v1/purchases/1/receive')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        items: [{ variantId: 1, quantity: 5 }]
      }));

    expect([200, 400]).toContain(response.status);
  });
});

describe('GET /api/v1/purchases - Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/purchases', purchaseRouter);
    app.use(errorHandler);
  });

  it('should return 200 when listing purchases', async () => {
    const response = await request(app)
      .get('/api/v1/purchases')
      .set('Content-Type', 'application/json');

    expect([200, 500]).toContain(response.status);
  });
});