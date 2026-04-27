import { Router, Request, Response, NextFunction } from 'express';
import { TypeORMUserRepository } from '@infrastructure/database/repositories/TypeORMUserRepository';
import { UserRole } from '@core/dto/AuthDTO';
import { AppError } from '@core/errors/AppError';
import { authenticate, authorize, AuthRequest } from '@adapters/http/middlewares/AuthMiddleware';
import { z } from 'zod';
import { validate } from '@adapters/http/middlewares/ValidationMiddleware';
import { container } from '@core/container/Container';

const userRouter = Router();

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(['admin', 'supplier', 'customer']).optional(),
    phone: z.string().optional()
  })
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional()
  })
});

userRouter.post('/', authenticate, authorize(UserRole.ADMIN), validate(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { User } = await import('@core/domain/User');
    const { authService } = await import('@infrastructure/auth/AuthService');
    
    const { email, password, name, role, phone } = req.body;
    const hashedPassword = await authService.hashPassword(password);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;
    user.role = role || UserRole.CUSTOMER;

    const userRepo = container.userRepository();
    const savedUser = await userRepo.save(user);
    
    res.status(201).json({
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get('/', authenticate, authorize(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepo = container.userRepository();
    const users = await userRepo.findAll();
    res.json(users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt
    })));
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const userId = parseInt(req.params.id as string);
    
    if (authReq.user?.sub !== userId && authReq.user?.role !== UserRole.ADMIN) {
      throw new AppError('Forbidden', 403);
    }
    
    const userRepo = container.userRepository();
    const user = await userRepo.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
});

userRouter.put('/:id', authenticate, validate(updateUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const userId = parseInt(req.params.id as string);
    
    if (authReq.user?.sub !== userId && authReq.user?.role !== UserRole.ADMIN) {
      throw new AppError('Forbidden', 403);
    }
    
    const userRepo = container.userRepository();
    const user = await userRepo.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) (user as any).phone = req.body.phone;
    
    const updatedUser = await userRepo.update(user);
    
    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } catch (error) {
    next(error);
  }
});

userRouter.delete('/:id', authenticate, authorize(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id as string);
    const userRepo = container.userRepository();
    const user = await userRepo.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    await userRepo.delete(userId);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { userRouter };