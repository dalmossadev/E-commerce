import { Supplier } from '../../domain/Supplier';
import { ISupplierRepository } from '../../interfaces/ISupplierRepository';

export class ListSuppliersUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(): Promise<Supplier[]> {
    return await this.supplierRepository.findAll();
  }
}
