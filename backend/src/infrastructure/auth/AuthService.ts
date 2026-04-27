import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TokenPayload, UserRole } from '@core/dto/AuthDTO';
import { IAuthService } from '@core/interfaces/IAuthService';

export class JwtService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key-change-in-production';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';
    this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: this.accessExpiresIn as any };
    return jwt.sign(payload as any, this.accessSecret, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: this.refreshExpiresIn as any };
    return jwt.sign(payload as any, this.refreshSecret, options);
  }

  verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.accessSecret) as unknown as TokenPayload;
    return decoded;
  }

  verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.refreshSecret) as unknown as TokenPayload;
    return decoded;
  }

  decodeToken(token: string): TokenPayload | null {
    const decoded = jwt.decode(token);
    if (!decoded) return null;
    return decoded as unknown as TokenPayload;
  }
}

export class PasswordService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export class AuthService implements IAuthService {
  private jwtService: JwtService;
  private passwordService: PasswordService;

  constructor() {
    this.jwtService = new JwtService();
    this.passwordService = new PasswordService();
  }

  generateTokens(user: { id: number; email: string; role: UserRole }) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.jwtService.generateAccessToken(payload),
      refreshToken: this.jwtService.generateRefreshToken(payload),
      expiresIn: 900
    };
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.jwtService.verifyAccessToken(token);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.jwtService.verifyRefreshToken(token);
  }

  async hashPassword(password: string): Promise<string> {
    return this.passwordService.hash(password);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.compare(password, hash);
  }
}

export const authService = new AuthService();