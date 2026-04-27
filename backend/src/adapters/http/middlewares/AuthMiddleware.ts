import { Request, Response, NextFunction } from 'express';
import { authService } from '@infrastructure/auth/AuthService';
import { UserRole, TokenPayload } from '@core/dto/AuthDTO';
import { AppError } from '@core/errors/AppError';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    const sessionCookie = req.cookies?.__session;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (sessionCookie) {
      token = sessionCookie;
    }
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const payload = authService.verifyAccessToken(token);
    
    (req as AuthRequest).user = payload;
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid token', 401));
    }
  }
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;
      
      if (!authReq.user) {
        throw new AppError('Not authenticated', 401);
      }

      if (!allowedRoles.includes(authReq.user.role)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const requireAuth = authenticate;
export const requireAdmin = authorize(UserRole.ADMIN);
export const requireSupplier = authorize(UserRole.ADMIN, UserRole.SUPPLIER);
export const requireCustomer = authorize(UserRole.ADMIN, UserRole.SUPPLIER, UserRole.CUSTOMER);