import { Purchase } from '@core/domain/Purchase';
import { PurchaseStatus } from '@core/domain/Purchase';

export interface IPurchaseRepository {
  save(purchase: Purchase): Promise<Purchase>;
  findById(id: number): Promise<Purchase | undefined>;
  findAll(status?: PurchaseStatus): Promise<Purchase[]>;
  findBySupplier(supplierId: number): Promise<Purchase[]>;
  update(purchase: Purchase): Promise<Purchase>;
  delete(id: number): Promise<void>;
}