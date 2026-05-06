import { Supplier } from '@core/domain/Supplier';

export interface ISupplierRepository {
  save(supplier: Supplier): Promise<Supplier>;
  findAll(): Promise<Supplier[]>;
  findById(id: number): Promise<Supplier | undefined>;
  findByCnpj(cnpj: string): Promise<Supplier | undefined>;
  delete(id: number): Promise<void>;
  update(supplier: Supplier): Promise<Supplier>;
  countAll(): Promise<number>;
}