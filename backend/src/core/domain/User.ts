// src/core/domain/User.ts
import { UserRole } from '@core/dto/AuthDTO';

export { UserRole } from '@core/dto/AuthDTO';

export class User {
  id!: number;
  email!: string;
  password!: string;
  name?: string;
  role!: UserRole;
  refreshToken?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Partial<User> = {} ) {
    Object.assign(this, props);
  }
}

