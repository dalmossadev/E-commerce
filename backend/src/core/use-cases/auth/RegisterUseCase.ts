import { User, UserRole } from '@core/domain/User';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { IAuthService } from '@core/interfaces/IAuthService';
import { RegisterDTO, AuthResponseDTO } from '@core/dto/AuthDTO';
import { AppError } from '@core/errors/AppError';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(data: RegisterDTO): Promise<AuthResponseDTO> {
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
}
