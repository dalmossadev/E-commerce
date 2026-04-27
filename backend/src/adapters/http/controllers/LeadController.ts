import { Request, Response, NextFunction } from 'express';
import { CreateLeadUseCase, ListLeadsUseCase, GetLeadByIdUseCase, UpdateLeadStatusUseCase, DeleteLeadUseCase } from '@core/use-cases/LeadUseCases';
import { CreateLeadDTO, UpdateLeadDTO } from '@core/dto/LeadDTO';
import { LeadStatus } from '@core/domain/Lead';
import { container } from '@core/container/Container';
import { createLeadSchema, updateLeadSchema } from '../validations/lead.validation';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class LeadController {
  private createLeadUseCase: CreateLeadUseCase;
  private listLeadsUseCase: ListLeadsUseCase;
  private getLeadByIdUseCase: GetLeadByIdUseCase;
  private updateLeadStatusUseCase: UpdateLeadStatusUseCase;
  private deleteLeadUseCase: DeleteLeadUseCase;

  constructor() {
    this.createLeadUseCase = container.createLeadUseCase();
    this.listLeadsUseCase = container.listLeadsUseCase();
    this.getLeadByIdUseCase = container.getLeadByIdUseCase();
    this.updateLeadStatusUseCase = container.updateLeadStatusUseCase();
    this.deleteLeadUseCase = container.deleteLeadUseCase();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createLeadSchema.parse(req.body) as CreateLeadDTO;
      const lead = await this.createLeadUseCase.execute(data);
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as LeadStatus | undefined;
      const leads = await this.listLeadsUseCase.execute(status);
      res.json(leads);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid lead ID' });
        return;
      }
      const lead = await this.getLeadByIdUseCase.execute(id);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid lead ID' });
        return;
      }
      const data = updateLeadSchema.parse(req.body) as UpdateLeadDTO;
      const lead = await this.updateLeadStatusUseCase.execute(id, data);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid lead ID' });
        return;
      }
      await this.deleteLeadUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}