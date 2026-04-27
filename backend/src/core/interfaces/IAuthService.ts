import { TokenPayload, UserRole } from '@core/dto/AuthDTO';

export interface IAuthService {
  generateTokens(user: { id: number; email: string; role: UserRole }): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}