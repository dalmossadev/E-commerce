import { ILeadRepository } from '../../interfaces/ILeadRepository';
import { NotFoundError } from '../../errors/CustomErrors';

export class DeleteLeadUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(id: number): Promise<void> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead', id);
    }
    await this.leadRepository.delete(id);
  }
}
