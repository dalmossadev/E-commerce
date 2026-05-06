import { IAddressRepository } from "../../interfaces/IAddressRepository";

export class DeleteAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
