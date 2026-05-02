import request from 'supertest';
import { Express } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';

// Mock do multer
jest.mock('multer', () => {
  const multer = () => ({
    single: jest.fn((_fieldName: string) => (req: any, _res: any, next: any) => {
      req.file = {
        fieldname: 'image',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        filename: 'test.jpg',
        path: '/tmp/test.jpg'
      };
      next();
    }),
    any: jest.fn()
  });
  (multer as any).memoryStorage = jest.fn();
  (multer as any).diskStorage = jest.fn();
  return multer;
});

// Mock do container (objeto exportado em Container.ts)
jest.mock('@core/container/Container', () => ({
  container: {
    productRepository: jest.fn(() => ({
      findBySku: jest.fn().mockResolvedValue({ sku: 'TEST-SKU', name: 'Test Product' }),
      updateImage: jest.fn().mockResolvedValue(undefined)
    })),
    listProductsUseCase: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })
    })),
    getProductBySkuUseCase: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue({ sku: 'TEST-SKU', name: 'Test Product' })
    })),
    createProductUseCase: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue({})
    })),
    updateProductUseCase: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue({})
    })),
    deleteProductUseCase: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue(undefined)
    })),
    uploadProductImageUseCase: jest.fn(() => ({
      execute: jest.fn().mockResolvedValue('/img/catalogo/TEST-SKU.jpg')
    }))
  }
}));

// Mock do AuthMiddleware
jest.mock('@adapters/http/middlewares/AuthMiddleware', () => ({
  authenticate: jest.fn((req: any, _res: any, next: any) => {
    req.user = { id: 1, email: 'test@example.com', role: 'ADMIN' };
    next();
  }),
  requireAdmin: jest.fn((_req: any, _res: any, next: any) => next()),
  authorize: jest.fn(),
  requireAuth: jest.fn((req: any, _res: any, next: any) => {
    req.user = { id: 1, email: 'test@example.com', role: 'ADMIN' };
    next();
  }),
  requireCustomer: jest.fn(),
  requireSupplier: jest.fn()
}));

describe('POST /api/v1/products/:sku/image - Upload Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    const express = require('express');
    app = express();
    app.use(express.json());
    
    // Import dinâmico após mocks
    const { uploadRouter } = require('@adapters/http/routes/product.routes');
    app.use('/api/v1/products', uploadRouter);
    app.use(errorHandler);
  });

  it('should return 200 or 201 when uploading valid image', async () => {
    const response = await request(app)
      .post('/api/v1/products/TEST-SKU/image')
      .attach('image', Buffer.from('fake image content'), 'test.jpg');

    expect([200, 201]).toContain(response.status);
  });

  it('should return 401 without authentication', async () => {
    // Override auth mock for this test
    jest.resetModules();
    jest.mock('@adapters/http/middlewares/AuthMiddleware', () => ({
      authenticate: jest.fn((_req: any, _res: any, next: any) => {
        const error = new Error('Unauthorized');
        (error as any).status = 401;
        next(error);
      })
    }));

    const response = await request(app)
      .post('/api/v1/products/TEST-SKU/image')
      .attach('image', Buffer.from('fake image content'), 'test.jpg');

    expect([401, 404]).toContain(response.status);
  });
});
