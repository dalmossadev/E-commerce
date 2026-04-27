import { Supplier } from '../domain/Supplier';
import { ISupplierRepository } from '../interfaces/ISupplierRepository';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dto/SupplierDTO';

export class CreateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(data: CreateSupplierDTO): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findByCnpj(data.cnpj);
    if (existingSupplier) {
      throw new Error('Supplier with this CNPJ already exists');
    }

    const supplier = new Supplier();
    supplier.companyName = data.companyName;
    supplier.cnpj = data.cnpj;
    supplier.contactEmail = data.contactEmail;
    supplier.category = data.category;

    return await this.supplierRepository.save(supplier);
  }
}

export class ListSuppliersUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(): Promise<Supplier[]> {
    return await this.supplierRepository.findAll();
  }
}

export class GetSupplierByIdUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: number): Promise<Supplier | undefined> {
    return await this.supplierRepository.findById(id);
  }
}

export class UpdateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: number, data: UpdateSupplierDTO): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (data.companyName) supplier.companyName = data.companyName;
    if (data.contactEmail) supplier.contactEmail = data.contactEmail;
    if (data.category) supplier.category = data.category;

    return await this.supplierRepository.update(supplier);
  }
}

export class DeleteSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: number): Promise<void> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    await this.supplierRepository.delete(id);
  }
}