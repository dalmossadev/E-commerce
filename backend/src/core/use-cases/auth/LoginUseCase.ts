import { UserRole } from '@core/domain/User';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { IAuthService } from '@core/interfaces/IAuthService';
import { LoginDTO, AuthResponseDTO } from '@core/dto/AuthDTO';
import { AppError } from '@core/errors/AppError';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
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
}
