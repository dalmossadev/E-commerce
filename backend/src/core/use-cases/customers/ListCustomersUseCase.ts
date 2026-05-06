import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { Customer } from '../../domain/Customer';
import { CustomerQueryDTO } from '../../dto/CustomerDTO';

export class ListCustomersUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(query?: CustomerQueryDTO): Promise<{ data: Customer[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.customerRepository.findAll(query);
  }
}
