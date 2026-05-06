import { Address } from "../domain/Address";

export interface IAddressRepository {
  findById(id: number): Promise<Address | null>;
  findByCustomerId(customerId: number): Promise<Address[]>;
  findBySupplierId(supplierId: number): Promise<Address[]>;
  save(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
  delete(id: number): Promise<void>;
  setMainAddress(ownerId: number, addressId: number, ownerType: 'CUSTOMER' | 'SUPPLIER'): Promise<void>;
}
