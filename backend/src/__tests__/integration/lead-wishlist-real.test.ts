import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { leadRouter } from '@adapters/http/routes/lead.routes';
import { AppDataSource } from '@infrastructure/database/data-source';
import { Wishlist } from '@core/domain/Wishlist';
import { User } from '@core/domain/User';
import { Lead } from '@core/domain/Lead';
import { AuthService } from '@infrastructure/auth/AuthService';
import bcrypt from 'bcryptjs';

describe('Lead → Wishlist Integration - Real Flow', () => {
  let app: Application;
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    app = express();
    app.use(express.json());

    // Middleware que simula autenticação JWT via cookie
    app.use((req: any, res: Response, next: NextFunction) => {
      const cookie = req.headers.cookie;
      if (cookie && cookie.includes('__session')) {
        try {
          const authService = new AuthService();
          const token = cookie.match(/__session=([^;]+)/)?.[1];
          if (token) {
            const payload = authService.verifyAccessToken(token);
            req.user = payload;
          }
        } catch (e) {
          // Token inválido
        }
      }
      next();
    });

    app.use('/api/v1/leads', leadRouter);
    app.use(errorHandler);

    // Cria usuário de teste
    const userRepo = AppDataSource.getRepository(User);
    testUser = await userRepo.save({
      name: 'Wishlist Integration User',
      email: `wishlist_real_${Date.now()}@example.com`,
      password: await bcrypt.hash('password123', 10),
      role: 'CUSTOMER' as any
    });

    // Gera token JWT real
    const authService = new AuthService();
    const tokens = authService.generateTokens({ 
      id: testUser.id, 
      email: testUser.email, 
      role: testUser.role 
    });
    authToken = tokens.accessToken;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    await AppDataSource.query('DELETE FROM wishlists');
    await AppDataSource.query('DELETE FROM leads');
  });

  it('should save Lead AND add product to Wishlist via leadId when unauthenticated', async () => {
    const leadData = {
      sku: 'TEST-SKU-001',
      customerName: 'Anonymous Buyer',
      customerPhone: '+5511999999999',
      productId: 1  // Produto existente no banco
    };

    const response = await request(app)
      .post('/api/v1/leads')
      .send(leadData); // Sem authToken

    // 1. Verifica se o Lead foi criado
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('customerName', 'Anonymous Buyer');
    expect(response.body).toHaveProperty('productId', 1);
    expect(response.body).toHaveProperty('id');

    const leadId = response.body.id;

    // 2. Verifica se o produto foi adicionado à Wishlist com o leadId
    const wishlistRepo = AppDataSource.getRepository(Wishlist);
    const wishlistItems = await wishlistRepo.find({ 
      where: { leadId } 
    });

    console.log('Wishlist items found for lead:', wishlistItems.length);
    expect(wishlistItems.length).toBeGreaterThan(0);
    expect(wishlistItems[0]).toHaveProperty('productId', 1);
    expect(wishlistItems[0]).toHaveProperty('leadId', leadId);
    expect(wishlistItems[0].userId).toBeNull(); // Importante: sem userId
  });

  it('should fail to save Lead when productId and sku are missing or invalid', async () => {
    const leadData = {
      sku: 'INVALID-SKU',
      customerName: 'Anonymous Second',
      customerPhone: '+5511888888888'
    };

    const response = await request(app)
      .post('/api/v1/leads')
      .send(leadData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('É obrigatório informar um Produto válido');
  });


});
