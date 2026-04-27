import request from 'supertest';
import express, { Express } from 'express';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { leadRouter } from '@adapters/http/routes/lead.routes';

describe('POST /api/v1/leads - validation', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/leads', leadRouter);
    app.use(errorHandler);
  });

  describe('when request body is invalid', () => {
    it('should return 400 when sku is missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ customerName: 'John', customerPhone: '+5511999999999' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
      expect(response.body.errors).toBeDefined();
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

    it('should return 400 when sku is empty', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ sku: '', customerName: 'John', customerPhone: '+5511999999999' }));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
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

    it('should return 400 when all fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({}));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'validation_error');
      expect(response.body.errors).toHaveLength(3);
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