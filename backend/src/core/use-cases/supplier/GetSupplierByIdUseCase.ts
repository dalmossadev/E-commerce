import { Supplier } from '../../domain/Supplier';
import { ISupplierRepository } from '../../interfaces/ISupplierRepository';

export class GetSupplierByIdUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(id: number): Promise<Supplier | undefined> {
    return await this.supplierRepository.findById(id);
  }
}
