import { Request, Response, NextFunction } from 'express';
import { logger } from '@infrastructure/logger/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
}