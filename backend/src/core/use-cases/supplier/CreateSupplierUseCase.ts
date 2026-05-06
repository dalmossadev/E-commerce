import { Supplier } from '../../domain/Supplier';
import { Address } from '../../domain/Address';
import { ISupplierRepository } from '../../interfaces/ISupplierRepository';
import { CreateSupplierDTO } from '../../dto/SupplierDTO';

export class CreateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(data: CreateSupplierDTO): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findByCnpj(data.cnpj);
    if (existingSupplier) {
      throw new Error('Supplier with this CNPJ already exists');
    }

    const supplier = new Supplier();
    supplier.companyName = data.companyName;
    supplier.tradeName = data.tradeName;
    supplier.cnpj = data.cnpj;
    supplier.contactEmail = data.contactEmail;
    supplier.phone = data.phone;
    supplier.website = data.website;
    supplier.categoryId = data.categoryId;
    supplier.status = 'ACTIVE';
    
    if (data.address) {
      supplier.addresses = [new Address({ ...data.address, isMain: true })];
    } else {
      supplier.addresses = [];
    }

    return await this.supplierRepository.save(supplier);
  }
}
