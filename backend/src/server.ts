// src/server.ts
import 'dotenv/config';
import { logger } from '@infrastructure/logger/logger';
import { requestLogger } from '@adapters/http/middlewares/LogMiddleware';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { defaultRateLimit, authRateLimit } from '@adapters/http/middlewares/RateLimitMiddleware';
import 'reflect-metadata';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializaDatabase } from '@infrastructure/database/server-init';
import { setupSwagger } from '@infrastructure/swagger/swagger';
import { setupUploads } from '@infrastructure/upload/upload';

import { productRouter, API_BASE } from '@adapters/http/routes/product.routes';
import { supplierRouter } from '@adapters/http/routes/supplier.routes';
import { adminRouter } from '@adapters/http/routes/admin.routes';
import { authRouter } from '@adapters/http/routes/auth.routes';
import { userRouter } from '@adapters/http/routes/user.routes';
import { healthRouter } from '@adapters/http/routes/health.routes';
import { leadRouter } from '@adapters/http/routes/lead.routes';
import { orderRouter } from '@adapters/http/routes/order.routes';
import { purchaseRouter } from '@adapters/http/routes/purchase.routes';
import { campaignRouter } from '@adapters/http/routes/campaign.routes';
import { customerRouter } from '@adapters/http/routes/customer.routes';
import { settingsRouter } from '@adapters/http/routes/settings.routes';
import { productHistoryRouter } from '@adapters/http/routes/product-history.routes';
import { regionRouter } from '@adapters/http/routes/region.routes';
import { wishlistRouter } from '@adapters/http/routes/wishlist.routes';
import { categoryRouter } from '@adapters/http/routes/category.routes';
import { bannerRouter } from '@adapters/http/routes/banner.routes';
import { paymentRouter } from '@adapters/http/routes/payment.routes';
import { siteRouter } from '@adapters/http/routes/site.routes';
import { webhookRouter } from '@adapters/http/routes/webhook.routes';
import { devRoutes } from '@adapters/http/routes/dev.routes';
import { financialRouter } from '@adapters/http/routes/financial.routes';
import { addressRouter } from '@adapters/http/routes/address.routes';
import { inventoryRouter } from '@adapters/http/routes/inventory.routes';
import { shippingRouter } from '@adapters/http/routes/shipping.routes';
import { couponRouter } from '@adapters/http/routes/coupon.routes';

const app = express();
app.set('strict routing', false);
const PORT = process.env.PORT || 3001;

process.on('uncaughtException', (err) => {
  if (err.message.includes('EADDRINUSE')) {
    console.error('Port already in use. Kill process and restart.');
    process.exit(1);
  }
});

app.use(cors({
  origin: (origin, callback) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.1.14:3000' // IP do Celular para teste
    ];

    if (!origin || allowedOrigins.includes(origin) || (isDev && origin.startsWith('http://192.168.'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Webhooks must be parsed before express.json() to maintain raw buffers for HMAC validation
app.use(`${API_BASE}/webhooks`, webhookRouter);

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(defaultRateLimit);
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(`${API_BASE}/auth`, authRouter);
app.use(`${API_BASE}/products`, productRouter);
app.use(`${API_BASE}/suppliers`, supplierRouter);
app.use(`${API_BASE}/users`, userRouter);
app.use(`${API_BASE}/leads`, leadRouter);
app.use(`${API_BASE}/orders`, orderRouter);
app.use(`${API_BASE}/purchases`, purchaseRouter);
app.use(`${API_BASE}/campaigns`, campaignRouter);
app.use(`${API_BASE}/customers`, customerRouter);
app.use(`${API_BASE}/settings`, settingsRouter);
app.use(`${API_BASE}/product-history`, productHistoryRouter);
app.use(`${API_BASE}/region`, regionRouter);
app.use(`${API_BASE}/wishlist`, wishlistRouter);
app.use(`${API_BASE}/categories`, categoryRouter);
app.use(`${API_BASE}/admin`, adminRouter);
app.use(`${API_BASE}/banners`, bannerRouter);
app.use(`${API_BASE}/payments`, paymentRouter);
app.use(`${API_BASE}/site`, siteRouter);
app.use(`${API_BASE}/financial`, financialRouter);
app.use(`${API_BASE}/addresses`, addressRouter);
app.use(`${API_BASE}/inventory`, inventoryRouter);
app.use(`${API_BASE}/shipping`, shippingRouter);
app.use(`${API_BASE}/coupons`, couponRouter);
app.use('/api', healthRouter);

if (process.env.NODE_ENV !== 'production') {
  app.use(`${API_BASE}/dev`, devRoutes);
  logger.warn('⚠️  ROTAS DE DESENVOLVIMENTO ATIVAS — desativar em produção');
}

app.use(errorHandler);

setupSwagger(app);
setupUploads(app);

console.log("Rotas disponíveis:");
console.log(`- POST ${API_BASE}/auth/login`);
console.log(`- POST ${API_BASE}/auth/register`);
console.log(`- GET ${API_BASE}/products`);
console.log(`- GET ${API_BASE}/products/:sku`);
console.log(`- POST ${API_BASE}/products`);
console.log(`- GET ${API_BASE}/suppliers`);
console.log(`- POST ${API_BASE}/suppliers`);
console.log(`- GET ${API_BASE}/leads`);
console.log(`- POST ${API_BASE}/leads`);
console.log(`- PATCH ${API_BASE}/leads/:id`);
console.log(`- GET ${API_BASE}/orders`);
console.log(`- POST ${API_BASE}/orders`);
console.log(`- GET ${API_BASE}/purchases`);
console.log(`- POST ${API_BASE}/purchases`);
console.log(`- POST ${API_BASE}/purchases/:id/receive`);
console.log(`- GET ${API_BASE}/users`);
console.log(`- GET ${API_BASE}/admin/dashboard`);
console.log(`- POST ${API_BASE}/products/:sku/image (upload image)`);
console.log(`- GET ${API_BASE}/campaigns`);
console.log(`- POST ${API_BASE}/campaigns`);
console.log(`- GET ${API_BASE}/customers`);
console.log(`- POST ${API_BASE}/customers`);
console.log(`- GET ${API_BASE}/settings`);
console.log(`- POST ${API_BASE}/settings`);
console.log(`- GET ${API_BASE}/settings/site-info`);
console.log(`- PUT ${API_BASE}/settings/site-info`);
console.log(`- GET ${API_BASE}/banners`);
console.log(`- POST ${API_BASE}/banners`);
console.log(`- PUT ${API_BASE}/banners/:id`);
console.log(`- DELITE ${API_BASE}/banners/:id`);
console.log(`- GET ${API_BASE}/product-history`);
console.log(`- GET ${API_BASE}/region/:region`);
console.log(`- GET ${API_BASE}/region/:region/pronta-entrega/:sku`);
console.log(`- GET /api/health`);
console.log(`- GET /api/health/ready`);
console.log(`- GET /api/health/live`);
console.log(`- GET /api/docs (Swagger UI)`);

async function startServer() {
    try {
        await initializaDatabase();
        logger.info('Database connected successfully.');

       const server = app.listen(Number(PORT), '0.0.0.0', () => {
             logger.info(`Server is running on port ${PORT}`);
             logger.info('Ambiente: Desenvolvimento');
             logger.info(`API Endpoint: http://localhost:${PORT}/api/v1/products`);
             console.log(`Press Ctrl+C to stop the server.`);
        });

        server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use.`);
                process.exit(1);
            } else {
                logger.error('Server error:', error);
            }
            process.exit(1);
        });
    } catch (error: any) { 
        logger.error(`Error starting server: ${error.message}`);
        logger.error(error);
        process.exit(1);
    }
}

startServer();