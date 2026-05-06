import { Lead, LeadStatus } from '../../domain/Lead';
import { ILeadRepository } from '../../interfaces/ILeadRepository';
import { IProductRepository } from '../../interfaces/IProductRepository';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { CreateLeadDTO } from '../../dto/LeadDTO';
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors';

const VALIDATION_ERROR_MESSAGE = 'Nome do cliente e telefone são obrigatórios';

export interface ILeadValidator {
  validate(data: CreateLeadDTO): void;
}

export interface ILeadFactory {
  create(data: CreateLeadDTO): Lead;
}

export class LeadValidator implements ILeadValidator {
  validate(data: CreateLeadDTO): void {
    if (!data.customerName?.trim() || !data.customerPhone?.trim()) {
      throw new BadRequestError(VALIDATION_ERROR_MESSAGE);
    }
  }
}

export class LeadFactory implements ILeadFactory {
  create(data: CreateLeadDTO): Lead {
    const lead = new Lead();
    lead.sku = data.sku?.trim() || '';
    lead.customerName = data.customerName.trim();
    lead.customerPhone = data.customerPhone.trim();
    lead.customerEmail = data.customerEmail?.trim() || undefined;
    lead.notes = data.notes?.trim() || undefined;
    lead.productId = data.productId ?? undefined;
    lead.variantId = data.variantId ?? undefined;
    lead.status = LeadStatus.PENDING;
    return lead;
  }
}

export class CreateLeadUseCase {
  constructor(
    private leadRepository: ILeadRepository,
    private validator: ILeadValidator,
    private factory: ILeadFactory,
    private productRepository?: IProductRepository,
    private userRepository?: IUserRepository,
    private addProductToWishlistUseCase?: { execute(userId: number | undefined, productId: number, leadId?: number): Promise<any> }
  ) {}

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

    data.productId = resolvedProductId; 

    const lead = this.factory.create(data);
    const savedLead = await this.leadRepository.save(lead);

    if (this.addProductToWishlistUseCase) {
      try {
        await this.addProductToWishlistUseCase.execute(finalUserId, resolvedProductId, savedLead.id);
      } catch (error) {
        console.error('[LeadUseCase] CRITICAL: Failed to add product to wishlist:', error);
        throw error;
      }
    }

    return savedLead;
  }
}
