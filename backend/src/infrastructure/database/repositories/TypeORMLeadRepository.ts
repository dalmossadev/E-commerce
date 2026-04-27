import { AppDataSource } from '@infrastructure/database/data-source';
import { Lead } from '@core/domain/Lead';
import { LeadStatus } from '@core/domain/Lead';
import { ILeadRepository } from '@core/interfaces/ILeadRepository';

export class TypeORMLeadRepository implements ILeadRepository {
  private repository = AppDataSource.getRepository(Lead);

  async save(lead: Lead): Promise<Lead> {
    return await this.repository.save(lead);
  }

  async findById(id: number): Promise<Lead | undefined> {
    const lead = await this.repository.findOne({ where: { id } });
    return lead || undefined;
  }

  async findBySku(sku: string): Promise<Lead[]> {
    return await this.repository.find({ where: { sku } });
  }

  async findAll(status?: LeadStatus): Promise<Lead[]> {
    return await this.repository.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' }
    });
  }

  async update(lead: Lead): Promise<Lead> {
    lead.updatedAt = new Date();
    return await this.repository.save(lead);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async count(status?: LeadStatus): Promise<number> {
    const query = this.repository.createQueryBuilder('lead');
    if (status) {
      query.where('lead.status = :status', { status });
    }
    return await query.getCount();
  }
}