export enum UserRole {
  ADMIN = 'admin',
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer'
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  phone?: string;
}

export interface AuthResponseDTO {
  user: {
    id: number;
    email: string;
    name: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface TokenPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}