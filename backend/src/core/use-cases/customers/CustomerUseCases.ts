import { ICustomerRepository } from '@core/interfaces/ICustomerRepository';
import { Customer } from '@core/domain/Customer';
import { CreateCustomerDTO, UpdateCustomerDTO, CustomerQueryDTO } from '@core/dto/CustomerDTO';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';

export class ListCustomersUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(query?: CustomerQueryDTO): Promise<{ data: Customer[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.customerRepository.findAll(query);
  }
}

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
      address: data.address || {}
    });

    return await this.customerRepository.save(customer);
  }
}

export class UpdateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(id: number, data: UpdateCustomerDTO): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    if (data.cpf && data.cpf !== customer.cpf) {
      const existingByCpf = await this.customerRepository.findByCpf(data.cpf);
      if (existingByCpf) {
        throw new BadRequestError('CPF already exists');
      }
    }

    if (data.fullName !== undefined) customer.fullName = data.fullName.trim();
    if (data.cpf !== undefined) customer.cpf = data.cpf.trim();
    if (data.phone !== undefined) customer.phone = data.phone.trim();
    if (data.address !== undefined) customer.address = data.address;

    return await this.customerRepository.update(customer);
  }
}

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
