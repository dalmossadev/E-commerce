import { Supplier } from '../../domain/Supplier';
import { Address } from '../../domain/Address';
import { ISupplierRepository } from '../../interfaces/ISupplierRepository';
import { UpdateSupplierDTO } from '../../dto/SupplierDTO';

export class UpdateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: number, data: UpdateSupplierDTO): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (data.companyName) supplier.companyName = data.companyName;
    if (data.tradeName) supplier.tradeName = data.tradeName;
    if (data.contactEmail) supplier.contactEmail = data.contactEmail;
    if (data.phone) supplier.phone = data.phone;
    if (data.website) supplier.website = data.website;
    if (data.categoryId) supplier.categoryId = data.categoryId;
    if (data.status) supplier.status = data.status;

    if (data.address !== undefined) {
      if (!supplier.addresses) supplier.addresses = [];
      const mainAddressIndex = supplier.addresses.findIndex(a => a.isMain);
      
      if (mainAddressIndex > -1) {
        supplier.addresses[mainAddressIndex] = new Address({ 
          ...supplier.addresses[mainAddressIndex], 
          ...data.address,
          isMain: true 
        });
      } else {
        supplier.addresses.push(new Address({ ...data.address, isMain: true }));
      }
    }

    return await this.supplierRepository.update(supplier);
  }
}
