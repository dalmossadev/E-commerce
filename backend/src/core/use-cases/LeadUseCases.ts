import { Lead, LeadStatus } from '@core/domain/Lead';
import { ILeadRepository } from '@core/interfaces/ILeadRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { CreateLeadDTO, UpdateLeadDTO } from '@core/dto/LeadDTO';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';

const VALIDATION_ERROR_MESSAGE = 'SKU, customer name and phone are required';

interface ILeadValidator {
  validate(data: CreateLeadDTO): void;
}

interface ILeadFactory {
  create(data: CreateLeadDTO): Lead;
}

class LeadValidator implements ILeadValidator {
  validate(data: CreateLeadDTO): void {
    this.validateRequiredField(data.sku, 'SKU');
    this.validateRequiredField(data.customerName, 'customerName');
    this.validateRequiredField(data.customerPhone, 'customerPhone');
  }

  private validateRequiredField(value: unknown, fieldName: string): void {
    if (!this.isNonEmptyString(value)) {
      throw new BadRequestError(VALIDATION_ERROR_MESSAGE);
    }
  }

  private isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }
}

class LeadFactory implements ILeadFactory {
  create(data: CreateLeadDTO): Lead {
    const lead = new Lead();
    lead.sku = data.sku!.trim();
    lead.customerName = data.customerName!.trim();
    lead.customerPhone = data.customerPhone!.trim();
    lead.customerEmail = this.trimOrUndefined(data.customerEmail);
    lead.notes = this.trimOrUndefined(data.notes);
    lead.productId = data.productId ?? undefined;
    lead.variantId = data.variantId ?? undefined;
    lead.status = LeadStatus.PENDING;
    return lead;
  }

  private trimOrUndefined(value?: string): string | undefined {
    return value?.trim() || undefined;
  }
}

export class CreateLeadUseCase {
  private validator: ILeadValidator;
  private factory: ILeadFactory;

  constructor(
    private leadRepository: ILeadRepository,
    private productRepository?: IProductRepository
  ) {
    this.validator = new LeadValidator();
    this.factory = new LeadFactory();
  }

  async execute(data: CreateLeadDTO): Promise<Lead> {
    this.validator.validate(data);
    await this.validateProductExists(data.productId);

    const lead = this.factory.create(data);
    return await this.leadRepository.save(lead);
  }

  private async validateProductExists(productId?: number): Promise<void> {
    if (productId === undefined || productId === null) {
      return;
    }
    if (!this.productRepository) {
      return;
    }
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product', productId);
    }
  }
}

export class ListLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(status?: LeadStatus): Promise<Lead[]> {
    return await this.leadRepository.findAll(status);
  }
}

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

export class UpdateLeadStatusUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(id: number, data: UpdateLeadDTO): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead', id);
    }

    if (data.status) {
      lead.status = data.status;
    }
    if (data.notes !== undefined) {
      lead.notes = data.notes;
    }

    return await this.leadRepository.update(lead);
  }
}

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

export class CountLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(status?: LeadStatus): Promise<number> {
    return await this.leadRepository.count(status);
  }
}