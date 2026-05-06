import { IAddressRepository } from "../../interfaces/IAddressRepository";
import { Address } from "../../domain/Address";

export interface UpdateAddressDTO {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  isMain?: boolean;
  tag?: string;
}

export class UpdateAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(id: number, data: UpdateAddressDTO): Promise<Address> {
    const address = await this.addressRepository.findById(id);
    if (!address) throw new Error("Endereço não encontrado");

    Object.assign(address, data);
    return await this.addressRepository.update(address);
  }
}
