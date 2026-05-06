import { Router, Request, Response, NextFunction } from 'express';
import { LoginDTO, RegisterDTO, RefreshTokenDTO } from '@core/dto/AuthDTO';
import { container } from '@core/container/Container';
import { AppError } from '@core/errors/AppError';
import { authService } from '@infrastructure/auth/AuthService';
import { loginSchema, registerSchema, refreshTokenSchema } from '../validations/auth.validation';
import { validate } from '../middlewares/ValidationMiddleware';
import { authRateLimit } from '../middlewares/RateLimitMiddleware';

const authRouter = Router();

const loginUseCase = container.loginUseCase();
const registerUseCase = container.registerUseCase();
const refreshTokenUseCase = container.refreshTokenUseCase();

authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.__session;
    
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const payload = authService.verifyAccessToken(token);
    const user = await container.userRepository().findById(payload.sub);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginDTO = req.body;
    const result = await loginUseCase.execute(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', authRateLimit, validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegisterDTO = req.body;
    const result = await registerUseCase.execute(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/refresh', validate(refreshTokenSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RefreshTokenDTO = req.body;
    const result = await refreshTokenUseCase.execute(data.refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { authRouter };