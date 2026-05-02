import request from 'supertest';
import express, { Application } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { leadRouter } from '@adapters/http/routes/lead.routes';
import { AppDataSource } from '@infrastructure/database/data-source';

describe('POST /api/v1/leads - validation', () => {
  let app: Application;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    app = express();
    app.use(express.json());
    app.use('/api/v1/leads', leadRouter);
    app.use(errorHandler);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('when request body is invalid', () => {
    it('should return 400 when sku and productId are missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ customerName: 'John', customerPhone: '+5511999999999' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('É obrigatório informar um Produto válido');
    });

    it('should return 400 when customerName is missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ sku: 'SKU-123', customerPhone: '+5511999999999' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
    });

    it('should return 400 when customerPhone is missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ sku: 'SKU-123', customerName: 'John' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
    });

    it('should return 400 when sku is empty and productId is missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ sku: '', customerName: 'John', customerPhone: '+5511999999999' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('É obrigatório informar um Produto válido');
    });

    it('should return 400 when customerName is empty', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ sku: 'SKU-123', customerName: '', customerPhone: '+5511999999999' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
    });

    it('should return 400 when customerPhone is empty', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ sku: 'SKU-123', customerName: 'John', customerPhone: '' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({}));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
      expect(response.body.errors).toHaveLength(2);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          sku: 'SKU-123',
          customerName: 'John',
          customerPhone: '+5511999999999',
          customerEmail: 'invalid-email'
        }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
    });
  });
});
