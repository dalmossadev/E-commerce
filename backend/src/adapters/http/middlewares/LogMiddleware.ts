import { Request, Response, NextFunction } from 'express';
import { logger } from '@infrastructure/logger/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
}