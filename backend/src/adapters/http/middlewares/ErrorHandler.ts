import { Request, Response, NextFunction } from 'express';

import { logger } from '@infrastructure/logger/logger';
import { AppError } from '@core/errors/AppError';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  logger.error(`[Internal Error]: ${error.message}`);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}