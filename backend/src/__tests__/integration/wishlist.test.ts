import request from 'supertest';
import express, { Application } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { wishlistRouter } from '@adapters/http/routes/wishlist.routes';
import { AppDataSource } from '@infrastructure/database/data-source';
import { Wishlist } from '@core/domain/Wishlist';
import { User } from '@core/domain/User';
import { AuthService } from '@infrastructure/auth/AuthService';
import bcrypt from 'bcryptjs';

describe('Wishlist API Integration', () => {
  let app: Application;
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    app = express();
    app.use(require('cookie-parser')());
    app.use(express.json());
    app.use('/api/v1/wishlist', wishlistRouter);
    app.use(errorHandler);

    testUser = await AppDataSource.getRepository(User).save({
      name: 'Wishlist Test User',
      email: `wishlist_test_${Date.now()}@example.com`,
      password: await bcrypt.hash('password123', 10),
      role: 'CUSTOMER' as any
    });

    const authService = new AuthService();
    const tokens = authService.generateTokens({ id: testUser.id, email: testUser.email, role: testUser.role });
    authToken = tokens.accessToken;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    await AppDataSource.getRepository(Wishlist).clear();
  });

  it('should add product to wishlist with POST', async () => {
    const response = await request(app)
      .post('/api/v1/wishlist')
      .set('Cookie', [`__session=${authToken}`])
      .send({ productId: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('productId', 1);
  });

  it('should return wishlist items with GET', async () => {
    await AppDataSource.getRepository(Wishlist).save([
      { userId: testUser.id, productId: 1 },
      { userId: testUser.id, productId: 2 }
    ]);

    const response = await request(app)
      .get('/api/v1/wishlist')
      .set('Cookie', [`__session=${authToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should remove product from wishlist with DELETE', async () => {
    await AppDataSource.getRepository(Wishlist).save({
      userId: testUser.id,
      productId: 1
    });

    const response = await request(app)
      .delete('/api/v1/wishlist')
      .set('Cookie', [`__session=${authToken}`])
      .send({ productId: 1 });

    expect(response.status).toBe(204);

    const items = await AppDataSource.getRepository(Wishlist).find({
      where: { userId: testUser.id }
    });
    expect(items).toHaveLength(0);
  });

  it('should return 401 without auth', async () => {
    const response = await request(app)
      .post('/api/v1/wishlist')
      .send({ productId: 1 });

    expect(response.status).toBe(401);
  });
});
