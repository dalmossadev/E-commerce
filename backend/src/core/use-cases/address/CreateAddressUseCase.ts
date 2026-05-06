import { IAddressRepository } from "../../interfaces/IAddressRepository";
import { Address } from "../../domain/Address";

export interface CreateAddressDTO {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isMain?: boolean;
  tag?: string;
  customerId?: number;
  supplierId?: number;
}

export class CreateAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(data: CreateAddressDTO): Promise<Address> {
    const address = new Address(data);
    return await this.addressRepository.save(address);
  }
}
