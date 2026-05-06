import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { Customer } from '../../domain/Customer';
import { Address } from '../../domain/Address';
import { CreateCustomerDTO } from '../../dto/CustomerDTO';
import { BadRequestError } from '../../errors/CustomErrors';

export class CreateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    if (!data.fullName?.trim()) {
      throw new BadRequestError('Full name is required');
    }
    if (!data.cpf?.trim()) {
      throw new BadRequestError('CPF is required');
    }
    if (!data.phone?.trim()) {
      throw new BadRequestError('Phone is required');
    }

    const existingByCpf = await this.customerRepository.findByCpf(data.cpf);
    if (existingByCpf) {
      throw new BadRequestError('CPF already exists');
    }

    const customer = new Customer({
      fullName: data.fullName.trim(),
      cpf: data.cpf.trim(),
      phone: data.phone.trim(),
      addresses: data.address ? [new Address({ ...data.address, isMain: true })] : []
    });

    return await this.customerRepository.save(customer);
  }
}
