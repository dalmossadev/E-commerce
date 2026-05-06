import { IAddressRepository } from "../../interfaces/IAddressRepository";

export class SetMainAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(id: number, ownerId: number, ownerType: 'CUSTOMER' | 'SUPPLIER'): Promise<void> {
    await this.addressRepository.setMainAddress(ownerId, id, ownerType);
  }
}
