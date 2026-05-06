import { Lead } from '../../domain/Lead';
import { ILeadRepository } from '../../interfaces/ILeadRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class GetLeadByIdUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(id: number): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead', id);
    }
    return lead;
  }
}
