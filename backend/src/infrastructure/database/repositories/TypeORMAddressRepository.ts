import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Address } from "@core/domain/Address";
import { AddressSchema } from "../mappers/AddressSchema";
import { IAddressRepository } from "@core/interfaces/IAddressRepository";

export class TypeORMAddressRepository implements IAddressRepository {
  private repository: Repository<Address>;

  constructor() {
    this.repository = AppDataSource.getRepository(AddressSchema);
  }

  async findById(id: number): Promise<Address | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByCustomerId(customerId: number): Promise<Address[]> {
    return await this.repository.find({ where: { customerId } });
  }

  async findBySupplierId(supplierId: number): Promise<Address[]> {
    return await this.repository.find({ where: { supplierId } });
  }

  async save(address: Address): Promise<Address> {
    if (address.isMain) {
      await this.resetMainAddress(address.customerId, address.supplierId);
    }
    return await this.repository.save(address);
  }

  async update(address: Address): Promise<Address> {
    if (address.isMain) {
      await this.resetMainAddress(address.customerId, address.supplierId, address.id);
    }
    return await this.repository.save(address);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async setMainAddress(ownerId: number, addressId: number, ownerType: 'CUSTOMER' | 'SUPPLIER'): Promise<void> {
    const filter = ownerType === 'CUSTOMER' ? { customerId: ownerId } : { supplierId: ownerId };
    
    // Reset all
    await this.repository.update(filter, { isMain: false });
    
    // Set one
    await this.repository.update({ id: addressId }, { isMain: true });
  }

  private async resetMainAddress(customerId?: number, supplierId?: number, excludeId?: number): Promise<void> {
    if (customerId) {
      await this.repository.createQueryBuilder()
        .update(Address)
        .set({ isMain: false })
        .where("customerId = :customerId", { customerId })
        .andWhere("id != :excludeId", { excludeId: excludeId || 0 })
        .execute();
    } else if (supplierId) {
      await this.repository.createQueryBuilder()
        .update(Address)
        .set({ isMain: false })
        .where("supplierId = :supplierId", { supplierId })
        .andWhere("id != :excludeId", { excludeId: excludeId || 0 })
        .execute();
    }
  }
}
