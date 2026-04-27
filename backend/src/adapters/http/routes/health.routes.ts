import { Router, Request, Response } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';

const healthRouter = Router();

healthRouter.get('/health', async (req: Request, res: Response) => {
  const start = Date.now();
  
  let dbStatus = 'unhealthy';
  try {
    await AppDataSource.query('SELECT 1');
    dbStatus = 'healthy';
  } catch {
    dbStatus = 'unhealthy';
  }

  const duration = Date.now() - start;

  const health = {
    status: dbStatus === 'healthy' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    responseTime: `${duration}ms`,
    version: process.env.APP_VERSION || '1.0.0'
  };

  const statusCode = dbStatus === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

healthRouter.get('/health/ready', async (req: Request, res: Response) => {
  try {
    await AppDataSource.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});

healthRouter.get('/health/live', (req: Request, res: Response) => {
  res.status(200).json({ alive: true });
});

export { healthRouter };