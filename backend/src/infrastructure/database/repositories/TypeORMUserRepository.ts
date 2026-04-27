import { AppDataSource } from '@infrastructure/database/data-source';
import { User } from '@core/domain/User';
import { IUserRepository } from '@core/interfaces/IUserRepository';

export class TypeORMUserRepository implements IUserRepository {
  private repository = AppDataSource.getRepository(User);

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt']
    });
    return user || undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt', 'password']
    });
    return user || undefined;
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt']
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async update(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}