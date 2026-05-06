import { User } from '@core/domain/User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  delete(id: number): Promise<void>;
  update(user: User): Promise<User>;
  countAll(): Promise<number>;
}