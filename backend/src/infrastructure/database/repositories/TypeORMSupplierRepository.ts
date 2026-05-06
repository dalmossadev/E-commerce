import { AppDataSource } from '@infrastructure/database/data-source';
import { Supplier } from '@core/domain/Supplier';
import { ISupplierRepository } from '@core/interfaces/ISupplierRepository';

export class TypeORMSupplierRepository implements ISupplierRepository {
  private repository = AppDataSource.getRepository(Supplier);

  async save(supplier: Supplier): Promise<Supplier> {
    return await this.repository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return await this.repository.find({ relations: ["addresses", "category"] });
  }

  async findById(id: number): Promise<Supplier | undefined> {
    const supplier = await this.repository.findOne({ where: { id }, relations: ["addresses", "category"] });
    return supplier || undefined;
  }

  async findByCnpj(cnpj: string): Promise<Supplier | undefined> {
    const supplier = await this.repository.findOne({ where: { cnpj }, relations: ["addresses", "category"] });
    return supplier || undefined;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async update(supplier: Supplier): Promise<Supplier> {
    return await this.repository.save(supplier);
  }

  async countAll(): Promise<number> {
    return await this.repository.count();
  }
}