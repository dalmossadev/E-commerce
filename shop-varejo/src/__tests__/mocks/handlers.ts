import { rest } from 'msw';

export const handlers = [
  // GET /api/v1/products
  rest.get('/api/v1/products', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            sku: 'TEST-SKU-1',
            name: 'Test Product 1',
            price: 10000,
            color: 'preto',
            size: 'p',
            stock: 10,
            fulfillmentType: 'IN_STOCK'
          },
          {
            sku: 'TEST-SKU-2',
            name: 'Test Product 2',
            price: 15000,
            color: 'branco',
            size: 'm',
            stock: 5,
            fulfillmentType: 'ON_DEMAND'
          }
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      })
    );
  }),

  // GET /api/v1/products/:sku
  rest.get('/api/v1/products/:sku', (req, res, ctx) => {
    const { sku } = req.params;
    return res(
      ctx.json({
        sku,
        name: 'Test Product',
        price: 10000,
        color: 'preto',
        size: 'p',
        stock: 10,
        fulfillmentType: 'IN_STOCK'
      })
    );
  }),

  // POST /api/v1/auth/login
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'CUSTOMER'
        }
      })
    );
  }),

  // POST /api/v1/leads
  rest.post('/api/v1/leads', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        sku: 'TEST-SKU-1',
        customerName: 'John Doe',
        customerPhone: '11999999999',
        status: 'PENDING'
      })
    );
  }),

  // GET /api/v1/orders
  rest.get('/api/v1/orders', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          status: 'PENDING',
          total: 10000
        }
      ])
    );
  })
];
