import { Router, Request, Response, NextFunction } from 'express';
import { AuthUseCases } from '@core/use-cases/AuthUseCases';
import { RefreshTokenUseCase } from '@core/use-cases/auth/RefreshTokenUseCase';
import { LoginDTO, RegisterDTO, RefreshTokenDTO } from '@core/dto/AuthDTO';
import { container } from '@core/container/Container';
import { AppError } from '@core/errors/AppError';
import { authService } from '@infrastructure/auth/AuthService';
import { authRateLimit } from '@adapters/http/middlewares/RateLimitMiddleware';

const authRouter = Router();

const authUseCases = container.authUseCases();
const refreshTokenUseCase = container.refreshTokenUseCase();

authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);
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

authRouter.post('/login', authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginDTO = req.body;
    const result = await authUseCases.login(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegisterDTO = req.body;
    const result = await authUseCases.register(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RefreshTokenDTO = req.body;
    const result = await refreshTokenUseCase.execute(data.refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { authRouter };