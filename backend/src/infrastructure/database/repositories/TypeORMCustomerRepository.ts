import { AppDataSource } from '@infrastructure/database/data-source';
import { Customer } from '@core/domain/Customer';
import { ICustomerRepository } from '@core/interfaces/ICustomerRepository';
import { CustomerQueryDTO } from '@core/dto/CustomerDTO';

export class TypeORMCustomerRepository implements ICustomerRepository {
  private repository = AppDataSource.getRepository(Customer);

  async save(customer: Customer): Promise<Customer> {
    return await this.repository.save(customer);
  }

  async findById(id: number): Promise<Customer | null> {
    return await this.repository.findOne({ where: { id }, relations: ["addresses"] });
  }

  async findAll(query?: CustomerQueryDTO): Promise<{ data: Customer[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.addresses', 'addresses');

    if (query?.search) {
      qb.where('customer.fullName LIKE :search OR customer.cpf LIKE :search', { search: `%${query.search}%` });
    }

    const sortBy = query?.sortBy || 'createdAt';
    const sortOrder = query?.sortOrder || 'DESC';
    qb.orderBy(`customer.${sortBy}`, sortOrder);

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }

  async update(customer: Customer): Promise<Customer> {
    return await this.repository.save(customer);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCpf(cpf: string): Promise<Customer | null> {
    return await this.repository.findOne({ where: { cpf }, relations: ["addresses"] });
  }

  async countAll(): Promise<number> {
    return await this.repository.count();
  }
}
