import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { Customer } from '../../domain/Customer';
import { Address } from '../../domain/Address';
import { UpdateCustomerDTO } from '../../dto/CustomerDTO';
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors';

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
    
    if (data.address !== undefined) {
      if (!customer.addresses) customer.addresses = [];
      const mainAddressIndex = customer.addresses.findIndex(a => a.isMain);
      
      if (mainAddressIndex > -1) {
        customer.addresses[mainAddressIndex] = new Address({ 
          ...customer.addresses[mainAddressIndex], 
          ...data.address,
          isMain: true 
        });
      } else {
        customer.addresses.push(new Address({ ...data.address, isMain: true }));
      }
    }

    return await this.customerRepository.update(customer);
  }
}
