import { Lead, LeadStatus } from '../../domain/Lead';
import { ILeadRepository } from '../../interfaces/ILeadRepository';

export class ListLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(status?: LeadStatus): Promise<Lead[]> {
    return await this.leadRepository.findAll(status);
  }
}
