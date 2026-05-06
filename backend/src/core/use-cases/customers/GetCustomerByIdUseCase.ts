import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { Customer } from '../../domain/Customer';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetCustomerByIdUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }
    return customer;
  }
}
