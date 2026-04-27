// src/server.ts
import 'dotenv/config';
import { logger } from '@infrastructure/logger/logger';
import { requestLogger } from '@adapters/http/middlewares/LogMiddleware';
import { errorHandler } from '@adapters/http/middlewares/ErrorHandler';
import { defaultRateLimit, authRateLimit } from '@adapters/http/middlewares/RateLimitMiddleware';
import 'reflect-metadata';
import express from 'express';
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

const app = express();
app.set('strict routing', false);
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(requestLogger);
app.use(defaultRateLimit);

app.use(`${API_BASE}/auth`, authRateLimit, authRouter);
app.use(`${API_BASE}/products`, productRouter);
app.use(`${API_BASE}/suppliers`, supplierRouter);
app.use(`${API_BASE}/users`, userRouter);
app.use(`${API_BASE}/leads`, leadRouter);
app.use(`${API_BASE}/orders`, orderRouter);
app.use(`${API_BASE}/purchases`, purchaseRouter);
app.use(`${API_BASE}/admin`, adminRouter);
app.use('/api', healthRouter);

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