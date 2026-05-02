import { Lead, LeadStatus } from '@core/domain/Lead';
import { ILeadRepository } from '@core/interfaces/ILeadRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { IAuditRepository } from '@core/interfaces/IAuditRepository';
import { CreateLeadDTO, UpdateLeadDTO } from '@core/dto/LeadDTO';
import { BadRequestError, NotFoundError } from '@core/errors/CustomErrors';

const VALIDATION_ERROR_MESSAGE = 'Nome do cliente e telefone são obrigatórios';

interface ILeadValidator {
  validate(data: CreateLeadDTO): void;
}

interface ILeadFactory {
  create(data: CreateLeadDTO): Lead;
}

class LeadValidator implements ILeadValidator {
  validate(data: CreateLeadDTO): void {
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
    lead.sku = data.sku?.trim() || '';
    lead.customerName = data.customerName.trim();
    lead.customerPhone = data.customerPhone.trim();
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
    private productRepository?: IProductRepository,
    private userRepository?: IUserRepository,
    private addProductToWishlistUseCase?: { execute(userId: number | undefined, productId: number, leadId?: number): Promise<any> }
  ) {
    this.validator = new LeadValidator();
    this.factory = new LeadFactory();
  }

  async execute(data: CreateLeadDTO): Promise<Lead> {
    this.validator.validate(data);

    let resolvedProductId = data.productId;

    if (!resolvedProductId && data.sku) {
      const product = await this.productRepository?.findBySku(data.sku);
      if (product) {
        resolvedProductId = product.id;
      }
    }

    if (!resolvedProductId) {
      throw new BadRequestError('É obrigatório informar um Produto válido (ID ou SKU) para registrar interesse.');
    }

    let finalUserId = data.userId;

    if (finalUserId && this.userRepository) {
      const userExists = await this.userRepository.findById(finalUserId);
      if (!userExists) {
        throw new NotFoundError('User', finalUserId);
      }
    }

    data.productId = resolvedProductId; // Assegura o registro no DB

    const lead = this.factory.create(data);
    const savedLead = await this.leadRepository.save(lead);

    if (this.addProductToWishlistUseCase) {
      try {
        console.log('[LeadUseCase] Adding to wishlist - userId:', finalUserId, 'leadId:', savedLead.id, 'productId:', resolvedProductId);
        const result = await this.addProductToWishlistUseCase.execute(finalUserId, resolvedProductId, savedLead.id);
        console.log('[LeadUseCase] Successfully added to wishlist:', result);
      } catch (error) {
        console.error('[LeadUseCase] CRITICAL: Failed to add product to wishlist:', error);
        throw error;
      }
    } else {
      console.log('[LeadUseCase] NOT adding to wishlist - productId:', resolvedProductId, 'hasAddProductToWishlistUseCase:', !!this.addProductToWishlistUseCase);
    }

    return savedLead;
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