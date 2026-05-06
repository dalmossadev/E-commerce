import { IFinancialTransactionRepository } from '@core/interfaces/IFinancialTransactionRepository';

export interface FinancialDashboardResult {
  currentBalance: {
    income: number;
    expense: number;
    fees: number;
    net: number;
  };
  charts: {
    daily: any[];
    weekly: any[];
    monthly: any[];
    yearly: any[];
  };
  recentTransactions: any[];
}

export class GetFinancialDashboardUseCase {
  constructor(
    private financialRepository: IFinancialTransactionRepository
  ) {}

  async execute(): Promise<FinancialDashboardResult> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Saldo Geral
    const balance = await this.financialRepository.calculateBalanceByPeriod(new Date('2020-01-01'), now);
    
    // Stats para Gráficos
    const daily = await this.financialRepository.getAggregatedStats(thirtyDaysAgo, now, 'day');
    const monthly = await this.financialRepository.getAggregatedStats(oneYearAgo, now, 'month');
    
    // Para simplificar o MVP, vamos derivar semanal e anual ou buscar também
    const weekly = await this.financialRepository.getAggregatedStats(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), now, 'week');
    const yearly = await this.financialRepository.getAggregatedStats(new Date('2020-01-01'), now, 'year');

    return {
      currentBalance: balance,
      charts: {
        daily,
        weekly,
        monthly,
        yearly
      },
      recentTransactions: [] 
    };
  }
}
