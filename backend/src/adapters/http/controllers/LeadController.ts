import { Request, Response, NextFunction } from 'express';
import { CreateLeadUseCase } from '@core/use-cases/lead/CreateLeadUseCase';
import { ListLeadsUseCase } from '@core/use-cases/lead/ListLeadsUseCase';
import { GetLeadByIdUseCase } from '@core/use-cases/lead/GetLeadByIdUseCase';
import { UpdateLeadStatusUseCase } from '@core/use-cases/lead/UpdateLeadStatusUseCase';
import { DeleteLeadUseCase } from '@core/use-cases/lead/DeleteLeadUseCase';
import { CreateLeadDTO, UpdateLeadDTO } from '@core/dto/LeadDTO';
import { LeadStatus } from '@core/domain/Lead';
import { createLeadSchema, updateLeadSchema } from '../validations/lead.validation';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class LeadController {
  constructor(
    private createLeadUseCase: CreateLeadUseCase,
    private listLeadsUseCase: ListLeadsUseCase,
    private getLeadByIdUseCase: GetLeadByIdUseCase,
    private updateLeadStatusUseCase: UpdateLeadStatusUseCase,
    private deleteLeadUseCase: DeleteLeadUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createLeadSchema.parse(req.body) as CreateLeadDTO;
      const authReq = req as any;
      if (authReq.user?.sub) {
        data.userId = authReq.user.sub;
      }
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