import { LeadStatus } from '../../domain/Lead';
import { ILeadRepository } from '../../interfaces/ILeadRepository';

export class CountLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(status?: LeadStatus): Promise<number> {
    return await this.leadRepository.count(status);
  }
}
