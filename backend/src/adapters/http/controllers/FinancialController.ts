import { Request, Response } from 'express';
import { GetFinancialDashboardUseCase } from '@core/use-cases/financial/GetFinancialDashboardUseCase';

export class FinancialController {
  constructor(
    private getFinancialDashboardUseCase: GetFinancialDashboardUseCase
  ) {}

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const dashboardData = await this.getFinancialDashboardUseCase.execute();
      res.status(200).json(dashboardData);
    } catch (error: any) {
      console.error('Error fetching financial dashboard:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
