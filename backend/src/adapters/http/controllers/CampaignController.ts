import { Request, Response, NextFunction } from 'express';
import { CreateCampaignUseCase, ListCampaignsUseCase, GetCampaignByIdUseCase, GetCampaignBySlugUseCase, UpdateCampaignUseCase, DeleteCampaignUseCase } from '@core/use-cases/campaign/CampaignUseCases';
import { CreateCampaignDTO, UpdateCampaignDTO, CampaignQueryDTO } from '@core/dto/CampaignDTO';
import { container } from '@core/container/Container';
import { createCampaignSchema, updateCampaignSchema } from '../validations/campaign.validation';

const parseId = (param: string | string[]): number | null => {
  const id = parseInt(Array.isArray(param) ? param[0] : param, 10);
  return isNaN(id) ? null : id;
};

export class CampaignController {
  private createCampaignUseCase: CreateCampaignUseCase;
  private listCampaignsUseCase: ListCampaignsUseCase;
  private getCampaignByIdUseCase: GetCampaignByIdUseCase;
  private getCampaignBySlugUseCase: GetCampaignBySlugUseCase;
  private updateCampaignUseCase: UpdateCampaignUseCase;
  private deleteCampaignUseCase: DeleteCampaignUseCase;

  constructor() {
    this.createCampaignUseCase = container.createCampaignUseCase();
    this.listCampaignsUseCase = container.listCampaignsUseCase();
    this.getCampaignByIdUseCase = container.getCampaignByIdUseCase();
    this.getCampaignBySlugUseCase = container.getCampaignBySlugUseCase();
    this.updateCampaignUseCase = container.updateCampaignUseCase();
    this.deleteCampaignUseCase = container.deleteCampaignUseCase();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createCampaignSchema.parse(req.body) as CreateCampaignDTO;
      const campaign = await this.createCampaignUseCase.execute(data);
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: CampaignQueryDTO = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };
      const result = await this.listCampaignsUseCase.execute(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid campaign ID' });
        return;
      }
      const campaign = await this.getCampaignByIdUseCase.execute(id);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const campaign = await this.getCampaignBySlugUseCase.execute(slug);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid campaign ID' });
        return;
      }
      const data = updateCampaignSchema.parse(req.body) as UpdateCampaignDTO;
      const campaign = await this.updateCampaignUseCase.execute(id, data);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ message: 'Invalid campaign ID' });
        return;
      }
      await this.deleteCampaignUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
