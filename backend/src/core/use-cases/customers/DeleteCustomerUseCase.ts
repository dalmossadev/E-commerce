import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class DeleteCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(id: number): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }
    await this.customerRepository.delete(id);
  }
}
