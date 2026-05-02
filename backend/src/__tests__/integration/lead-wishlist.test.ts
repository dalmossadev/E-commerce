import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { leadRouter } from '@adapters/http/routes/lead.routes';
import { AppDataSource } from '@infrastructure/database/data-source';
import { Wishlist } from '@core/domain/Wishlist';
import { User } from '@core/domain/User';

describe('POST /api/v1/leads - Wishlist Integration', () => {
  let app: Application;
  let testUser: User;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    app = express();
    app.use(express.json());

    // Middleware que simula autenticação via cookie
    app.use((req: Request, res: Response, next: NextFunction) => {
      const cookie = req.headers.cookie;
      if (cookie && cookie.includes('__session')) {
        const match = cookie.match(/__session=mock_token_for_user_(\d+)/);
        if (match) {
          (req as any).user = { sub: parseInt(match[1]) };
        }
      }
      next();
    });

    app.use('/api/v1/leads', leadRouter);
    app.use(errorHandler);

    testUser = await AppDataSource.getRepository(User).save({
      name: 'Test User',
      email: `test_wl_${Date.now()}@example.com`,
      password: 'hashed',
      role: 'CUSTOMER' as any
    });
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('should add product to wishlist when productId is provided and user is authenticated', async () => {
    const leadData = {
      sku: 'TEST-SKU',
      customerName: 'John Doe',
      customerPhone: '+5511999999999',
      productId: 1
    };

    const response = await request(app)
      .post('/api/v1/leads')
      .set('Content-Type', 'application/json')
      .set('Cookie', [`__session=mock_token_for_user_${testUser.id}`])
      .send(JSON.stringify(leadData));

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('productId', 1);

    const wishlistRepo = AppDataSource.getRepository(Wishlist);
    const wishlistItems = await wishlistRepo.find({ where: { userId: testUser.id } });
    expect(wishlistItems.length).toBeGreaterThan(0);
  });
});
