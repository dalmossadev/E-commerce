import { Lead } from '@core/domain/Lead';
import { LeadStatus } from '@core/domain/Lead';

export interface ILeadRepository {
  save(lead: Lead): Promise<Lead>;
  findById(id: number): Promise<Lead | undefined>;
  findBySku(sku: string): Promise<Lead[]>;
  findAll(status?: LeadStatus): Promise<Lead[]>;
  update(lead: Lead): Promise<Lead>;
  delete(id: number): Promise<void>;
  count(status?: LeadStatus): Promise<number>;
}