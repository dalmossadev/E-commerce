import { IUserRepository } from '@core/interfaces/IUserRepository';
import { IAuthService } from '@core/interfaces/IAuthService';
import { AuthResponseDTO } from '@core/dto/AuthDTO';
import { AppError } from '@core/errors/AppError';
import { UserRole } from '@core/dto/AuthDTO';

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(refreshToken: string): Promise<AuthResponseDTO> {
    try {
      const payload = this.authService.verifyRefreshToken(refreshToken);
      
      const user = await this.userRepository.findById(payload.sub);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Validação de rotação: o token deve bater com o último salvo no banco
      if (user.refreshToken !== refreshToken) {
        // Possível tentativa de reuse/reuso - invalidar tudo?
        user.refreshToken = undefined;
        await this.userRepository.update(user);
        throw new AppError('Invalid refresh token (reuse detected)', 401);
      }

      const tokens = this.authService.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role as UserRole
      });

      // Salva o novo refresh token
      user.refreshToken = tokens.refreshToken;
      await this.userRepository.update(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          role: user.role as UserRole
        },
        ...tokens,
        expiresIn: tokens.expiresIn
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid refresh token', 401);
    }
  }
}
