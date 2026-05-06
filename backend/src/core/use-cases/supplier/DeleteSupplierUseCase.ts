import { ISupplierRepository } from '../../interfaces/ISupplierRepository';

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
