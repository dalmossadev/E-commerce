import { Lead, LeadStatus } from '../../domain/Lead';
import { ILeadRepository } from '../../interfaces/ILeadRepository';
import { IAuditRepository } from '../../interfaces/IAuditRepository';
import { UpdateLeadDTO } from '../../dto/LeadDTO';
import { NotFoundError } from '../../errors/CustomErrors';

export class UpdateLeadStatusUseCase {
  constructor(
    private leadRepository: ILeadRepository,
    private auditRepository?: IAuditRepository
  ) {}

  async execute(id: number, data: UpdateLeadDTO): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead', id);
    }

    const oldStatus = lead.status;

    if (data.status) {
      lead.status = data.status;
    }
    if (data.notes !== undefined) {
      lead.notes = data.notes;
    }

    const updatedLead = await this.leadRepository.update(lead);

    if (data.status === LeadStatus.CONFIRMED && oldStatus !== LeadStatus.CONFIRMED) {
      await this.auditRepository?.saveLog({
        action: 'UPDATE',
        entity: 'Lead',
        entityId: id.toString(),
        oldValue: JSON.stringify({ status: oldStatus }),
        newValue: JSON.stringify({ status: LeadStatus.CONFIRMED }),
      });
    }

    return updatedLead;
  }
}
