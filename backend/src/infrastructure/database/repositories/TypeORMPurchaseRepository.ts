import { AppDataSource } from '@infrastructure/database/data-source';
import { Purchase, PurchaseStatus } from '@core/domain/Purchase';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';

export class TypeORMPurchaseRepository implements IPurchaseRepository {
  private repository = AppDataSource.getRepository(Purchase);

  async save(purchase: Purchase): Promise<Purchase> {
    return await this.repository.save(purchase);
  }

  async findById(id: number): Promise<Purchase | undefined> {
    const purchase = await this.repository.findOne({ 
      where: { id },
      relations: ['items']
    });
    return purchase || undefined;
  }

  async findAll(status?: PurchaseStatus): Promise<Purchase[]> {
    return await this.repository.find({
      where: status ? { status } : {},
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async findBySupplier(supplierId: number): Promise<Purchase[]> {
    return await this.repository.find({
      where: { supplierId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(purchase: Purchase): Promise<Purchase> {
    purchase.updatedAt = new Date();
    return await this.repository.save(purchase);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}