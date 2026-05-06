import { Request, Response, NextFunction } from 'express';
import { GetSettingByKeyUseCase } from '@core/use-cases/settings/GetSettingByKeyUseCase';
import { ListSettingsUseCase } from '@core/use-cases/settings/ListSettingsUseCase';
import { CreateSettingsUseCase } from '@core/use-cases/settings/CreateSettingsUseCase';
import { UpdateSettingsUseCase } from '@core/use-cases/settings/UpdateSettingsUseCase';
import { DeleteSettingsUseCase } from '@core/use-cases/settings/DeleteSettingsUseCase';
import { GetSettingsUseCase } from '@core/use-cases/settings/GetSettingsUseCase';
import { GetSiteInfoUseCase, SiteInfoDTO } from '@core/use-cases/settings/GetSiteInfoUseCase';
import { UpdateSiteInfoUseCase } from '@core/use-cases/settings/UpdateSiteInfoUseCase';
import { createSettingsSchema, updateSettingsSchema } from '../validations/settings.validation';

export class SettingsController {
  constructor(
    private getSettingByKeyUseCase: GetSettingByKeyUseCase,
    private getSettingsUseCase: GetSettingsUseCase,
    private listSettingsUseCase: ListSettingsUseCase,
    private createSettingsUseCase: CreateSettingsUseCase,
    private updateSettingsUseCase: UpdateSettingsUseCase,
    private deleteSettingsUseCase: DeleteSettingsUseCase,
    private getSiteInfoUseCase: GetSiteInfoUseCase,
    private updateSiteInfoUseCase: UpdateSiteInfoUseCase
  ) {}

  async getByKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = req.params.key as string;
      const settings = await this.getSettingByKeyUseCase.execute(key);
      if (!settings) {
        res.status(404).json({ message: 'Settings not found' });
        return;
      }
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.listSettingsUseCase.execute();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.getSettingsUseCase.execute();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createSettingsSchema.parse(req.body);
      const settings = await this.createSettingsUseCase.execute(data);
      res.status(201).json(settings);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = req.params.key as string;
      const data = updateSettingsSchema.parse(req.body);
      if (!data.value) {
        res.status(400).json({ message: 'Value is required' });
        return;
      }
      const settings = await this.updateSettingsUseCase.execute(key, data as { value: string });
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = req.params.key as string;
      await this.deleteSettingsUseCase.execute(key);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getSiteInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const siteInfo = await this.getSiteInfoUseCase.execute();
      res.json(siteInfo);
    } catch (error) {
      next(error);
    }
  }

  async updateSiteInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: Partial<SiteInfoDTO> = req.body;
      const siteInfo = await this.updateSiteInfoUseCase.execute(data);
      res.json(siteInfo);
    } catch (error) {
      next(error);
    }
  }
}
