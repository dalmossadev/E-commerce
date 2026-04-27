import { Request, Response, NextFunction } from 'express';
import { cache } from '@infrastructure/cache/cache';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

interface RequestCount {
  count: number;
  resetTime: number;
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs = 60000,
    maxRequests = 100,
    message = 'Too many requests, please try again later',
    keyGenerator = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown'
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `ratelimit:${keyGenerator(req)}`;
    
    const requestData = cache.get<RequestCount>(key);
    const now = Date.now();

    if (!requestData || now > requestData.resetTime) {
      cache.set(key, {
        count: 1,
        resetTime: now + windowMs
      }, windowMs);
      
      next();
      return;
    }

    if (requestData.count >= maxRequests) {
      const retryAfter = Math.ceil((requestData.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter.toString());
      res.status(429).json({
        status: 'error',
        message,
        retryAfter
      });
      return;
    }

    requestData.count++;
    cache.set(key, requestData, windowMs);

    next();
  };
}

export const defaultRateLimit = rateLimit({
  windowMs: 60000,
  maxRequests: 100
});

export const authRateLimit = rateLimit({
  windowMs: 900000,
  maxRequests: 5,
  message: 'Too many login attempts, please try again later'
});

export const apiRateLimit = rateLimit({
  windowMs: 60000,
  maxRequests: 1000
});