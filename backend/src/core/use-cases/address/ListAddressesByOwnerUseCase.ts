import { IAddressRepository } from "../../interfaces/IAddressRepository";
import { Address } from "../../domain/Address";

export class ListAddressesByOwnerUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(ownerId: number, ownerType: 'CUSTOMER' | 'SUPPLIER'): Promise<Address[]> {
    if (ownerType === 'CUSTOMER') {
      return await this.addressRepository.findByCustomerId(ownerId);
    } else {
      return await this.addressRepository.findBySupplierId(ownerId);
    }
  }
}
