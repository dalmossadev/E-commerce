import { Request, Response, NextFunction } from 'express';
import { GetAdminDashboardUseCase } from '@core/use-cases/admin/GetAdminDashboardUseCase';

export class AdminController {
  constructor(private getAdminDashboardUseCase: GetAdminDashboardUseCase) {}

  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await this.getAdminDashboardUseCase.execute();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // stats implementation can be added to use case if needed
      res.json({ message: "Stats endpoint moved to Use Case in next iteration" });
    } catch (error) {
      next(error);
    }
  }
}
