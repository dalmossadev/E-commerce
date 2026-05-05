import { User, UserRole } from '@core/domain/User';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { IAuthService } from '@core/interfaces/IAuthService';
import { LoginDTO, RegisterDTO, AuthResponseDTO } from '@core/dto/AuthDTO';
import { AppError } from '@core/errors/AppError';

export class AuthUseCases {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await this.authService.comparePassword(data.password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.authService.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    });

    // Salva o refresh token para rotação
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.update(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: user.role as UserRole
      },
      ...tokens
    };
  }

  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await this.authService.hashPassword(data.password);

    const user = new User();
    user.email = data.email;
    user.password = hashedPassword;
    user.name = data.name;
    user.role = data.role || UserRole.CUSTOMER;

    const savedUser = await this.userRepository.save(user);

    const tokens = this.authService.generateTokens({
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role as UserRole
    });

    // Salva o refresh token inicial
    savedUser.refreshToken = tokens.refreshToken;
    await this.userRepository.update(savedUser);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name || savedUser.email,
        role: savedUser.role as UserRole
      },
      ...tokens
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDTO> {
    try {
      const payload = this.authService.verifyRefreshToken(refreshToken);
      
      const user = await this.userRepository.findById(payload.sub);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Validação de rotação
      if (user.refreshToken !== refreshToken) {
        user.refreshToken = undefined;
        await this.userRepository.update(user);
        throw new AppError('Invalid refresh token (reuse detected)', 401);
      }

      const tokens = this.authService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role as UserRole
      });

      // Salva novo refresh token
      user.refreshToken = tokens.refreshToken;
      await this.userRepository.update(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          role: user.role as UserRole
        },
        ...tokens
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}