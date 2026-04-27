import { User } from '@core/domain/User';
import { UserRole } from '@core/dto/AuthDTO';

export interface SafeUserDTO {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export function toSafeUser(user: User): SafeUserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
